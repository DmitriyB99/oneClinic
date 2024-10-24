import type { FC } from "react";
import { useCallback, useContext, useState } from "react";
import { useForm } from "react-hook-form";

import { notification } from "antd";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { authApi } from "@/shared/api";
import { UserContext } from "@/shared/contexts/userContext";
import type { DoctorDataFillModel } from "@/widgets/auth/models";

import {
  Step2FillDoctorProfile,
  Step3FillDoctorProfile,
  Step4FillDoctorProfile,
  Step5FillDoctorProfile,
} from "./steps";
import { Step1FillProfile } from "../FillClinicProfile/steps";
import { DesktopFillProfileTitle } from "../FillProfileTitle/component";

export const DesktopFillDoctorProfile: FC = () => {
  const [step, setStep] = useState(0);
  const [api, contextHolder] = notification.useNotification();
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.FillProfile");
  const openNotification = useCallback(
    () =>
      api["success"]({
        message: t("PasswordIsSet"),
        placement: "bottomRight",
        duration: 5,
      }),
    [api, t]
  );

  const {
    control: DoctorDataFillControl,
    setValue,
    handleSubmit,
    reset,
  } = useForm<DoctorDataFillModel>();

  const { user } = useContext(UserContext);
  const router = useRouter();

  const onSubmit = useCallback(
    (data: DoctorDataFillModel) => {
      authApi
        .doctorFillProfile({
          ...data,
          doctorId: user?.role_id ?? "",
        })
        .then(() => router.push("/desktop/mainDoctor"));
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
          labelCount="1/4"
          titleText={t("FillYourProfile")}
        >
          <Step2FillDoctorProfile
            next={() => setStep(2)}
            control={DoctorDataFillControl}
            setValue={setValue}
            reset={reset}
          />
        </DesktopFillProfileTitle>
      )}
      {step === 2 && (
        <DesktopFillProfileTitle
          labelCount="2/4"
          titleText={t("Services")}
          back={() => setStep(1)}
        >
          <Step3FillDoctorProfile next={() => setStep(3)} setValue={setValue} />
        </DesktopFillProfileTitle>
      )}
      {step === 3 && (
        <DesktopFillProfileTitle
          labelCount="3/4"
          titleText={tDesktop("ProvideInfoAboutDoctorEducation")}
          back={() => setStep(2)}
        >
          <Step4FillDoctorProfile setValue={setValue} next={() => setStep(4)} />
        </DesktopFillProfileTitle>
      )}
      {step === 4 && (
        <DesktopFillProfileTitle
          labelCount="4/4"
          titleText={tDesktop("SpecifyCertificatesInfo")}
          back={() => setStep(3)}
        >
          <Step5FillDoctorProfile
            setValue={setValue}
            next={handleSubmit(onSubmit)}
          />
        </DesktopFillProfileTitle>
      )}
    </div>
  );
};
