import type { FC } from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import {
  DesktopInputText,
  LockIcon,
  UserLoginIcon,
  Button,
  Checkbox,
  EyeIcon,
  CloseEyeIcon,
} from "@/shared/components";

import type { DesktopAuthLoginProps } from "./props";

export const DesktopAuthLogin: FC<DesktopAuthLoginProps> = ({
  onSubmit,
  handleRegForm,
}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", pass: "" } });

  const tDesktop = useTranslations("Desktop.Login");
  const t = useTranslations("Common");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="email"
        rules={{ required: t("EnterEmail") }}
        render={({ field }) => (
          <DesktopInputText
            label={t("Email")}
            bottomText={errors?.email?.message as string}
            isError={!!errors.email}
            showAsterisk={false}
            wrapperClassName="mb-6 mt-4 text-Regular16"
            {...field}
            icon={<UserLoginIcon size="sm" />}
          />
        )}
      />
      <Controller
        control={control}
        name="pass"
        rules={{
          required: t("EnterPassword"),
        }}
        render={({ field }) => (
          <DesktopInputText
            label={t("Password")}
            type={hidePassword ? "password" : ""}
            bottomText={errors?.pass?.message as string}
            showAsterisk={false}
            isError={!!errors.pass}
            wrapperClassName="text-Regular16"
            {...field}
            icon={<LockIcon size="sm" />}
            rightIcon={
              hidePassword ? (
                <EyeIcon color="gray-8" size="sm" />
              ) : (
                <CloseEyeIcon color="gray-8" size="sm" />
              )
            }
            rightIconClick={() => setHidePassword(!hidePassword)}
          />
        )}
      />
      <div className="mt-6 flex h-10 items-center justify-between">
        <Checkbox className="flex items-center" loginDesktop>
          {tDesktop("RememberMe")}
        </Checkbox>
        <div className="text-Regular14 text-colorPrimaryBase">
          {tDesktop("ForgotPassword")}
        </div>
      </div>
      <Button
        variant="primary"
        className="mt-7 rounded !py-2 px-4"
        size="desktopS"
        htmlType="submit"
      >
        {t("Login")}
      </Button>
      <div className="mt-6 flex items-center gap-5">
        <div className="text-Regular14">{tDesktop("NoAccount")}</div>
        <div
          className="cursor-pointer text-Regular16 text-colorPrimaryBase"
          onClick={handleRegForm}
        >
          {tDesktop("Register")}
        </div>
      </div>
    </form>
  );
};
