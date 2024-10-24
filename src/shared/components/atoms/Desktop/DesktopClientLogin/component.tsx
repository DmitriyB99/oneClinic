import type { FC } from "react";

import { useTranslations } from "next-intl";

import { QrClientIcon } from "@/shared/components";

export const DesktopClientLogin: FC = () => {
  const tDesktop = useTranslations("Desktop.Login");
  return (
    <div className="mt-[60px] flex flex-col gap-5">
      <div className="flex justify-center">
        <QrClientIcon width={106} height={106} />
      </div>
      <p className="m-0 px-[100px] text-center text-Bold16">
        {tDesktop("ScanQrCodeAndDownload")}
      </p>
      <div className="flex justify-center">
        <img src="/playstore.png" alt="PlayStore" />
      </div>
    </div>
  );
};
