import type { ReactElement } from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { authApi } from "@/shared/api";
import {
  Button,
  CloseEyeIcon,
  DesktopInputText,
  EyeIcon,
  LockIcon,
  SaunetMobileIcon,
  UserLoginIcon,
} from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";
import { setAuthToken, setRefreshToken } from "@/shared/utils";

export default function DesktopLoginAdmin() {
  const { setUser, user } = useContext(UserContext);

  const [hidePassword, setHidePassword] = useState(true);
  const router = useRouter();
  const t = useTranslations("Common");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { login: "", pass: "" } });

  useEffect(() => {
    if (user) {
      router.push("/desktop/mainDoctor");
    }
  }, [router, user]);

  const onSubmit = useCallback(
    async (data: { login: string; pass: string }) => {
      const { data: loginData } = await authApi.authUserByLogin(
        data.pass,
        data.login
      );
      setAuthToken(loginData.access_token);
      setRefreshToken(loginData.refresh_token);
      setUser({
        user_id: loginData?.user_id,
        role: loginData?.role,
        role_id: loginData?.doctorProfileId,
      });
      router.push("/desktop/mainDoctor");
    },
    [setUser, router]
  );

  return (
    <div className="flex flex-row justify-center gap-5 bg-white p-8">
      <div className="relative flex h-screen w-[480px] flex-col justify-between pb-12">
        <SaunetMobileIcon height={60} size="xxl" />
        <div className="absolute top-[175px] flex w-full flex-col">
          <p className="mb-3 text-Bold32">{t("LoginToTheSystem2")}</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="login"
              rules={{ required: t("EnterEmail") }}
              render={({ field }) => (
                <DesktopInputText
                  label="Login"
                  bottomText={errors?.login?.message as string}
                  isError={!!errors.login}
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
            <Button
              variant="primary"
              className="mt-7 rounded !py-2 px-4"
              size="desktopS"
              htmlType="submit"
            >
              {t("Login")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

DesktopLoginAdmin.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}
