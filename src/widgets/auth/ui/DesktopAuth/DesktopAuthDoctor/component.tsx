import type { FC } from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { authApi, doctorsApi } from "@/shared/api";
import { UserContext } from "@/shared/contexts/userContext";
import { setAuthToken, setRefreshToken } from "@/shared/utils";
import type { DoctorRegistrationModel } from "@/widgets/auth/models";

import { Step1DoctorAuth, Step2DoctorAuth, Step3Auth } from "./steps";
import { DesktopAuthLogin } from "../DesktopLogin";
import type { DesktopAuthProps } from "../props";

export const DesktopAuthDoctor: FC<DesktopAuthProps> = ({
  isLogin,
  setLogin,
  setSubtitle,
}) => {
  const [step, setStep] = useState(0);
  const tDesktop = useTranslations("Desktop.Login");

  const router = useRouter();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    setSubtitle(tDesktop("LeaveRequest"));
  }, [setSubtitle, tDesktop]);

  const { setValue, handleSubmit, reset } = useForm<DoctorRegistrationModel>();

  const onRegisterDoctorSubmit = useCallback(
    (data: DoctorRegistrationModel) => {
      authApi.registerDoctor(data);
      setStep(2);
    },
    []
  );

  const onSubmit = useCallback(
    async (data: { email: string; pass: string }) => {
      const { data: loginData } = await authApi.authUserByLogin(
        data.pass,
        data.email
      );
      setAuthToken(loginData.access_token);
      setRefreshToken(loginData.refresh_token);
      setUser({
        user_id: loginData?.user_id,
        role: loginData?.role,
        role_id: loginData?.doctorProfileId,
      });
      const { data: myDoctorProfileData } =
        await doctorsApi.getMyDoctorProfile();
      if (myDoctorProfileData?.status?.includes("NEW")) {
        router.push("/desktop/fillProfile");
      } else {
        router.push("/desktop/mainDoctor");
      }
    },
    [setUser, router]
  );

  const handleRegForm = useCallback(() => {
    setLogin(false);
    setStep(0);
  }, [setLogin, setStep]);

  return (
    <>
      {isLogin && (
        <DesktopAuthLogin handleRegForm={handleRegForm} onSubmit={onSubmit} />
      )}
      {!isLogin && (
        <div className="relative">
          {step === 0 && (
            <Step1DoctorAuth
              back={() => setLogin(true)}
              next={() => setStep(1)}
              reset={reset}
            />
          )}
          {step === 1 && (
            <Step2DoctorAuth
              back={() => setStep(0)}
              next={() => handleSubmit(onRegisterDoctorSubmit)()}
              setValue={setValue}
            />
          )}
          {step === 2 && <Step3Auth back={() => setLogin(true)} />}
        </div>
      )}
    </>
  );
};
