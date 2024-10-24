import type { FC } from "react";
import { useState } from "react";

import { RightOutlined } from "@ant-design/icons";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import {
  ArrowLeftIcon,
  InteractiveList,
  Island,
  Navbar,
} from "@/shared/components";

const confidentialitySettingsList = [
  {
    id: 0,
    path: "medcard",
    title: "Видят мою медкарту",
  },
  {
    id: 1,
    path: "servicesHistory",
    title: "Видят мою историю услуг",
  },
  {
    id: 2,
    path: "messages",
    title: "Могут отправлять сообщения",
  },
];

const ConfidentialitySettings: FC = () => {
  const t = useTranslations("Common");
  const router = useRouter();
  const path = (id: number) =>
    confidentialitySettingsList.find((setting) => setting.id === id)?.path;
  return (
    <div className="h-screen bg-white">
      <Island className="!p-0">
        <Navbar
          title={t("PrivacySettingsWithDots")}
          leftButtonOnClick={() => {
            router?.back();
          }}
          buttonIcon={<ArrowLeftIcon />}
          className="mb-4 pt-4"
        />
        <div className="px-4">
          <InteractiveList
            list={confidentialitySettingsList}
            onClick={(id: number) => {
              router.push(`/my/confidentialitySettings/${path(id)}`);
            }}
          />
        </div>
      </Island>
    </div>
  );
};

export default ConfidentialitySettings;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}
