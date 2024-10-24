import type { FC } from "react";
import { useMemo, useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";

import dayjs from "dayjs";

import type {
  AppointmentTimeAndFormat,
  CreateConsultationSlotModel,
} from "@/entities/appointments";
import {
  AppointmentCheckInformation,
  AppointmentChooseDirection,
  AppointmentChoosePatient,
  AppointmentChooseTimeFormat,
} from "@/entities/appointments";
import type { DoctorProfile } from "@/entities/clinics";
import { appointmentBookingApi } from "@/shared/api/appointmentBooking";
import { bookingInfoApi } from "@/shared/api/bookingInfo";
import { clinicsApi } from "@/shared/api/clinics";
import { Dialog } from "@/shared/components";
import { timeFormat } from "@/shared/config";
import { UserContext } from "@/shared/contexts/userContext";
import { changeTimeFormat } from "@/shared/utils";
import { FinalInfo } from "@/widgets/clinics/Final/FinalInfo";
import { useRouter } from "next/router";
import { PaymentsCreditCardFinal } from "@/entities/payments";

export const AppointmentForOnlineConsultationsDialog: FC<{
  activeConsultationType?: string;
  doctor?: DoctorProfile;
  doctorId: string;
  clinicId: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}> = ({
  isOpen,
  setIsOpen,
  doctor,
  doctorId,
  clinicId,
  activeConsultationType,
}) => {
  const { user } = useContext(UserContext);
  const [step, setStep] = useState(0);
  const [appointmentTimeAndFormat, setAppointmentTimeAndFormat] =
    useState<AppointmentTimeAndFormat>();
  const [isInDirection, setIsInDirection] = useState<boolean>(false);
  const [patientId, setPatientId] = useState<string | number>();
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );

  const { data: clinicData } = useQuery(["getClinicById", clinicId], () =>
    clinicsApi.getClinicById(clinicId).then((res) => res.data)
  );

  const { mutate: createConsultationSlot, isError: createError } = useMutation(
    ["createConsultationSlot"],
    (data: CreateConsultationSlotModel) =>
      appointmentBookingApi?.createConsultationSlot(data)
  );

  const [fromTime, toTime] = useMemo(() => {
    const { date, time } = appointmentTimeAndFormat ?? {};
    if (!date || !time) return [];

    return changeTimeFormat(date, time);
  }, [appointmentTimeAndFormat]);
  const router = useRouter();

  const consultationType = useMemo(() => {
    switch (appointmentTimeAndFormat?.format) {
      case "hospital":
        return "OFFLINE";
      case "home":
        return "AWAY";
      default:
        return "ONLINE";
    }
  }, [appointmentTimeAndFormat?.format]);

  const price = useMemo(
    () =>
      parseInt(
        doctor?.servicePrices?.find(
          (serviceType) => serviceType.consultationType === consultationType
        )?.firstPrice ?? ""
      ),
    [consultationType, doctor?.servicePrices]
  );

  const handleGoToNextPage = () => {
    console.log("handleGoToNextPage triggered");
    router.push("/chat");
  };

  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen} className="!p-0">
      <div className="p-4">
        <AppointmentCheckInformation
          appointmentInformation={{
            address: `ул. ${clinicData?.street} ${clinicData?.buildNumber}`,
            cost: price ?? 0,
            date: `${dayjs(appointmentTimeAndFormat?.date)?.format(
              "DD.MM.YYYY"
            )} ${appointmentTimeAndFormat?.time ?? ""}`,
            doctor: `${doctor?.firstName ?? ""} ${doctor?.lastName ?? ""}`,
            medicalFacility: clinicData?.name ?? "OneClinic",
            format: "online",
          }}
          submitButtonText="Связаться с врачом"
          handleBack={() => setIsOpen(false)}
          handleGoToNextPage={
            () => router.push("/chat/1")
            //     async () => {
            //     await createConsultationSlot({
            //       consultationType: consultationType,
            //       consultationData: {
            //         isInDirection,
            //         price,
            //       },
            //       userProfileId: String(patientId),
            //       clinicId,
            //       doctorProfileId: String(doctor?.id),
            //       toTime: toTime,
            //       fromTime: fromTime,
            //       consultationStatus: "CREATED",
            //     });
            //     router.push({
            //       pathname: `/booking/${1}`,
            //     });
            //   }
          }
        />
      </div>
    </Dialog>
  );
};
