import type { FC } from "react";
import { useCallback } from "react";
import { useQuery } from "react-query";

import { Spin } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";

import type { ServiceType } from "@/entities/myDoctorPatients";
import { servicesHistoryApi } from "@/shared/api/serviceHistory";
import { DefaultCell } from "@/shared/components";
import { dateFormat } from "@/shared/config";

export const PatientHistoryPage: FC = ({}) => {
  const router = useRouter();
  const { id } = router.query;

  const { data: patientHistoryData, isLoading: isHistoryLoading } = useQuery(
    ["patientHistory", id],
    () =>
      servicesHistoryApi.getUserServiceHistory(id as string).then((res) =>
        res.data.content.map((patientHistoryItem) => {
          if (patientHistoryItem.consultationType) {
            return {
              title: "Консультация",
              caption: patientHistoryItem?.doctorName,
              date: dayjs(patientHistoryItem?.fromTime).format(dateFormat),
              serviceType: "appointment",
              id: patientHistoryItem.id,
            };
          } else {
            return {
              title: patientHistoryItem?.name,
              caption: patientHistoryItem?.clinicName,
              date: dayjs(patientHistoryItem?.fromTime).format(dateFormat),
              serviceType: "analysis",
              id: patientHistoryItem.id,
            };
          }
        })
      )
  );

  const handlePatientHistoryItemClick = useCallback(
    (serviceType?: ServiceType, id?: string) => {
      if (serviceType === "analysis") {
        return router.push(`/medicalCard/analysis/${id}`);
      }
      return router.push(`/medicalCard/appointment/${id}`);
    },
    [router]
  );

  if (isHistoryLoading) {
    return (
      <div className="flex h-fit w-full items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="overflow-auto bg-gray-2">
      {patientHistoryData?.map(({ title, caption, date, id, serviceType }) => (
        <div className="px-4" key={id}>
          <DefaultCell
            title={title}
            caption={<div className="pb-3">{caption}</div>}
            className="my-4 rounded-3xl"
            rightElement={
              <div className="text-Regular12 text-secondaryText">{date}</div>
            }
            onClick={() =>
              handlePatientHistoryItemClick(serviceType as ServiceType, id)
            }
          />
        </div>
      ))}
    </div>
  );
};
