import type { FC } from "react";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { Button, DesktopInputText } from "@/shared/components";
import type {
  ManagerRegistrationModel,
  RegistrationStepModel,
} from "@/widgets/auth/models";

export const Step1ManagerAuth: FC<
  RegistrationStepModel<ManagerRegistrationModel>
> = ({ back, next, reset }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<ManagerRegistrationModel, "email" | "phoneNumber">>();

  const onSubmit = useCallback(
    (data: Omit<ManagerRegistrationModel, "email" | "phoneNumber">) => {
      reset?.(data);
      next?.();
    },
    [reset, next]
  );

  const tDesktop = useTranslations("Desktop.Login");
  const t = useTranslations("Common");

  return (
    <>
      <Controller
        control={control}
        name="lastName"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <DesktopInputText
            wrapperClassName="text-Regular16"
            inputClassName="pl-3"
            label={t("LastName")}
            isError={!!errors?.lastName}
            bottomText={errors?.lastName?.message}
            showAsterisk={false}
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
            inputClassName="pl-3"
            isError={!!errors?.firstName}
            bottomText={errors?.firstName?.message}
            label={t("FirstName")}
            showAsterisk={false}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="fatherName"
        render={({ field }) => (
          <DesktopInputText
            wrapperClassName="text-Regular16"
            inputClassName="pl-3"
            label={tDesktop("FatherNameNotNecessary")}
            showAsterisk={false}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="name"
        rules={{
          required: t("RequiredField"),
        }}
        render={({ field }) => (
          <DesktopInputText
            wrapperClassName="text-Regular16"
            isError={!!errors?.name}
            bottomText={errors?.name?.message}
            inputClassName="pl-3"
            label={t("ClinicName")}
            showAsterisk={false}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="bin"
        rules={{
          required: t("RequiredField"),
          minLength: {
            value: 12,
            message: tDesktop("RequiredBINLength"),
          },
        }}
        render={({ field }) => (
          <DesktopInputText
            wrapperClassName="text-Regular16"
            inputClassName="pl-3"
            isError={!!errors?.bin}
            bottomText={errors?.bin?.message}
            label={tDesktop("ClinicBIN")}
            showAsterisk={false}
            type="number"
            maxLength={12}
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
    </>
  );
};
