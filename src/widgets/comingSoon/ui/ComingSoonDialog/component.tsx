import type { FC } from "react";
import { useCallback } from "react";

import Image from "next/image";

import { Button, CloseIcon, Dialog, WhatsAppIcon } from "@/shared/components";
import type { ComingSoonPropsModel } from "@/widgets/comingSoon";

export const ComingSoonDialog: FC<ComingSoonPropsModel> = ({
  open,
  setIsOpen,
}) => {
  const handleWhatsappRedirect = useCallback(() => {
    window.open("https://wa.me/77077077077", "_blank");
  }, []);
  return (
    <Dialog isOpen={open} setIsOpen={setIsOpen}>
      <div className="mb-2 flex w-full items-center justify-end">
        <Button variant="tertiary" onClick={() => setIsOpen(false)}>
          <CloseIcon />
        </Button>
      </div>
      <div className="mb-4 flex justify-center">
        <Image
          width={195}
          height={223}
          src="/workInProgress.png"
          alt="work in progress icon"
        />
      </div>
      <div className="pb-3 pt-4 text-center text-Bold20">
        Мы работаем над этим разделом
      </div>
      <div className="mb-7 text-center text-Regular16">
        Если у вас возникли вопросы, просим связаться с нами
      </div>
      <Button
        variant="secondary"
        onClick={handleWhatsappRedirect}
        className="flex items-center justify-center"
      >
        <WhatsAppIcon className="mr-2" />
        Написать в WhatsApp
      </Button>
    </Dialog>
  );
};
