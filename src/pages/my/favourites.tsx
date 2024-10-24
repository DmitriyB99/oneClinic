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
import { FavouritesDoctors } from "@/widgets/favourites/doctors";
import { FavouritesClinics } from "@/widgets/favourites/clinics";

type Tab = "Doctors" | "Clinics";

const tabItems: TabsProps["items"] = [
  {
    key: "Doctors",
    label: "Врачи",
  },
  {
    key: "Clinics",
    label: "Клиники",
  },
];

export default function FavouritesPage() {
  const t = useTranslations("Common");
  const router = useRouter();
  const [currentActiveTab, setCurrentActiveTab] =
    useState<Tab>("Doctors");
  const [servicesHistoryTabVisible, setServicesHistoryTabVisible] =
    useState(false);

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
          <div className="ml-12 text-Bold16">Избранное</div>
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
      {currentActiveTab === "Doctors" && (
        <FavouritesDoctors />
      )}
      {currentActiveTab === "Clinics" && <FavouritesClinics />}
    </div>
  );
}

FavouritesPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
