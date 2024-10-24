import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AuthCodeRef } from "react-auth-code-input";

import {
  ArrowLeftIcon,
  Button,
  Dialog,
  InputCode,
  Navbar,
} from "@/shared/components";

export const AuthClientSms: FC<{
  getOtp: () => void;
  number: string;
  open: boolean;
  seconds: number;
  setCode: (val: string) => void;
  setOpen: (val: boolean) => void;
  setSeconds: (val: number) => void;
  error?: string | null;
}> = ({
  open,
  setOpen,
  seconds,
  setCode,
  number,
  setSeconds,
  getOtp,
  error,
}) => {
  const [secondsTimer, setSecondsTimer] = useState(60);
  const [isCodeInvalid, setIsCodeInvalid] = useState(false);

  const AuthInputRef = useRef<AuthCodeRef>(null);

  const formatSeconds = useCallback((secs: number) => {
    const pad = (num: number) => (num < 10 ? `0${num}` : num);
    const min = Math.floor(secs / 60);
    const sec = Math.floor(secs - min * 60);
    return `${pad(min)}:${pad(sec)}`;
  }, []);

  const startTimer = useCallback(
    (sec: number) => {
      const timer = setTimeout(() => startTimer(sec - 1), 1000);

      if (sec > 0) {
        setSecondsTimer(sec);
        setSeconds(sec);
      } else {
        setSecondsTimer(0);
        clearTimeout(timer);
      }
    },
    [setSeconds]
  );

  useEffect(() => {
    startTimer(seconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCodeChange = (code: string) => {
    setCode(code);

    if (error === null) {
      //потом добавить проверку после бэка в зависимости от ответа
      setIsCodeInvalid(false);
    } else {
      setIsCodeInvalid(true);
    }
  };

  return (
    <Dialog isOpen={open} setIsOpen={setOpen} className="!px-0">
      <div className="h-screen">
        <Navbar
          title="Введите код из SMS"
          className="mb-2 px-0"
          buttonIcon={<ArrowLeftIcon />}
          leftButtonOnClick={() => {
            setOpen(false);
            AuthInputRef?.current?.focus();
          }}
        />
        <div className="mt-3 text-center">
          <p className="mb-1 text-Regular16">Мы отправили код на номер</p>
          <p className="mb-0 text-Bold16">{number}</p>
          <Button
            variant="tertiary"
            className="mt-1 text-blue"
            disabled={secondsTimer > 0}
            onClick={() => {
              getOtp();
              startTimer(60);
            }}
          >
            {secondsTimer > 0
              ? `Повторная отправка через ${formatSeconds(secondsTimer)}`
              : "Отправить код"}
          </Button>
        </div>
        <div className="flex justify-center py-4">
          <InputCode
            ref={AuthInputRef}
            onChange={handleCodeChange}
            length={6}
            inputClassName={`${
              isCodeInvalid ? "!border-2 !border-solid !border-red" : ""
            }`}
          />
        </div>
        {error && (
          <div className="text-center text-Regular16 text-secondaryText">
            Код введен неверно
          </div>
        )}
      </div>
    </Dialog>
  );
};
