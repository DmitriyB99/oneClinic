import type { FC } from "react";
import { useMemo, useState } from "react";
import { Controller } from "react-hook-form";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { AuthDoctorSpecialtiesDialog } from "@/entities/login";
import {
  ArrowLeftIcon,
  Button,
  Checkbox,
  InputText,
  Navbar,
} from "@/shared/components";
import type {
  DoctorRegistrationModel,
  RegistrationStepModel,
} from "@/widgets/auth/models";

export const Step2DoctorAuth: FC<
  RegistrationStepModel<DoctorRegistrationModel>
> = ({ back, next, control, setValue, watch }) => {
  const tMob = useTranslations("Mobile.Login");
  const t = useTranslations("Common");

  const [isConsent, setIsConsent] = useState<boolean>(false);
  const [speciality, setSpeciality] = useState<string>("");
  const [isChooseSpecialityDialogOpen, setIsChooseSpecialityDialogOpen] =
    useState<boolean>(false);
  //TODO check hookForm
  const iin = watch?.("iin");
  const phoneNumber = watch?.("phoneNumber");

  const isEnabled = useMemo(
    () => speciality && isConsent && iin && iin.length === 12 && phoneNumber,
    [iin, isConsent, phoneNumber, speciality]
  );

  return (
    <div className="p-4">
      <Navbar
        title={t("Registration")}
        description={t("StepSomeOfSome", { step: 2, allStep: 2 })}
        className="mb-2 px-0"
        buttonIcon={<ArrowLeftIcon />}
        leftButtonOnClick={back}
      />
      <div className="py-4">
        <Controller
          control={control}
          rules={{
            required: t("FillInIIN"),
          }}
          render={({ field }) => (
            <InputText
              type="number"
              label="ИИН"
              name="iin"
              wrapperClassName="mb-6"
              value={field.value}
              onChange={(event) => {
                if (event.target.value.length <= 12) {
                  field.onChange((event?.target as HTMLInputElement).value);
                }
              }}
            />
          )}
          name="iin"
        />
        <InputText
          label={t("Speciality")}
          name="speciality"
          wrapperClassName="my-6"
          value={speciality}
          isSelect={true}
          onChange={(event) => {
            setSpeciality(event.target.value);
          }}
          onFocus={() => setIsChooseSpecialityDialogOpen(true)}
        />
        <Controller
          control={control}
          name="email"
          rules={{
            required: t("EnterEmail"),
          }}
          render={({ field }) => (
            <InputText label={t("Email")} wrapperClassName="my-6" {...field} />
          )}
        />
        <Controller
          control={control}
          name="phoneNumber"
          rules={{
            required: tMob("EnterYourPhoneNumber"),
          }}
          render={({ field }) => (
            <InputText
              isPhone
              showAsterisk
              label={t("PhoneNumber")}
              wrapperClassName="my-6"
              {...field}
            />
          )}
        />

        <div className="flex items-center">
          <Checkbox
            checked={isConsent}
            className="mr-4"
            onChange={(event) => setIsConsent(event.target.checked)}
          />
          <div className="text-Regular12 text-secondaryText">
            Даю согласие на обработку моих персональных данных и соглашаюсь с{" "}
            {""}
            <Link href="" className="no-underline">
              правилами сервиса
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 my-5 w-full px-4">
          <Button
            block
            onClick={() => {
              setValue?.("specialityCodes", [speciality]);
              next?.();
            }}
            disabled={!isEnabled}
          >
            {t("IsReady")}
          </Button>
        </div>
      </div>
      <AuthDoctorSpecialtiesDialog
        open={isChooseSpecialityDialogOpen}
        setOpen={setIsChooseSpecialityDialogOpen}
        setSpeciality={setSpeciality}
      />
    </div>
  );
};
