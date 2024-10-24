import type { FC } from "react";

import { PlusOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import clsx from "clsx";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import { Button, Heartbeat, Island, OnlineMeeting } from "@/shared/components";
import { dateFormat, timeFormat } from "@/shared/config";

const ServicesHistoryData = [
  {
    doctorName: "Артем Тарасенко",
    doctorType: "ЛОР",
    serviceType: "Прием в клинике",
    serviceTime: "2023-06-21T07:20:00.000",
  },
  {
    doctorName: "Анастас Савченко",
    doctorType: "Уролог",
    serviceType: "Онлайн консультация",
    serviceTime: "2023-06-04T07:14:30.000",
  },
];

export const PatientServicesHistory: FC = () => {
  const t = useTranslations("Common");

  return (
    <>
      {ServicesHistoryData.map(
        ({ serviceTime, serviceType, doctorName, doctorType }) => (
          <Island isCard key={serviceTime} className="mt-4 !px-4">
            <div className="flex items-center justify-start text-Regular12">
              <div
                className={clsx(
                  "mr-2 flex items-center rounded-3xl px-2 py-1",
                  {
                    "bg-lightWarning": serviceType === t("ClinicAdmission"),
                    "bg-lightNeutral": serviceType === t("OnlineConsultation2"),
                  }
                )}
              >
                {serviceType === t("ClinicAdmission") && (
                  <Heartbeat color="brand-icon" size="sm" />
                )}
                {serviceType === t("OnlineConsultation2") && (
                  <OnlineMeeting color="brand-icon" size="sm" />
                )}
                <div className="ml-1.5">{serviceType}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center justify-start">
                <Avatar />
                <div className="ml-3 flex flex-col">
                  <div className="mb-1 text-Regular16">{doctorName}</div>
                  <div className="text-Regular12 text-secondaryText">
                    {doctorType}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-Regular16">
                  {dayjs(serviceTime).format(timeFormat)}
                </div>
                <div className="mt-1 text-Regular12 text-secondaryText">
                  {dayjs(serviceTime).format(dateFormat)}
                </div>
              </div>
            </div>
          </Island>
        )
      )}
      <div className="mt-4 rounded-3xl border-2 border-dashed border-gray-0 px-4 py-3">
        <Button size="s" className="!bg-brand-light">
          {t("AddBooking")} <PlusOutlined />
        </Button>
      </div>
    </>
  );
};
