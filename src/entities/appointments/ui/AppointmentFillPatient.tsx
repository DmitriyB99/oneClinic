import type { FC } from "react";
import { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { PatientInfoFillDialogProps } from "@/entities/appointments";
import {
  Button,
  CloseIcon,
  DataPickerInputText,
  Dialog,
  InputText,
  Island,
  SegmentedControl,
} from "@/shared/components";
import { systemDateWithoutTime } from "@/shared/config";
import { ConfirmationCloseDialog } from "@/widgets/confirmationClose/ui/ConfirmationClose";
import { dictionaryApi } from "@/shared/api/dictionary";
import { useMutation, useQuery } from "react-query";
import { InputSelect } from "@/shared/components/molecules/input/InputSelect";
import { FamilyMember, patientFamilyApi } from "@/shared/api/patient/family";
import { MyProfileForm } from "@/entities/myProfile";
import { patientProfileApi } from "@/shared/api/patient/profile";

export const AppointmentFillPatient: FC<PatientInfoFillDialogProps> = ({
  handleBack,
  isMyProfile = false,
  refetch,
  refetchMyProfile,
}) => {
  const t = useTranslations("Common");
  const { control, handleSubmit } = useForm();

  // const [isOpenConfirmationDialog, setIsOpenConfirmationDialog] =
  //   useState<boolean>(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState<boolean>(true);

  const { mutate: updateMyProfile } = useMutation(
    ["updateMyProfile"],
    (updatedProfile: MyProfileForm) =>
      patientProfileApi.updateMyProfile(updatedProfile),
    {
      onSuccess: () => {
        refetchMyProfile?.();
        refetch?.();
        handleBack?.();
      },
    }
  );

  const { mutate: createFamilyMember } = useMutation(
    ["createFamilyMember"],
    (data: FamilyMember) =>
      patientFamilyApi.createFamilyMember(data).then(() => {
        refetch?.();
        handleBack?.();
      })
  );

  const onSubmit = (data: FamilyMember) => {
    isMyProfile ? updateMyProfile(data) : createFamilyMember(data);
  };

  const handleOnSubmit = useCallback(() => {
    handleSubmit(onSubmit, (errors) => {
      console.log("Validation errors: ", errors);
    })();
  }, [handleSubmit, onSubmit]);

  const { data: familyMembers } = useQuery(["getFamilyMembers"], () =>
    dictionaryApi.getFamilyMembers().then((response) =>
      response.data.result.map(
        (familyMemberType: { code: string; name: string }) => ({
          id: familyMemberType.code,
          name: familyMemberType.name ?? "No name",
        })
      )
    )
  );
  // const closeFormDialog = useCallback(() => {
  //   setIsFormDialogOpen(false);
  // }, []);

  return (
    <Dialog isOpen={isFormDialogOpen} setIsOpen={setIsFormDialogOpen}>
      <Island className="!px-0 !pt-4">
        <div className="flex items-center justify-start">
          <div className="text-Bold24">
            {isMyProfile
              ? "Укажите информацию о себе, так врач точнее проконсультирует вас"
              : "Укажите информацию о члене семьи, так врач точнее проконсультирует его"}
          </div>
          <div
            className="flex cursor-pointer text-Bold20"
            onClick={() => setIsFormDialogOpen(false)}
          >
            <CloseIcon />
          </div>
        </div>
        <Controller
          control={control}
          defaultValue={"male"}
          render={({ field }) => (
            <div className="my-6">
              <SegmentedControl
                options={[t("Man"), t("Woman")]}
                size="l"
                value={field?.value === "male" ? t("Man") : t("Woman")}
                onChange={(value) => {
                  field.onChange(value === t("Man") ? "male" : "female");
                }}
              />
            </div>
          )}
          name="gender"
        />
        <Controller
          control={control}
          rules={{
            required: t("FillInIIN"),
          }}
          render={({ field }) => (
            <InputText
              type="number"
              label={t("IIN")}
              name="iin"
              value={field.value}
              wrapperClassName="mb-6"
              showAsterisk={false}
              onChange={(event) => {
                if (event.target.value.length <= 12) {
                  field.onChange((event?.target as HTMLInputElement).value);
                }
              }}
            />
          )}
          name="iin"
        />
        <Controller
          control={control}
          rules={{ required: t("FillInLastName") }}
          render={({ field }) => (
            <InputText
              label={t("LastName")}
              name="surname"
              value={field.value}
              wrapperClassName="mb-6"
              showAsterisk={false}
              onChange={(event) => {
                field.onChange((event?.target as HTMLInputElement).value);
              }}
            />
          )}
          name="surname"
        />
        <Controller
          control={control}
          rules={{ required: t("FillInFirstName") }}
          render={({ field }) => (
            <InputText
              label={t("FirstName")}
              name="firstName"
              value={field.value}
              wrapperClassName="mb-6"
              showAsterisk={false}
              onChange={(event) => {
                field.onChange((event?.target as HTMLInputElement).value);
              }}
            />
          )}
          name="name"
        />
        <Controller
          control={control}
          rules={{ required: t("FillPatronymicName") }}
          render={({ field }) => (
            <InputText
              label={"Отчество"}
              name="patronymicName"
              value={field.value}
              wrapperClassName="mb-6"
              showAsterisk={false}
              onChange={(event) => {
                field.onChange((event?.target as HTMLInputElement).value);
              }}
            />
          )}
          name="father_name"
        />
        <Controller
          control={control}
          render={({ field }) => (
            <InputText
              label="Номер телефона"
              isPhone
              showAsterisk={false}
              wrapperClassName="mb-6"
              {...field}
            />
          )}
          name="phone"
        />
        <Controller
          control={control}
          render={({ field }) => (
            <DataPickerInputText
              format={systemDateWithoutTime}
              onChange={(dateString) =>
                field.onChange(dateString?.format(systemDateWithoutTime))
              }
              value={
                field?.value ? dayjs(field.value, systemDateWithoutTime) : null
              }
              className="mb-6"
              onFocus={() => {
                // to hide the keyboard when the input is selected
                const activeElement = document.activeElement as HTMLElement;
                if (activeElement) {
                  activeElement.blur();
                }
              }}
            />
          )}
          name="birth_date"
        />
        {!isMyProfile && (
          <Controller
            control={control}
            name="family_member_code"
            rules={{ required: t("FillInByWho") }}
            render={({ field }) => (
              <InputSelect
                wrapperClassName="mb-6"
                label="Кем приходится?"
                name="relation"
                value={field.value}
                options={familyMembers || []}
                showAsterisk={false}
                onChange={(value) => {
                  const selectedFamilyMember = familyMembers.find(
                    (member) => member.id === value.target.value
                  );
                  field.onChange(selectedFamilyMember?.id);
                }}
                readOnly
              />
            )}
          />
        )}
        <Controller
          control={control}
          render={({ field }) => (
            <InputText
              label="Вес"
              name="weight"
              wrapperClassName="mb-6"
              value={field.value ? String(field.value) : ""}
              onChange={(event) => {
                const numericValue = Number(
                  event.target.value.replace(/\D/g, "")
                );
                field.onChange(numericValue);
              }}
              showAsterisk={false}
            />
          )}
          name="weight"
        />
        <Controller
          control={control}
          render={({ field }) => (
            <InputText
              label="Рост"
              name="height"
              wrapperClassName="mb-6"
              value={field.value ? String(field.value) : ""}
              onChange={(event) => {
                const numericValue = Number(
                  event.target.value.replace(/\D/g, "")
                );
                field.onChange(numericValue);
              }}
              showAsterisk={false}
            />
          )}
          name="height"
        />
        <Button variant="primary" className="w-full" onClick={handleOnSubmit}>
          {t("IsReady")}
        </Button>
        {/* <ConfirmationCloseDialog
          isOpen={isOpenConfirmationDialog}
          setIsOpen={setIsOpenConfirmationDialog}
          onConfirmClose={closeFormDialog}
        /> */}
      </Island>
    </Dialog>
  );
};
