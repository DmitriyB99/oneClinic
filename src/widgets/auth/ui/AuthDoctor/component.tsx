import type { FC } from "react";
import { useCallback, useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { authApi } from "@/shared/api";
import { doctorsApi } from "@/shared/api/doctors";
import { Button, Dialog, InputText } from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";
import { setAuthToken, setRefreshToken } from "@/shared/utils";
import type { DoctorRegistrationModel } from "@/widgets/auth/models";

import {
  Step1DoctorAuth,
  Step2DoctorAuth,
  Step3DoctorAuth,
  Step4DoctorAuth,
  Step5DoctorAuth,
  Step6DoctorAuth,
} from "./steps";

export const AuthDoctor: FC = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [userId, setUserId] = useState<string>();
  const [doctorId, setDoctorId] = useState<string>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", pass: "" } });
  const router = useRouter();
  const { setUser } = useContext(UserContext);

  const {
    control: doctorRegistrationControl,
    setValue,
    getValues,
    watch: watchDoctorRegistration,
  } = useForm<DoctorRegistrationModel>();

  const onRegisterDoctorSubmit = useCallback(
    (data: DoctorRegistrationModel) => {
      authApi.registerDoctor(data);
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
      const { data: myDoctorProfileData } =
        await doctorsApi.getMyDoctorProfile();
      if (myDoctorProfileData?.status?.includes("NEW")) {
        setUserId(loginData?.user_id);
        setDoctorId(myDoctorProfileData?.id);
        setStep(6);
        setOpen(true);
      } else {
        setUser({
          user_id: loginData?.user_id,
          role: "doctor",
          role_id: myDoctorProfileData?.id ?? "",
        });
        router.replace("/mainDoctor");
      }
    },
    [router, setUser]
  );

  const handleStep6Next = useCallback(() => {
    if (userId && step === 6) {
      setStep(4);
    } else {
      setOpen(false);
    }
  }, [step, userId]);

  const handleFillFinish = useCallback(() => {
    setUser({ user_id: userId ?? "", role: "doctor", role_id: doctorId ?? "" });
    router.replace("/mainDoctor");
  }, [router, setUser, userId, doctorId]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="email"
          rules={{ required: "Введите электронную почту" }}
          render={({ field }) => (
            <InputText
              label="Электронная почта"
              bottomText={errors?.email?.message as string}
              isError={!!errors.email}
              showAsterisk={false}
              wrapperClassName="mb-6 mt-4"
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="pass"
          rules={{
            required: "Введите пароль",
          }}
          render={({ field }) => (
            <InputText
              label="Пароль"
              type="password"
              bottomText={errors?.pass?.message as string}
              showAsterisk={false}
              isError={!!errors.pass}
              {...field}
            />
          )}
        />
        <div
          className="text-Regular12 text-blue ml-4 mt-1"
          onClick={() => {
            setOpen(true);
            setStep(5);
          }}
        >
          Не помню пароль
        </div>
        <div className="absolute bottom-4 left-0 w-full px-4">
          <Button htmlType="submit" block>
            Войти
          </Button>
          <Button
            block
            variant="secondary"
            className="mt-4"
            onClick={() => {
              setOpen(true);
              setStep(0);
            }}
          >
            У меня нет аккаунта
          </Button>
        </div>
      </form>
      <Dialog isOpen={open} setIsOpen={setOpen} className="!rounded-none !p-0">
        <div className="relative h-screen">
          {step === 0 && (
            <Step1DoctorAuth
              back={() => setOpen(false)}
              next={() => setStep(1)}
              control={doctorRegistrationControl}
              watch={watchDoctorRegistration}
            />
          )}
          {step === 1 && (
            <Step2DoctorAuth
              control={doctorRegistrationControl}
              back={() => setStep(0)}
              next={() => {
                setStep(2);
                onRegisterDoctorSubmit(getValues());
              }}
              setValue={setValue}
              watch={watchDoctorRegistration}
            />
          )}
          {step === 2 && <Step3DoctorAuth back={() => setOpen(false)} />}
          {step === 4 && (
            <Step4DoctorAuth
              back={() => setOpen(false)}
              next={handleFillFinish}
              doctorId={doctorId}
            />
          )}
          {step === 5 && (
            <Step5DoctorAuth
              back={() => setOpen(false)}
              next={() => setStep(7)}
            />
          )}
          {(step === 6 || step === 7) && (
            <Step6DoctorAuth
              back={handleStep6Next}
              next={handleStep6Next}
              isNewPassword={step === 7}
              userId={userId ?? ""}
            />
          )}
        </div>
      </Dialog>
    </>
  );
};
