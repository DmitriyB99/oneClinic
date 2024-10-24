import type { ReactElement } from "react";
import { useState } from "react";

import type { TabsProps } from "antd";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  ArrowLeftIcon,
  Button,
  Chips,
  Island,
  TabsSaunet,
} from "@/shared/components";
import { MainLayout } from "@/shared/layout";
import { MyCardPage, ServicesHistoryPage } from "@/widgets/medicalCard";

type Tab = "diseasesHistory" | "servicesHistory" | "myCard";

const tabItems: TabsProps["items"] = [
  {
    key: "myCard",
    label: "Моя карта",
  },
  {
    key: "servicesHistory",
    label: "История услуг",
  },
];

export default function MedicalCardPage() {
  const t = useTranslations("Common");
  const router = useRouter();
  const [currentActiveTab, setCurrentActiveTab] =
    useState<Tab>("servicesHistory");
  const [servicesHistoryTabVisible, setServicesHistoryTabVisible] =
    useState(false);

  // TODO: Функционал будет добавлен после MVP
  const [, setFilters] = useState<string[]>([]);

  return (
    <div className="flex h-screen flex-col">
      <Island className="mb-2 flex h-fit flex-col pb-0">
        <div className="flex items-center justify-start">
          <Button
            size="s"
            variant="tinted"
            className="bg-gray-2"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon />
          </Button>
          <div className="ml-12 text-Bold16">{t("MedicalCard")} </div>
        </div>
        <div className="mt-2">
          <TabsSaunet
            items={tabItems}
            centered
            defaultActiveKey={currentActiveTab}
            onTabClick={(tab) => setCurrentActiveTab(tab as Tab)}
            tabBarGutter={80}
          />
        </div>

        {/* TODO: Функционал будет добавлен после MVP */}
        {currentActiveTab === "servicesHistory" && servicesHistoryTabVisible && (
          <Chips
            chipLabels={["Период", "Справки", "Скорая", "Анализы"]}
            type="multiselect"
            onChange={(selectedFilters) => {
              setFilters(selectedFilters as string[]);
            }}
            className="!my-4"
          />
        )}
      </Island>
      {currentActiveTab === "servicesHistory" && (
        <ServicesHistoryPage
          setServicesHistoryTabVisible={setServicesHistoryTabVisible}
        />
      )}
      {currentActiveTab === "myCard" && <MyCardPage />}
    </div>
  );
}

MedicalCardPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
