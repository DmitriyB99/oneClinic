import { ReactElement, useEffect, useState } from "react";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import {
  ArrowLeftIcon,
  DividerSaunet,
  Navbar,
  SpinnerWithBackdrop,
  Toggle,
} from "@/shared/components";
import { MainLayout } from "@/shared/layout";
import { useMutation, useQuery } from "react-query";
import { Notifications, patientSettingsApi } from "@/shared/api/patient/settings";

export default function MyNotifications() {
  const t = useTranslations("Common");
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notifications>();

  const { data: myNotifications, isLoading } = useQuery(
    ["getNotificationsSettings"],
    () => patientSettingsApi?.getNotificationsSettings()
  );
  const { mutate: updateNotificationsSettings } = useMutation(
    ["updateNotificationsSettings"],
    (data: Notifications) => patientSettingsApi.updateNotificationsSettings(data)
  );

  useEffect(() => {
    if (!isLoading && myNotifications?.data) {
      const initialNotifications = Object.entries(myNotifications.data).reduce(
        (acc, [key, value]) => {
          acc[key] = value as boolean;
          return acc;
        },
        {} as { [key: string]: boolean }
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      setNotifications(initialNotifications);
    }
  }, [isLoading, myNotifications]);

  const handleToggleChange = (label: string, checked: boolean) => {
    setNotifications((prev) => {
      const updatedNotifications: Notifications = { ...prev, [label]: checked };
      updateNotificationsSettings(updatedNotifications);
      return updatedNotifications;
    });
  };

  if (isLoading || !notifications) {
    return <SpinnerWithBackdrop />;
  }

  return (
    <div className="bg-white">
      <Navbar
        title={t("Notifications")}
        leftButtonOnClick={() => router?.back()}
        buttonIcon={<ArrowLeftIcon />}
        className="mb-4 pt-4"
      />
      <div className="mb-4 px-4">
        {Object.entries(notifications).map(([key, value], index) => (
          <div key={key} className={key === "patient_id" ? "hidden" : ""}>
            <div className="flex items-center justify-between">
              <div className="text-Regular16">{key}</div>
              <Toggle
                checked={value}
                onChange={(checked) => handleToggleChange(key, checked)}
              />
            </div>
            {index !== Object.entries(notifications).length - 1 && (
              <DividerSaunet />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

MyNotifications.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout hideToolbar>
      <div className="bg-white h-full">{page}</div>
    </MainLayout>
  );
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
