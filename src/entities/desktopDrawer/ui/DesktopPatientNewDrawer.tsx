import { useMemo, useState } from "react";
import type { FC } from "react";

import type { TabsProps } from "antd";
import { useTranslations } from "next-intl";

import type { DesktopBookingsNewDrawerProps } from "@/entities/desktopDrawer";
import {
  Avatar,
  Button,
  CalendarOutlinedIcon,
  Drawer,
  MessageOutlinedIcon,
  TabsSaunet,
} from "@/shared/components";
import { PatientMedicalCard, PatientServicesHistory } from "@/widgets/Desktop";

type ActiveTab = "family" | "medicalCard" | "servicesHistory";

export const DesktopPatientNewDrawer: FC<DesktopBookingsNewDrawerProps> = ({
  onClose,
  open,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("medicalCard");
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Patients");

  const tabItems: TabsProps["items"] = useMemo(
    () => [
      {
        key: "medicalCard",
        label: t("MedCard"),
      },
      {
        key: "servicesHistory",
        label: t("ServiceHistory"),
      },
      {
        key: "family",
        label: t("Family"),
      },
    ],
    [t]
  );

  return (
    <Drawer onClose={onClose} open={open} title="О пациенте">
      <div className="flex h-full flex-col justify-between">
        <div>
          <Avatar size="clinicAva" />
          <div className="my-6">
            <div className="text-Bold24">Евгений Кондратенко</div>
            <div className="mt-2 text-Regular12 text-secondaryText">
              {t("Patient")}
            </div>
          </div>
          <TabsSaunet
            items={tabItems}
            defaultActiveKey={activeTab}
            onTabClick={(tab) => setActiveTab(tab as ActiveTab)}
            desktop
          />
          {activeTab === "medicalCard" && <PatientMedicalCard />}
          {activeTab === "servicesHistory" && <PatientServicesHistory />}
        </div>
        <div className="flex w-full justify-end gap-4">
          <Button
            className="flex !h-10 items-center gap-2 rounded-lg !border px-4"
            variant="outline"
          >
            <CalendarOutlinedIcon size="sm" />
            {tDesktop("MakeAnAppointment")}
          </Button>
          <Button className="flex !h-10 items-center gap-2 rounded-lg px-4">
            <MessageOutlinedIcon size="sm" color="black" />
            {tDesktop("WriteAMessage")}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
