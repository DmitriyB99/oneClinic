import { useCallback, useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "react-query";
import { useTranslations } from "next-intl";

import dayjs from "dayjs";

import { medicalCardApi } from "@/shared/api/medicalCard";
import {
  ArrowLeftIcon,
  Button,
  DataPickerInputText,
  Dialog,
  InputText,
  SegmentedControl,
} from "@/shared/components";
import { dateOfBirthFormat } from "@/shared/config";
import type {
  MedicalCard,
  PersonalDataFormValues,
} from "@/widgets/medicalCard";
import { patientProfileApi } from "@/shared/api/patient/profile";
import { Spin } from "antd";
import { MyProfileForm } from "@/entities/myProfile";

export const PersonalDataDialog = ({
  personalDataDialogVisible,
  setPersonalDataDialogVisible,
  refetchMyCard,
  refetchProfile,
  currentMedicalCard,
}) => {
  const t = useTranslations("Common");

  const { control, handleSubmit, reset } = useForm<PersonalDataFormValues>();

  const { mutate: updateMyProfile } = useMutation(
    ["updateMyProfile"],
    (updatedProfile: MyProfileForm) =>
      patientProfileApi.updateMyProfile(updatedProfile).then(() => {
        refetchProfile();
      })
  );

  const { mutate: updateMedicalCard } = useMutation(
    ["updateMedicalCard"],
    ({
      id,
      data,
    }: {
      id: string;
      data: Partial<MedicalCard["medical_card"]>;
    }) =>
      medicalCardApi.updateMedicalCard(id, data).then(() => {
        refetchMyCard();
      })
  );

  useEffect(() => {
    reset({
      birth_date: dayjs(currentMedicalCard?.birth_date ?? new Date()).format(
        "DD.MM.YYYY"
      ),
      height: currentMedicalCard?.medical_card?.height ?? 0,
      gender: currentMedicalCard?.gender ?? "male",
      name: currentMedicalCard?.name ?? "",
      father_name: currentMedicalCard?.father_name ?? "",
      surname: currentMedicalCard?.surname ?? "",
      weight: currentMedicalCard?.medical_card?.weight ?? 0,
      iin: currentMedicalCard?.iin ?? "",
    });
  }, [currentMedicalCard, reset]);

  const onSubmit: SubmitHandler<PersonalDataFormValues> = useCallback(
    async (data) => {
      try {
        await updateMedicalCard({
          id: currentMedicalCard?.id,
          data: {
            height: Number(data?.height),
            weight: Number(data?.weight),
          },
        });

        await updateMyProfile({
          birth_date: data?.birth_date?.split(".").reverse().join("-"),
          father_name: data?.father_name,
          gender: data?.gender,
          name: data?.name,
          surname: data?.surname,
          iin: data?.iin,
        });

        setPersonalDataDialogVisible(false);
      } catch (err: unknown) {
        console.log(err);
      }
    },
    [currentMedicalCard, setPersonalDataDialogVisible, updateMedicalCard]
  );

  const handleOnSubmit = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  if (!currentMedicalCard) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spin />
      </div>
    );
  }

  return (
    <Dialog
      isOpen={personalDataDialogVisible}
      setIsOpen={setPersonalDataDialogVisible}
    >
      <div className="flex h-screen flex-col justify-between">
        <div className="flex flex-col justify-start">
          <div className="flex items-center justify-between">
            <Button
              size="s"
              variant="tinted"
              className="bg-gray-2"
              onClick={() => {
                setPersonalDataDialogVisible(false);
              }}
            >
              <ArrowLeftIcon />
            </Button>
            <div className="mr-12 text-Bold16">Укажите личные данные</div>
            <div />
          </div>
          <div className="mt-4">
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
          </div>
          <Controller
            control={control}
            render={({ field }) => (
              <InputText
                label={t("IIN")}
                name="iin"
                value={field.value}
                onChange={(event) => {
                  if (event.target.value.length <= 12) {
                    field.onChange((event?.target as HTMLInputElement).value);
                  }
                }}
                showAsterisk={false}
                wrapperClassName="mt-5"
              />
            )}
            name="iin"
            defaultValue={currentMedicalCard?.iin}
          />
          <Controller
            control={control}
            render={({ field }) => (
              <InputText
                label="Фамилия"
                name="surname"
                value={field.value}
                onChange={(event) => {
                  field.onChange(event);
                }}
                showAsterisk={false}
                wrapperClassName="mt-5"
              />
            )}
            name="surname"
            defaultValue={currentMedicalCard?.surname}
          />
          <Controller
            control={control}
            render={({ field }) => (
              <InputText
                label="Имя"
                name="name"
                value={field.value}
                onChange={(event) => {
                  field.onChange(event);
                }}
                showAsterisk={false}
                wrapperClassName="mt-6"
              />
            )}
            name="name"
            defaultValue={currentMedicalCard?.name}
          />
          <Controller
            control={control}
            render={({ field }) => (
              <InputText
                label="Отчество"
                name="patronymicName"
                value={field.value}
                onChange={(event) => {
                  field.onChange(event);
                }}
                showAsterisk={false}
                wrapperClassName="mt-6"
              />
            )}
            name="father_name"
            defaultValue={currentMedicalCard?.father_name}
          />
          <Controller
            control={control}
            render={({ field }) => (
              <DataPickerInputText
                format={dateOfBirthFormat}
                onChange={(dateString) =>
                  field.onChange(dateString?.format(dateOfBirthFormat))
                }
                value={
                  field?.value ? dayjs(field.value, dateOfBirthFormat) : null
                }
                className="mt-6"
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
            defaultValue={currentMedicalCard?.birth_date}
          />

          <Controller
            control={control}
            render={({ field }) => (
              <InputText
                label="Вес"
                name="weight"
                value={String(field.value)}
                onChange={(event) => {
                  field.onChange(event.target.value.replace(/\D/g, ""));
                }}
                showAsterisk={false}
                wrapperClassName="mt-6"
              />
            )}
            name="weight"
            defaultValue={currentMedicalCard?.medical_card?.weight}
          />
          <Controller
            control={control}
            render={({ field }) => (
              <InputText
                label="Рост"
                name="height"
                value={String(field.value)}
                onChange={(event) => {
                  field.onChange(event.target.value.replace(/\D/g, ""));
                }}
                showAsterisk={false}
                wrapperClassName="mt-6"
              />
            )}
            name="height"
            defaultValue={currentMedicalCard?.medical_card?.height}
          />
        </div>
        <Button className="w-full" onClick={handleOnSubmit}>
          Готово
        </Button>
      </div>
    </Dialog>
  );
};
