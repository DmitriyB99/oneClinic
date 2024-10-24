import type { Dispatch, FC, SetStateAction } from "react";

import { useTranslations } from "next-intl";

import { Button, Dialog, CloseIcon } from "@/shared/components";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  qrData?: string;
}

export const ConsultationQrDialog: FC<Props> = ({
  isOpen,
  setIsOpen,
  qrData = "",
}) => {
  const tMob = useTranslations("Mobile.Booking");

  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen} className="!p-0">
      <div className="relative flex h-screen w-full items-center justify-center bg-white">
        <Button
          size="s"
          variant="tinted"
          className="absolute left-4 top-4 mb-6 bg-gray-2"
          onClick={() => setIsOpen(false)}
        >
          <CloseIcon />
        </Button>
        {qrData && (
          <div className="flex flex-col items-center justify-center">
            <img
              className="h-[296px] w-[296px]"
              alt="qr"
              src={`data:image/jpeg;base64,${qrData}`}
            />
            <p>{tMob("AskPatientToScanQrCode")}</p>
          </div>
        )}
      </div>
    </Dialog>
  );
};
