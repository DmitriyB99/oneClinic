import { useCallback, useState } from "react";
import type { FC } from "react";
import { Controller, useForm } from "react-hook-form";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button, Checkbox, DesktopInputText } from "@/shared/components";
import type {
  ManagerRegistrationModel,
  RegistrationStepModel,
} from "@/widgets/auth/models";

export const Step2ManagerAuth: FC<
  RegistrationStepModel<ManagerRegistrationModel>
> = ({ back, next, setValue }) => {
  const [isConsent, setIsConsent] = useState<boolean>(false);

  const t = useTranslations("Common");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; phoneNumber: string }>();

  const onSubmit = useCallback(
    ({ email, phoneNumber }: { email: string; phoneNumber: string }) => {
      setValue?.("email", email);
      setValue?.("phoneNumber", phoneNumber);
      next?.();
    },
    [setValue, next]
  );

  return (
    <>
      <div className="flex flex-col gap-6">
        <Controller
          control={control}
          name="email"
          rules={{
            required: t("RequiredField"),
          }}
          render={({ field }) => (
            <DesktopInputText
              label={t("Email")}
              inputClassName="pl-3"
              isError={!!errors?.email}
              bottomText={errors?.email?.message}
              showAsterisk={false}
              wrapperClassName="text-Regular16"
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
              inputClassName="pl-3"
              showAsterisk={false}
              isError={!!errors?.phoneNumber}
              bottomText={errors?.phoneNumber?.message}
              wrapperClassName="text-Regular16"
              isPhone
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
            disabled={!isConsent}
            onClick={() => handleSubmit(onSubmit)()}
          >
            {t("IsReady")}
          </Button>
        </div>
      </div>
    </>
  );
};
