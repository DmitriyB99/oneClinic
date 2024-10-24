import type { FC } from "react";
import { useCallback, useRef, useState } from "react";

import { useTranslations } from "next-intl";

import type { AuthDoctorProfileSetupStepModel } from "@/entities/login";
import { doctorsApi } from "@/shared/api/doctors";
import {
  ArrowLeftIcon,
  Button,
  CameraIcon,
  DefaultCell,
  Dialog,
  Navbar,
} from "@/shared/components";

export const AuthDoctorSetProfilePhoto: FC<AuthDoctorProfileSetupStepModel> = ({
  next,
  back,
  doctorId,
}) => {
  const t = useTranslations("Common");
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleNextClick = useCallback(async () => {
    await doctorsApi.uploadDoctorProfilePhoto({
      profileId: doctorId ?? "",
      file: photo,
    });
    next?.();
  }, [doctorId, next, photo]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white">
      <div className="absolute top-0 w-full">
        <Navbar
          className="mb-4"
          title={t("ProfilePhoto")}
          description={t("StepSomeOfSome", { step: 6, allStep: 6 })}
          buttonIcon={<ArrowLeftIcon />}
          leftButtonOnClick={() => back?.()}
        />
      </div>
      {photo ? (
        <div>
          <img
            alt="avatarPhoto"
            width={150}
            height={150}
            className="rounded-bigIcon"
            /* eslint-disable-next-line compat/compat */
            src={URL.createObjectURL(photo)}
          />
        </div>
      ) : (
        <div className="rounded-bigIcon bg-gray-2 p-10">
          <CameraIcon size="xl" color="gray-icon" />
        </div>
      )}
      <div className="absolute bottom-4 flex w-full flex-col px-4">
        {photo ? (
          <>
            <Button className="mb-4" onClick={handleNextClick}>
              {t("Continue")}
            </Button>
            <Button variant="secondary" onClick={() => setOpenDialog(true)}>
              {t("Change")}
            </Button>
          </>
        ) : (
          <>
            <Button
              className="mb-4"
              onClick={() => {
                inputFileRef.current?.click();
              }}
            >
              {t("SelectPhoto")}
            </Button>

            <Button variant="tertiary" onClick={() => next?.()}>
              {t("NotNow")}
            </Button>
          </>
        )}
      </div>
      <Dialog isOpen={openDialog} setIsOpen={setOpenDialog}>
        <Button
          variant="tertiary"
          className="!p-0"
          onClick={() => {
            inputFileRef?.current?.click();
          }}
        >
          <DefaultCell title={t("ChooseAnotherPhoto")} />
        </Button>
        <Button
          variant="tertiary"
          className="!p-0"
          onClick={() => {
            setPhoto(null);
          }}
        >
          <DefaultCell title={t("DeletePhoto")} />
        </Button>
      </Dialog>
      <input
        className="hidden"
        type="file"
        accept="image/*"
        ref={inputFileRef}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            setPhoto(file);
          }
        }}
      />
    </div>
  );
};
