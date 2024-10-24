import { ReactElement, useEffect, useState } from "react";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import {
  ArrowLeftIcon,
  Navbar,
  RadioSaunet,
  DividerSaunet,
  SpinnerWithBackdrop,
} from "@/shared/components";
import { MainLayout } from "@/shared/layout";
import { useMutation, useQuery } from "react-query";
import { ConfidentialitySettings, patientSettingsApi } from "@/shared/api/patient/settings";

export default function Setting() {
  const t = useTranslations("Common");
  const router = useRouter();

  const labels = [
    {
      id: 0,
      whoCanSee: "Все",
      heading: "Медкарта",
      whoSeesMySetting: "Кто видит мою медкарту?",
      path: "medcard",
      active: true,
    },
    {
      id: 1,
      whoCanSee: "Мои врачи",
      heading: "История услуг",
      whoSeesMySetting: "Кто видит мою историю услуг?",
      path: "servicesHistory",
      active: false,
    },
    {
      id: 2,
      whoCanSee: "Никто",
      heading: "Сообщения",
      whoSeesMySetting: "Кто может отправлять мне сообщения?",
      path: "messages",
      active: false,
    },
  ];

  const heading = labels.find(
    (option) => option.path === router.query.setting
  )?.heading;
  const title = labels.find(
    (option) => option.path === router.query.setting
  )?.whoSeesMySetting;

  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [settingType, setSettingType] = useState<string | null>(null);

  const { data: mySettings, isLoading } = useQuery(["getPrivacySettings"], () =>
    patientSettingsApi?.getConfidentialitySettings()
  );

  const { mutate: updatePrivacySettings } = useMutation(
    ["updateConfidentialitySettings"],
    (data: Omit<ConfidentialitySettings, "patient_id">) =>
      patientSettingsApi.updateConfidentialitySettings(data)
  );

  useEffect(() => {
    if (!isLoading && mySettings) {
      const currentSetting = router.query.setting as string;
      setSettingType(currentSetting);

      switch (currentSetting) {
        case "medcard":
          setSelectedValue(mySettings?.data.medical_card);
          break;
        case "servicesHistory":
          setSelectedValue(mySettings?.data.service_history);
          break;
        case "messages":
          setSelectedValue(mySettings?.data.send_messages);
          break;
        default:
          setSelectedValue(null);
      }
    }
  }, [isLoading, mySettings, router.query.setting]);

  const options = [
    { value: "ALL", label: "Все" },
    { value: "MY_DOCTORS", label: "Мои врачи" },
    { value: "NOBODY", label: "Никто" },
  ];

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);

    const updatedSettings: Omit<ConfidentialitySettings, "patient_id"> = {
      medical_card: mySettings?.data.medical_card || "ALL",
      service_history: mySettings?.data.service_history || "ALL",
      send_messages: mySettings?.data.send_messages || "ALL",
    };

    switch (settingType) {
      case "medcard":
        updatedSettings.medical_card = value;
        break;
      case "servicesHistory":
        updatedSettings.service_history = value;
        break;
      case "messages":
        updatedSettings.send_messages = value;
        break;
    }

    updatePrivacySettings(updatedSettings);
  };

  if (isLoading) {
    return <SpinnerWithBackdrop />;
  }

  return (
    <div className="bg-white">
      <Navbar
        title={heading}
        leftButtonOnClick={() => router?.back()}
        buttonIcon={<ArrowLeftIcon />}
        className="mb-4 pt-4"
      />
      <div className="ml-4 mb-3 text-Bold20">{title}</div>

      <div className="px-4">
        {options.map((option, index) => (
          <>
            <div
              key={option.value}
              className="flex items-center justify-between"
            >
              <div className="flex items-center justify-start">
                <RadioSaunet
                  checked={selectedValue === option.value}
                  className="mr-0 py-5"
                  onChange={() => handleRadioChange(option.value)}
                />
                <div>{option.label}</div>
              </div>
            </div>
            {index !== (options?.length ?? 0) - 1 && (
              <DividerSaunet className="m-0 p-0" />
            )}
          </>
        ))}
      </div>
    </div>
  );
}

Setting.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout hideToolbar>
      <div className="bg-white h-full">{page}</div>
    </MainLayout>
  );
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../../messages/${locale}.json`))
        .default,
    },
  };
}

export const getStaticPaths = () => ({
  paths: [],
  fallback: true,
});
