import type { ReactElement } from "react";

import type { GetServerSidePropsContext } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button, Island } from "@/shared/components";
import { ListNoIcon } from "@/shared/components/atoms/ListNoIcon";
import { MainLayout } from "@/shared/layout";

const itemsForAppointment = [
  {
    id: "1",
    text: "1",
    title: "Отсканируйте QR-код OneClinic",
    description: "Стенд c QR-кодом расположен у ресепшна клиники",
  },
  {
    id: "2",
    text: "2",
    title: "Выберите врача или услугу ",
    description:
      "Экономьте время и не стойте в очереди на получение направления",
  },
  {
    id: "3",
    text: "3",
    title: "Заранее уведомим вас о записи",
    description: "Так вы не пропустите свою запись",
  },
];

const itemsForConfirmation = [
  {
    id: "1",
    text: "1",
    title: "Попросите врача показать его QR-код в приложении OneClinic",
    description: "",
  },
  {
    id: "2",
    text: "2",
    title: "Отсканируйте QR-код врача",
    description: "",
  },
  {
    id: "3",
    text: "3",
    title: "Так мы узнаем, что консультация началась",
    description: "",
  },
];

export default function QrOnboardingPage() {
  const t = useTranslations("Common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const items = type === "1" ? itemsForAppointment : itemsForConfirmation;

  return (
    <div className="flex h-screen flex-col">
      <div className="flex justify-center">
        <img
          className="w-full"
          src={type === "1" ? "/qrOnboarding-1.png" : "/qrOnboarding-2.png"}
          alt="onboarding"
        />
      </div>
      <Island className="flex h-full flex-col rounded-none">
        <p className="mb-4 text-Bold20">
          {type === "1"
            ? "Записывайтесь на прием к врачу без ожидания на ресепшне"
            : "Подтверждайте свое присутствие на приеме с OneClinic QR"}
        </p>
        <ListNoIcon items={items} />
        <Button
          block
          variant="primary"
          className="mb-4 mt-auto text-Medium16 text-crimson"
          // onClick={() => router.back()}
          onClick={() => router.push(`/oneQr`)}
        >
          {t("ItsClear")}
        </Button>
        <Button
          block
          variant="tertiary"
          className="mb-4 mt-auto text-Medium16"
          // onClick={() => router.back()}
          onClick={() => router.push(`/oneQr`)}
        >
          Больше не показывать
        </Button>
      </Island>
    </div>
  );
}

QrOnboardingPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
