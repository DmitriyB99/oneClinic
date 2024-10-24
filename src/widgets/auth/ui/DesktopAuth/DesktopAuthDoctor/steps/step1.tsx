import type { FC } from "react";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { Button, DesktopInputText } from "@/shared/components";
import type {
  DoctorRegistrationModel,
  RegistrationStepModel,
} from "@/widgets/auth";

export const Step1DoctorAuth: FC<
  RegistrationStepModel<DoctorRegistrationModel>
> = ({ back, next, reset }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorRegistrationModel>();

  const tDesktop = useTranslations("Desktop.Login");
  const t = useTranslations("Common");

  const onSubmit = useCallback(
    (data: DoctorRegistrationModel) => {
      reset?.(data);
      next?.();
    },
    [next, reset]
  );
  return (
    <>
      <div className="flex flex-col gap-6">
        <Controller
          control={control}
          name="lastName"
          rules={{
            required: t("RequiredField"),
          }}
          render={({ field }) => (
            <DesktopInputText
              wrapperClassName="text-Regular16"
              label={t("LastName")}
              inputClassName="pl-3"
              showAsterisk={false}
              isError={!!errors?.lastName}
              bottomText={errors?.lastName?.message}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="firstName"
          rules={{
            required: t("RequiredField"),
          }}
          render={({ field }) => (
            <DesktopInputText
              wrapperClassName="text-Regular16"
              label={t("FirstName")}
              inputClassName="pl-3"
              showAsterisk={false}
              isError={!!errors?.firstName}
              bottomText={errors?.firstName?.message}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="fatherName"
          render={({ field }) => (
            <DesktopInputText
              label={tDesktop("FatherNameNotNecessary")}
              wrapperClassName="text-Regular16"
              inputClassName="pl-3"
              showAsterisk={false}
              {...field}
            />
          )}
        />
        <div className="flex w-full flex-row gap-4">
          <Button
            variant="secondary"
            className="rounded !py-2 px-4"
            size="desktopS"
            onClick={back}
          >
            {t("Back")}
          </Button>
          <Button
            variant="primary"
            className="rounded !py-2 px-4"
            size="desktopS"
            onClick={() => handleSubmit(onSubmit)()}
          >
            {t("Next")}
          </Button>
        </div>
      </div>
    </>
  );
};
