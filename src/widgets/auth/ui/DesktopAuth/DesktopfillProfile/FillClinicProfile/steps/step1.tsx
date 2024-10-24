import type { FC } from "react";
import { useState, useMemo, useCallback, useEffect, useContext } from "react";
import { useMutation } from "react-query";

import { notification } from "antd";
import { useTranslations } from "next-intl";

import { authApi } from "@/shared/api";
import {
  Button,
  CloseEyeIcon,
  DesktopInputText,
  EyeIcon,
} from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";
import type { StepModel } from "@/widgets/auth";

export const Step1FillProfile: FC<StepModel> = ({ next, back }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const { user } = useContext(UserContext);
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.FillProfile");

  const { mutate: changePassword } = useMutation(["updateMyPassword"], () =>
    authApi.updateMyPassword(user?.user_id ?? "", password)
  );

  const openNotification = useCallback(() => {
    api["success"]({
      message: tDesktop("Welcome"),
      description: tDesktop("SetPasswordAndFillClinicProfile"),
      placement: "bottomRight",
      duration: 5,
    });
  }, [api, tDesktop]);
  useEffect(() => openNotification(), [openNotification]);

  const arePasswordsEqual = useMemo(() => {
    if (password === confirmPassword && password?.length > 0) {
      return true;
    } else if (confirmPassword?.length > 0) {
      return false;
    } else {
      return null;
    }
  }, [confirmPassword, password]);

  return (
    <div className="mt-24 w-[508px]">
      <div className="text-Bold32">{t("SetPassword")}</div>
      <DesktopInputText
        label={t("Password")}
        name="password"
        type={hidePassword ? "password" : ""}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
        showAsterisk={false}
        innerClassName="pl-3"
        wrapperClassName="text-Regular16 mt-6"
        rightIcon={
          hidePassword ? (
            <EyeIcon color="gray-8" size="sm" />
          ) : (
            <CloseEyeIcon color="gray-8" size="sm" />
          )
        }
        rightIconClick={() => setHidePassword(!hidePassword)}
      />
      <DesktopInputText
        label={t("RepeatPassword")}
        name="confirmPassword"
        type={hideConfirmPassword ? "password" : ""}
        onChange={(event) => {
          setConfirmPassword(event.target.value);
        }}
        isError={arePasswordsEqual === false}
        bottomText={
          arePasswordsEqual === false ? tDesktop("PasswordsDoNotMatch") : ""
        }
        showAsterisk={false}
        innerClassName="pl-3"
        wrapperClassName="text-Regular16 mt-6"
        rightIcon={
          hideConfirmPassword ? (
            <EyeIcon color="gray-8" size="sm" />
          ) : (
            <CloseEyeIcon color="gray-8" size="sm" />
          )
        }
        rightIconClick={() => setHideConfirmPassword(!hideConfirmPassword)}
      />
      <div className="mt-9 flex gap-4">
        <Button
          variant="tertiary"
          className="!h-10 w-full"
          onClick={() => back?.()}
        >
          {t("NotNow")}
        </Button>
        <Button
          disabled={password?.length === 0 || !Boolean(arePasswordsEqual)}
          className="!h-10 w-full rounded-lg"
          onClick={() => {
            changePassword();
            next?.();
          }}
        >
          {t("Continue")}
        </Button>
      </div>
      {contextHolder}
    </div>
  );
};
