import type { FC } from "react";
import { useMemo, useState } from "react";
import { useMutation } from "react-query";

import { CheckOutlined, EyeOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

import { authApi } from "@/shared/api";
import { Button, InputText } from "@/shared/components";
import type { Step6Model } from "@/widgets/auth/models";

export const Step6DoctorAuth: FC<Step6Model> = ({
  back,
  next,
  isNewPassword,
  userId,
}) => {
  const t = useTranslations("Common");

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const arePasswordsEqual = useMemo(() => {
    if (password === confirmPassword && password?.length > 0) {
      return true;
    } else if (confirmPassword?.length > 0) {
      return false;
    } else {
      return null;
    }
  }, [confirmPassword, password]);
  const renderInputIcon = useMemo(
    () =>
      arePasswordsEqual ? (
        <CheckOutlined className="text-success" />
      ) : (
        <EyeOutlined />
      ),
    [arePasswordsEqual]
  );

  const { mutate: changePassword } = useMutation(["updateMyPassword"], () =>
    authApi.updateMyPassword(userId ?? "", password).then(() => {
      next?.();
    })
  );

  return (
    <div className="flex h-screen flex-col justify-center bg-white">
      <div className="px-4 text-center">
        <div className="mb-4 text-Bold24">
          {isNewPassword ? t("NewPassword") : t("SetPassword")}
        </div>
        <InputText
          label={t("Password")}
          name="password"
          value={password}
          showAsterisk={false}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          type="password"
          wrapperClassName="my-3"
          icon={renderInputIcon}
        />
        <InputText
          label={t("RepeatPassword")}
          name="confirmPassword"
          value={confirmPassword}
          showAsterisk={false}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
          }}
          isError={arePasswordsEqual === false}
          bottomText={arePasswordsEqual === false ? "Пароль не совпадает" : ""}
          type="password"
          wrapperClassName="my-3"
          icon={renderInputIcon}
        />
      </div>
      <div className="absolute bottom-0 mb-4 flex w-full flex-col px-4">
        <Button
          variant="primary"
          onClick={() => {
            changePassword();
          }}
          disabled={password?.length === 0 || !Boolean(arePasswordsEqual)}
        >
          {isNewPassword ? t("IsReady") : t("Continue")}
        </Button>
        {!isNewPassword && (
          <Button variant="tertiary" className="mt-4" onClick={back}>
            {t("NotNow")}
          </Button>
        )}
      </div>
    </div>
  );
};
