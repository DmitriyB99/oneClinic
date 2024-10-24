import type { FC } from "react";
import { useQuery } from "react-query";

import { Alert, Spin } from "antd";
import { useTranslations } from "next-intl";

import { DesktopMainSubCard } from "@/entities/desktopMain";
import { superAdminApis } from "@/shared/api";

interface AppointmentDoctorProps {
  id?: string;
}
export const AppointmentDoctor: FC<AppointmentDoctorProps> = ({ id }) => {
  const tDesktop = useTranslations("Desktop.Admin");
  const {
    data: doctorConsultationsData,
    isError,
    isLoading,
  } = useQuery(
    ["getAllDoctorConsultations", id],
    () =>
      superAdminApis
        .getAllDoctorConsultations(id as string)
        .then((res) => res.data.content),
    {
      enabled: Boolean(id),
    }
  );

  return (
    <div className="flex w-full flex-col gap-5">
      {doctorConsultationsData?.map((consult) => (
        <DesktopMainSubCard
          key={consult.bookingConsultationSlotId}
          time={consult.toTime}
          name={consult.patientFullName}
          notifications={consult.consultationStatus}
          className="!w-full"
          isTransaction
        />
      ))}
      {doctorConsultationsData?.length === 0 && (
        <Alert type="info" message={tDesktop("NoBookings")} />
      )}
      {isError && <Alert type="error" message={tDesktop("LoadingError")} />}
      {isLoading && <Spin />}
    </div>
  );
};
