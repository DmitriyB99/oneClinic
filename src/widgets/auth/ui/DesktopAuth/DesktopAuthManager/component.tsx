import { useCallback, useContext, useEffect, useState } from "react";
import type { FC } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { authApi } from "@/shared/api";
import { clinicsApi } from "@/shared/api/clinics";
import { UserContext } from "@/shared/contexts/userContext";
import { setAuthToken, setRefreshToken } from "@/shared/utils";
import type { ManagerRegistrationModel } from "@/widgets/auth/models";

import { Step1ManagerAuth, Step2ManagerAuth } from "./steps";
import { Step3Auth } from "../DesktopAuthDoctor/steps";
import { DesktopAuthLogin } from "../DesktopLogin";
import type { DesktopAuthProps } from "../props";

export const DesktopAuthManager: FC<DesktopAuthProps> = ({
  isLogin,
  setLogin,
  setSubtitle,
}) => {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const { setUser } = useContext(UserContext);

  const tDesktop = useTranslations("Desktop.Login");

  useEffect(() => {
    setSubtitle(tDesktop("HowAddressYou"));
  }, [setSubtitle, tDesktop]);

  const handleRegForm = useCallback(() => {
    setLogin(false);
  }, [setLogin]);

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
        role_id: loginData?.clinicId,
      });
      const { data: myClinicProfileData } = await clinicsApi.getClinicMe();
      if (myClinicProfileData?.status?.includes("NEW")) {
        router.push("/desktop/fillProfile");
      } else {
        router.push("/desktop/mainDoctor");
      }
    },
    [router, setUser]
  );

  const { handleSubmit, setValue, reset } = useForm<ManagerRegistrationModel>();

  const onRegisterManagerSubmit = useCallback(
    (data: ManagerRegistrationModel) => {
      authApi.registerClinic(data);
    },
    []
  );

  return (
    <>
      {isLogin && (
        <DesktopAuthLogin handleRegForm={handleRegForm} onSubmit={onSubmit} />
      )}
      {!isLogin && (
        <div className="flex flex-col gap-6">
          {step === 0 && (
            <Step1ManagerAuth
              back={() => setLogin(true)}
              next={() => {
                setStep(1);
                setSubtitle(tDesktop("SpecifyEmailAndPhone"));
              }}
              reset={reset}
            />
          )}
          {step === 1 && (
            <Step2ManagerAuth
              back={() => setStep(0)}
              next={() => {
                setStep(2);
                handleSubmit(onRegisterManagerSubmit)();
                setSubtitle(tDesktop("LeaveRequest"));
              }}
              setValue={setValue}
            />
          )}
          {step === 2 && (
            <Step3Auth
              back={() => {
                setLogin(true);
                setStep(0);
              }}
            />
          )}
        </div>
      )}
    </>
  );
};
