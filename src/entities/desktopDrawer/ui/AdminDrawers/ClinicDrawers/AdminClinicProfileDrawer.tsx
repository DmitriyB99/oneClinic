import { useState } from "react";
import type { FC } from "react";

import type { TabsProps } from "antd";
import { useTranslations } from "next-intl";

import type { DesktopBookingsNewDrawerProps } from "@/entities/desktopDrawer";
import { Address, Contacts } from "@/entities/desktopDrawer";
import { Drawer, TabsSaunet } from "@/shared/components";

import { GeneralInfo } from "./GeneralInfo";

const tabItems: TabsProps["items"] = [
  {
    key: "generalInfo",
    label: "Общая информация",
  },
  {
    key: "contacts",
    label: "Контакты",
  },
  {
    key: "address",
    label: "Адрес",
  },
];

type ActiveTab = "generalInfo" | "contacts" | "address";

export const AdminClinicProfileDrawer: FC<DesktopBookingsNewDrawerProps> = ({
  onClose,
  open,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("generalInfo");
  const t = useTranslations("Common");
  return (
    <Drawer onClose={onClose} open={open} title={t("AboutClinic")}>
      <div className="flex h-full flex-col">
        <div>
          <TabsSaunet
            items={tabItems}
            defaultActiveKey={activeTab}
            onTabClick={(tab) => setActiveTab(tab as ActiveTab)}
            desktop
          />
          {activeTab === "generalInfo" && <GeneralInfo />}
          {activeTab === "contacts" && <Contacts />}
          {activeTab === "address" && <Address />}
        </div>
      </div>
    </Drawer>
  );
};
