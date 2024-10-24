import type { FC } from "react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import {
  AuthDoctorWorkExperience,
  AuthDoctorEducation,
  AuthDoctorCertificates,
  AuthDoctorGetContacts,
  AuthDoctorSetProfilePhoto,
  AuthDoctorProfileSetupFinish,
  AuthDoctorServices,
} from "@/entities/login";
import { authApi } from "@/shared/api";
import type { DoctorDataFillModel, StepModel } from "@/widgets/auth/models";

export const Step4DoctorAuth: FC<StepModel & { doctorId?: string }> = ({
  back,
  next,
  doctorId,
}) => {
  const [step, setStep] = useState<number>(0);
  const { control, getValues, setValue } = useForm<DoctorDataFillModel>();
  const goToNextStep = useCallback(() => {
    setStep((prev) => ++prev);
  }, []);
  const handleFinish = useCallback(() => {
    authApi.doctorFillProfile({ ...getValues(), doctorId: doctorId ?? "" });
    next?.();
  }, [doctorId, getValues, next]);

  return (
    <div className="bg-gray-2">
      {step === 0 && (
        <AuthDoctorWorkExperience
          control={control}
          back={back}
          setValue={setValue}
          next={goToNextStep}
        />
      )}
      {step === 1 && (
        <AuthDoctorServices
          setValue={setValue}
          back={back}
          next={goToNextStep}
        />
      )}
      {step === 2 && (
        <AuthDoctorEducation
          setValue={setValue}
          back={back}
          doctorId={doctorId}
          next={goToNextStep}
        />
      )}
      {step === 3 && (
        <AuthDoctorCertificates
          setValue={setValue}
          doctorId={doctorId}
          back={back}
          next={goToNextStep}
        />
      )}
      {step === 4 && (
        <AuthDoctorGetContacts
          setValue={setValue}
          back={back}
          next={goToNextStep}
        />
      )}
      {step === 5 && (
        <AuthDoctorSetProfilePhoto
          back={back}
          setValue={setValue}
          doctorId={doctorId}
          next={goToNextStep}
        />
      )}
      {step === 6 && (
        <AuthDoctorProfileSetupFinish back={back} next={handleFinish} />
      )}
    </div>
  );
};
