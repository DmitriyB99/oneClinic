import type { ReactElement } from "react";
import { useState } from "react";

import type { TabsProps } from "antd";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { ArrowLeftIcon, Button, Island, TabsSaunet } from "@/shared/components";
import { MainLayout } from "@/shared/layout";
import {
  PatientHistoryPage,
  PatientMedicalCardPage,
} from "@/widgets/medicalCard";

type Tab = "servicesHistory" | "myCard";

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

export default function PatientCard() {
  const router = useRouter();
  const [currentActiveTab, setCurrentActiveTab] = useState<Tab>("myCard");

  return (
    <div className="flex h-screen flex-col overflow-auto bg-gray-2">
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
          <div className="ml-12 text-Bold16">Данные пациента</div>
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
      </Island>
      {currentActiveTab === "servicesHistory" && <PatientHistoryPage />}
      {currentActiveTab === "myCard" && <PatientMedicalCardPage />}
    </div>
  );
}

PatientCard.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}

export const getStaticPaths = () => ({
  paths: [],
  fallback: true,
});
