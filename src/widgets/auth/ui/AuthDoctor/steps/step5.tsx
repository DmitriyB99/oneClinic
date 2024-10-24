import type { FC } from "react";

import { useTranslations } from "next-intl";

import { ArrowLeftIcon, Button, Navbar } from "@/shared/components";
import type { StepModel } from "@/widgets/auth/models";

export const Step5DoctorAuth: FC<StepModel> = ({ next, back }) => {
  const t = useTranslations("Common");

  return (
    <div className="flex h-screen flex-col justify-between bg-white">
      <Navbar
        className="mb-4"
        buttonIcon={<ArrowLeftIcon />}
        leftButtonOnClick={() => back?.()}
      />
      <div className="flex w-full flex-col items-center justify-center text-center">
        <div className="mb-3 mt-4 text-Bold24">
          Мы отправили ссылку для восстановления пароля на ваш Email
        </div>
        <div className="text-Regular16">
          Вам на почту da*****@gmail.com придет письмо с восстановлением пароля.
        </div>
        <div className="mt-4 text-Regular16">
          Следуйте инструкции и смените пароль
        </div>
      </div>
      <Button variant="primary" className="m-4" onClick={next}>
        {t("IsReady")}
      </Button>
    </div>
  );
};
