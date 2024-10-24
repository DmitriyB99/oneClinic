import type { FC } from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { AuthClientSms } from "@/features/auth/ui";
import { authApi } from "@/shared/api";
import { Button, Checkbox, InputText } from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";

import { Step7DoctorAuth } from "../AuthDoctor/steps/step7";
import { setAuthToken, setRefreshToken } from "@/shared/utils";

export const AuthClient: FC = () => {
  const tMob = useTranslations("Mobile.Login");
  const t = useTranslations("Common");
  const [code, setCode] = useState("");
  const [openAuthSms, setAuthSmsOpen] = useState(false);
  const [openLocation, setLocationOpen] = useState(false);
  const [tempNumber, setTempNumber] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useContext(UserContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ defaultValues: { accepted: false, number: "" } });
  const router = useRouter();

  const getOtp = (number: string) => authApi.authUserGetOTP(number);

  const enterNumber = ({ number }: { number: string }) => {
    const cleanedNumber = number.replace(/[()\s-]/g, "");
    setTempNumber(cleanedNumber);
    if (number === tempNumber) {
      setAuthSmsOpen(true);
    } else {
      getOtp(number)
        .then(() => {
          setAuthSmsOpen(true);
          setSeconds(60);
        })
        // Обработка ошибок при запросе OTP
        .catch((err) => {
          console.error(err);
        });
    }
  };
  const onAuth = useCallback(() => {
    authApi
      .authUserWithOTP(getValues("number"), code)
      .then((response) => {
        setAuthSmsOpen(false);
        setAuthToken(response.data.access_token);
        setRefreshToken(response.data.refresh_token);
        setUser({
          ...response.data,
          role: "patient",
          role_id: response?.data?.userProfileId,
        });
        // setLocationOpen(true); // узнать, разрешена ли локация: условие

        router.push("/main");
        if (window?.webkit) {
          window.webkit?.messageHandlers?.jsMessageHandler?.postMessage?.(
            "installPin"
          );
        }
        if (window) {
          window.AndroidInterface?.installPin?.();
        }
      })
      .catch((err) => {
        setError("Неверный код. Пожалуйста, попробуйте снова.");
        console.error(err);
      });
    setAuthSmsOpen(false);
  }, [code, getValues, router, setUser]);

  useEffect(() => {
    if (code.length === 6) {
      onAuth();
    }
  }, [code, onAuth]);

  return (
    <>
      <form onSubmit={handleSubmit(enterNumber)}>
        <Controller
          control={control}
          name="number"
          rules={{ required: tMob("EnterYourPhoneNumber") }}
          render={({ field }) => (
            <InputText
              label={t("YourPhoneNumber")}
              isPhone
              bottomText={errors?.number?.message as string}
              isError={!!errors.number}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="accepted"
          defaultValue={false}
          rules={{ required: tMob("AgreementMustBeAccepted") }}
          render={({ field: { onChange, value } }) => (
            <Checkbox
              className="pt-5"
              bottomText={errors?.accepted?.message as string}
              isError={!!errors.accepted}
              onChange={(val) => onChange(val.target.checked)}
              checked={value}
            >
              <div className="text-Regular12 text-secondaryText">
                Даю согласие на обработку моих персональных данных и соглашаюсь
                с{" "}
                <Link href="" className="no-underline">
                  правилами сервиса
                </Link>
              </div>
            </Checkbox>
          )}
        />

        <div className="absolute bottom-4 left-0 w-full px-4">
          <Button htmlType="submit" block>
            Войти
          </Button>
        </div>
      </form>

      {openAuthSms && (
        <AuthClientSms
          number={getValues("number")}
          open={openAuthSms}
          seconds={seconds}
          setCode={setCode}
          setOpen={setAuthSmsOpen}
          setSeconds={setSeconds}
          getOtp={() => getOtp(tempNumber)}
          error={error}
        />
      )}
      {openLocation && (
        <Step7DoctorAuth
          open={openLocation}
          setOpen={setLocationOpen}
          next={() => router.push("/main")}
        />
      )}
    </>
  );
};
