import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import type { TabsProps } from "antd";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { patientFamilyApi } from "@/shared/api/patient/family";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Avatar,
  Button,
  Chips,
  Island,
  SpinnerWithBackdrop,
  TabsSaunet,
  UserCircleIcon,
} from "@/shared/components";
import { MainLayout } from "@/shared/layout";
import { ServicesHistoryPage } from "@/widgets/medicalCard";
import { FamilyMemberCardPage } from "@/widgets/medicalCard/ui/FamilyMemberCardPage";

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
  const userId = router.query.id as string;
  const [, setFilters] = useState<string[]>([]);

  const { data: familyMemberData } = useQuery(
    ["getMyFamilyMember", userId],
    () => patientFamilyApi?.getFamilyMember(userId),
    {
      enabled: !!userId,
    }
  );

  return (
    <div className="flex h-screen flex-col">
      <Island className="mb-2 flex h-fit flex-col pb-0">
        <div className="flex w-full items-center justify-between">
          <Button
            size="s"
            variant="tinted"
            className="bg-gray-2"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon />
          </Button>
          <div className="text-Bold16">{t("MedicalCard")}</div>
          <div className="w-16" />
        </div>
        <div className="flex cursor-pointer items-center py-3">
          <div className="mr-3">
            <Avatar
              size="l"
              className="bg-gray-2"
              src={familyMemberData?.data?.photo_url}
              icon={<UserCircleIcon size="l" />}
            />
          </div>
          <div className="grow">
            {/* <div className="text-Medium12 text-warningStatus">
              Ожидает регистрации
            </div> */}
            <div className="text-Bold20">{`${familyMemberData?.data?.surname} ${familyMemberData?.data?.name}`}</div>
            <div className="text-Regular14">
              {familyMemberData?.data?.family_member_type?.name}
            </div>
          </div>
          {/* <ArrowRightIcon className="ml-auto" size="sm" /> */}
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

      {userId ? (
        <>
          {currentActiveTab === "servicesHistory" && (
            <ServicesHistoryPage
              setServicesHistoryTabVisible={setServicesHistoryTabVisible}
            />
          )}
          {currentActiveTab === "myCard" && (
            <FamilyMemberCardPage familyMemberData={familyMemberData?.data} />
          )}
        </>
      ) : (
        <div className="px-8 text-center">
          <div className="mt-20 text-Bold24">
            Пользователь еще не зарегистрирован в OneClinic
          </div>
          <div className="mt-6 text-Medium16 text-gray-secondary">
            После прохождения полной регистрации пользователю будут доступны все
            разделы внутри медкарты
          </div>
        </div>
      )}
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

export const getStaticPaths = () => ({
  paths: [],
  fallback: true,
});
