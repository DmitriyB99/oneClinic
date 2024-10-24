import type { ReactElement } from "react";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { IScannerProps, IDetectedBarcode } from "@yudiel/react-qr-scanner";
import {
  ArrowRightIcon,
  Button,
  CheckPinkIcon,
  CloseIcon,
  DividerSaunet,
  Island,
  QrScanIcon,
} from "@/shared/components";
import { useRouter } from "next/router";
import { MainLayout } from "@/shared/layout";

// Динамический импорт компонента Scanner
const Scanner = dynamic<IScannerProps>(
  () => import("@yudiel/react-qr-scanner").then((mod) => mod.Scanner),
  { ssr: false }
);

const ScanItem = ({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <div
    className="mt-6 flex justify-between items-center cursor-pointer"
    onClick={onClick}
  >
    <div className="flex">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lightRed">
        <CheckPinkIcon width={15} height={10} />
      </div>
      <div className="ml-3 flex flex-col justify-start">
        <div className="mb-1 text-Regular16 text-dark">{title}</div>
        <div className="mb-1 text-Regular12 text-secondaryText">
          {description}
        </div>
      </div>
    </div>
    <ArrowRightIcon width={8} height={14} />
  </div>
);

export default function QrScannerPage() {
  const router = useRouter();
  const [data, setData] = useState<string | null>(null);

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      setData(detectedCodes[0].rawValue);
    } else {
      console.error("QR code scan error or no QR code detected");
    }
  };

  return (
    <div className="flex flex-col h-screen relative">
      <Button
        size="s"
        variant="primary"
        className="absolute top-4 right-4 z-10 mb-2 bg-gray-2 !px-1"
        onClick={() => router.back()}
      >
        <CloseIcon />
      </Button>
      <div className="relative flex-1 flex flex-col">
        <Scanner
          onScan={handleScan}
          components={{ finder: false }}
          styles={{
            container: { width: "100%", height: "100%", position: "relative" },
            video: { width: "100%", height: "100%", objectFit: "cover" },
          }}
        />
        <div className="flex items-center justify-center flex-col absolute inset-x-0 top-1/3 transform -translate-y-1/2 z-50 pointer-events-none">
          <QrScanIcon width={160} height={160} />
          <div
            className="mt-6 flex items-center rounded-3xl px-2 py-2"
            style={{ backgroundColor: "rgba(174, 174, 174, 0.3)" }}
          >
            <div className="text-white text-Bold14">
              Наведите камеру на QR-код
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 w-full bg-white p-4 rounded-3xl rounded-b-none">
        <Island className="my-2 w-full">
          <p className="mb-6 text-Bold24">QR от OneClinic</p>
          <ScanItem
            title="Записывайтесь к врачу онлайн"
            description="Вместо ожидания на ресепшне"
            onClick={() => router.push("/oneQr/onboarding?type=1")}
          />
          <DividerSaunet className="my-3" />
          <ScanItem
            title="Подтверждайте прием"
            description="Так мы узнаем о начале консультации"
            onClick={() => router.push("/oneQr/onboarding?type=2")}
          />
        </Island>
      </div>
      {data && <p className="text-center my-5">Scanned QR Code: {data}</p>}
    </div>
  );
}

QrScannerPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};
