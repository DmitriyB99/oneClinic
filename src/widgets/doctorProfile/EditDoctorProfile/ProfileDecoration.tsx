import type { FC } from "react";
import { useMemo, useRef, useState } from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useMutation } from "react-query";

import type { EditDoctorProfileForm } from "@/pages/myDoctor/editProfile";
import { doctorsApi } from "@/shared/api";
import type { DoctorPhotoUpdatePayload } from "@/shared/api/dtos";
import {
  Avatar,
  DefaultCell,
  Dialog,
  InputTextarea,
  Island,
  PlusBadge,
} from "@/shared/components";

interface ProfileDecorationProps {
  control: Control<EditDoctorProfileForm>;
  fullName?: string;
  doctorProfileId: string;
  photoUrl?: string;
}

export const ProfileDecoration: FC<ProfileDecorationProps> = ({
  control,
  fullName,
  doctorProfileId,
  photoUrl,
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const { mutate: uploadDoctorProfilePhoto } = useMutation(
    ["uploadDoctorProfilePhoto"],
    (updateProfilePhoto: DoctorPhotoUpdatePayload) =>
      doctorsApi?.uploadDoctorProfilePhoto(updateProfilePhoto)
  );

  const emptyPhotoString = useMemo(() => {
    const firstLetter = fullName?.split(" ")?.[0]?.charAt(0) ?? "";
    const secondLetter = fullName?.split(" ")?.[0]?.charAt(0) ?? "";

    return `${firstLetter} ${secondLetter}`;
  }, [fullName]);

  return (
    <Island className="mt-2 h-full !px-0 pb-2 pt-0">
      {/* <div className="relative"> // TODO: Uncomment once PRO subscription is available
        <div className="absolute z-50 mt-8 flex w-full flex-col items-center justify-center text-center text-white">
          <div className="text-Bold20">Обложка</div>
          <div className="mb-3 mt-2 text-Regular16">
            Доступна с PRO подпиской
          </div>
          <Button className="h-8 rounded-xl">Оформить подписку</Button>
        </div>
        <div className="relative mb-4 overflow-hidden rounded-t-3xl">
          <img
            src="https://picsum.photos/350/150"
            alt="image"
            height="148"
            className="h-[148px] w-full blur-lg"
          />
        </div>
      </div> */}
      <div className="flex items-center justify-start p-4">
        <Avatar
          size="clinicAva"
          /* eslint-disable-next-line compat/compat */
          src={photo ? URL.createObjectURL(photo) : photoUrl}
          bottomRightIcon={<PlusBadge setOpenDialog={setOpenDialog} />}
          text={emptyPhotoString}
        />
        <input
          className="hidden"
          type="file"
          accept="image/*"
          ref={inputFileRef}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              setPhoto(file);
              uploadDoctorProfilePhoto({
                profileId: doctorProfileId ?? "",
                file: event.target.files?.item(0),
              });
            }
          }}
        />
        <div className="ml-4 flex flex-col ">
          <div className="text-Bold20">{fullName}</div>
        </div>
      </div>
      <div className="m-4">
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <InputTextarea
              className="w-full border-2 !border-solid border-gray-2 focus:!border-brand-primary"
              placeholder="Например, детский врач ЛОР"
              rows={4}
              {...field}
            />
          )}
        />
      </div>
      {/* <div className="absolute bottom-20 flex w-full items-center justify-center px-4"> // TODO: Add when PRO subscription is available
        <Button variant="secondary" className="w-full">
          Как мой профиль видит пациент
        </Button>
      </div> */}
      <Dialog isOpen={openDialog} setIsOpen={setOpenDialog} className="!p-0">
        <DefaultCell
          title="Выбрать другое фото"
          className="cursor-pointer px-2"
          rightElement={<div />}
          onClick={() => {
            inputFileRef.current?.click();
          }}
        />
        <DefaultCell
          title="Удалить фото"
          className="cursor-pointer px-2"
          rightElement={<div />}
          onClick={() => {
            setPhoto(null);
            setOpenDialog(false);
          }}
        />
      </Dialog>
    </Island>
  );
};
