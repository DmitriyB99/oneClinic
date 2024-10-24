import type { FC } from "react";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { dictionaryApi } from "@/shared/api/dictionary";
import {
  Button,
  Checkbox,
  DesktopInputText,
  Select,
} from "@/shared/components";
import type {
  DoctorRegistrationModel,
  RegistrationStepModel,
} from "@/widgets/auth";

export const Step2DoctorAuth: FC<
  RegistrationStepModel<DoctorRegistrationModel>
> = ({ back, next, setValue }) => {
  const [isConsent, setIsConsent] = useState<boolean>(false);

  const t = useTranslations("Common");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorRegistrationModel>();
  const onSubmit = useCallback(
    ({ phoneNumber, email, specialityCodes, iin }: DoctorRegistrationModel) => {
      setValue?.("specialityCodes", specialityCodes);
      setValue?.("phoneNumber", phoneNumber);
      setValue?.("email", email);
      setValue?.("iin", iin);
      next?.();
    },
    [next, setValue]
  );

  const { data: specialities } = useQuery(["getSpecialities"], () =>
    dictionaryApi.getSpecialities().then((res) =>
      res.data.result.map(({ code, name }) => ({
        value: code,
        label: name,
      }))
    )
  );

  return (
    <>
      <div className="flex flex-col gap-6">
        <Controller
          control={control}
          name="specialityCodes"
          rules={{
            required: t("RequiredField"),
          }}
          render={({ field }) => (
            <Select
              mode="multiple"
              className="mt-2 w-full rounded-xl border-2 border-solid border-gray-200 py-1 [&>*.ant-select-selector]:!border-0"
              placeholder={t("SelectSpecialties")}
              size="large"
              isError={!!errors?.specialityCodes}
              bottomText={errors?.specialityCodes?.message}
              options={specialities ?? []}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          rules={{
            required: t("RequiredField"),
          }}
          render={({ field }) => (
            <DesktopInputText
              label={t("Email")}
              showAsterisk={false}
              inputClassName="pl-3"
              wrapperClassName="text-Regular16"
              isError={!!errors?.email}
              bottomText={errors?.email?.message}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="phoneNumber"
          rules={{
            required: t("RequiredField"),
          }}
          render={({ field }) => (
            <DesktopInputText
              label={t("Phone")}
              showAsterisk={false}
              isPhone
              inputClassName="pl-3"
              wrapperClassName="text-Regular16"
              isError={!!errors?.phoneNumber}
              bottomText={errors?.phoneNumber?.message}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="iin"
          rules={{
            required: t("RequiredField"),
            minLength: {
              value: 12,
              message: t("RequiredIINLength"),
            },
          }}
          render={({ field }) => (
            <DesktopInputText
              wrapperClassName="text-Regular16"
              label={t("IIN")}
              inputClassName="pl-3"
              showAsterisk={false}
              type="number"
              maxLength={12}
              isError={!!errors?.iin}
              bottomText={errors?.iin?.message}
              {...field}
            />
          )}
        />
        <div className="flex">
          <Checkbox
            value={isConsent}
            className="mr-4"
            onChange={(event) => setIsConsent(event.target.checked)}
            loginDesktop
          />
          <div className="text-Regular14 text-secondaryText">
            {t("GiveConsentAndAgree")}
            <Link href="" className="ml-1 no-underline">
              {t("ServiceRules")}
            </Link>
          </div>
        </div>
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
            disabled={!isConsent}
          >
            {t("Next")}
          </Button>
        </div>
      </div>
    </>
  );
};
