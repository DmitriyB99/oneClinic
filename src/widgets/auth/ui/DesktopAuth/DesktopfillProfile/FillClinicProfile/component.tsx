import type { FC } from "react";
import { useCallback, useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { notification } from "antd";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { authApi } from "@/shared/api";
import { UserContext } from "@/shared/contexts/userContext";
import type {
  ClinicDataFillModel,
  Step3FillClinicProfileSetValue,
} from "@/widgets/auth/models";

import {
  Step1FillProfile,
  Step2FillClinicProfile,
  Step3FillClinicProfile,
  Step4FillClinicProfile,
} from "./steps";
import { DesktopFillProfileTitle } from "../FillProfileTitle/component";

export const DesktopFillClinicProfile: FC = () => {
  const [step, setStep] = useState(0);
  const [api, contextHolder] = notification.useNotification();

  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.FillProfile");

  const openNotification = useCallback(() => {
    api["success"]({
      message: t("PasswordIsSet"),
      placement: "bottomRight",
      duration: 5,
    });
  }, [api, t]);

  const {
    control: ClinicDataFillControl,
    setValue,
    handleSubmit,
    reset,
  } = useForm<ClinicDataFillModel>();

  const { user } = useContext(UserContext);
  const router = useRouter();

  const onSubmit = useCallback(
    (data: ClinicDataFillModel) => {
      authApi.clinicFillProfile({
        ...data,
        clinicId: user?.role_id ?? "",
      });
      router.push("/desktop/mainDoctor");
    },
    [user, router]
  );

  return (
    <div className="flex h-full w-full justify-center">
      {contextHolder}
      {step === 0 && (
        <Step1FillProfile
          next={() => {
            setStep(1);
            openNotification();
          }}
          back={() => setStep(1)}
        />
      )}
      {step === 1 && (
        <DesktopFillProfileTitle
          labelCount="1/3"
          titleText={tDesktop("FillClinicProfile")}
        >
          <Step2FillClinicProfile
            control={ClinicDataFillControl}
            next={() => setStep(2)}
            setValue={setValue}
            reset={reset}
          />
        </DesktopFillProfileTitle>
      )}
      {step === 2 && (
        <DesktopFillProfileTitle
          labelCount="2/3"
          titleText={tDesktop("FillClinicProfile")}
          back={() => setStep(1)}
        >
          <Step3FillClinicProfile
            next={() => setStep(3)}
            setValue={setValue as Step3FillClinicProfileSetValue}
          />
        </DesktopFillProfileTitle>
      )}
      {step === 3 && (
        <DesktopFillProfileTitle
          labelCount="3/3"
          titleText={tDesktop("ClinicServices")}
          back={() => setStep(2)}
        >
          <Step4FillClinicProfile
            setValue={setValue}
            next={handleSubmit(onSubmit)}
          />
        </DesktopFillProfileTitle>
      )}
    </div>
  );
};
