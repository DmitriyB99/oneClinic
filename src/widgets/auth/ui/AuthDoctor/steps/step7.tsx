import type { FC } from "react";

import { useTranslations } from "next-intl";

import { Button, Dialog, LocationIcon } from "@/shared/components";

export const Step7DoctorAuth: FC<{
  setOpen: (val: boolean) => void;
  next?: () => void;
  open: boolean;
}> = ({ next, open, setOpen }) => {
  const t = useTranslations("Common");

  return (
    <Dialog isOpen={open} setIsOpen={setOpen} className="!px-0">
      <div className="flex h-screen flex-col justify-between bg-white">
        <div className="flex h-full w-full flex-col items-center justify-center text-center">
          <LocationIcon width={164} height={164} />
          <div className="mb-3 mt-4 text-Bold24">Для вашего комфорта</div>
          <div className="px-3 text-Regular16">
            Разрешите приложению OneClinic отправку уведомлений и доступ к
            геолокации
          </div>
        </div>
        <div className="flex flex-col">
          <Button variant="primary" className="m-4" onClick={next}>
            {t("Allow")}
          </Button>
          <Button variant="tertiary" className="m-4" onClick={next}>
            {t("NotNow")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
