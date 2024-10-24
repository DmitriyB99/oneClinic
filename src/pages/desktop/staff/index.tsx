import type { ReactElement } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { notification } from "antd";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import {
  DesktopStaffDoctorsTable,
  DesktopStaffManagersTable,
} from "@/entities/desktopStaff";
import { Button, Dropdown, TabsSaunet } from "@/shared/components";
import { DesktopLayout } from "@/shared/layout";

export default function DesktopDoctorsPage() {
  const [tabValue, setTabValue] = useState("doctors");

  const router = useRouter();
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Staff");

  const tabItems = useMemo(
    () => [
      {
        key: "doctors",
        label: t("Doctors"),
      },
      {
        key: "managers",
        label: t("Managers"),
      },
    ],
    [t]
  );

  const [api, contextHolder] = notification.useNotification();
  const openNotification = useCallback(() => {
    api["success"]({
      message: t("DoctorAdded"),
      placement: "bottomRight",
      duration: 5,
    });
  }, [api, t]);

  useEffect(() => {
    if (router.query.doctor) {
      openNotification();
      router.replace("staff");
    }
  }, [router, openNotification]);

  const items = useMemo(
    () => [
      {
        label: (
          <div onClick={() => router.push("staff/addDoctor")} className="py-1">
            {t("AddDoctor")}
          </div>
        ),
        key: t("AddDoctor"),
      },
      {
        label: <div className="py-1">{t("AddManager")}</div>,
        key: t("AddManager"),
      },
    ],
    [router, t]
  );

  return (
    <div className="w-full px-6">
      {contextHolder}
      <div className="my-4">{t("Staff")}</div>
      <div className="flex">
        <Dropdown menu={{ items }} trigger={["click"]}>
          <Button className="!h-10 rounded-lg px-4 py-0">
            {tDesktop("PlusAddStaff")}
          </Button>
        </Dropdown>
        <Button
          className="ml-4 !h-10 rounded-lg px-4 py-0"
          variant="outline"
          outlineDanger
        >
          {t("Delete")}
        </Button>
      </div>
      <TabsSaunet
        className="mt-6 w-full text-Regular14"
        tabBarGutter={32}
        items={tabItems}
        onChange={(value) => setTabValue(value)}
        desktop
      />
      {tabValue === "doctors" ? (
        <DesktopStaffDoctorsTable />
      ) : (
        <DesktopStaffManagersTable />
      )}
    </div>
  );
}

DesktopDoctorsPage.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout hideSidebar={false}>{page}</DesktopLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}
