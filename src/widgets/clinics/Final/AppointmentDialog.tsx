import type { FC } from "react";
import { useMemo, useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";

import dayjs from "dayjs";
import { useRouter } from "next/router";

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
import { PaymentsCreditCardFinal } from "@/entities/payments";
import { appointmentBookingApi } from "@/shared/api/appointmentBooking";
import { bookingInfoApi } from "@/shared/api/bookingInfo";
import { clinicsApi } from "@/shared/api/clinics";
import { Dialog } from "@/shared/components";
import { timeFormat } from "@/shared/config";
import { UserContext } from "@/shared/contexts/userContext";
import { changeTimeFormat } from "@/shared/utils";
import { FinalInfo } from "@/widgets/clinics/Final/FinalInfo";

export const AppointmentDialog: FC<{
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

  const { data: clinicData } = useQuery(
    ["getClinicById", clinicId],
    () => clinicsApi.getClinicById(clinicId).then((res) => res.data),
    {
      enabled: isOpen && Boolean(clinicId),
    }
  );

  const { data: bookingSlots } = useQuery(
    ["getBookingSlots", selectedDate],
    () =>
      bookingInfoApi.getDoctorAvailableSlots(doctorId, selectedDate, clinicId),
    {
      enabled: isOpen && Boolean(doctorId) && Boolean(clinicId),
    }
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

  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen} className="!p-0">
      <div>
        {step === 0 && (
          <AppointmentChooseTimeFormat
            doctorProfileId={doctorId}
            clinicId={clinicId}
            onCalendarChange={(date) => {
              setSelectedDate(date);
            }}
            onSubmit={(appointmentData) => {
              setAppointmentTimeAndFormat(appointmentData);
              setStep(1);
            }}
            appointmentChips={(bookingSlots?.data ?? [])?.map(
              (bookingSlot) => ({
                isBooked: !!bookingSlot?.id,
                toTime: dayjs(bookingSlot?.toTime)?.format(timeFormat),
                fromTime: dayjs(bookingSlot?.fromTime)?.format(timeFormat),
              })
            )}
            handleBack={() => setIsOpen(false)}
            defaultSegmentValue={activeConsultationType}
          />
        )}
        {step === 1 && (
          // <div>
          //   <AppointmentChooseDirection
          //     userProfileId={user?.role_id ?? ""}
          //     setIsInDirection={(status: boolean) => setIsInDirection(status)}
          //     handleBack={() => setStep((prev) => --prev)}
          //     handleGoNext={() => {
          //       setStep((prev) => ++prev);
          //     }}
          //     handleClose={() => setIsOpen(false)}
          //   />
          // </div>
          <div className="p-4">
            <AppointmentChoosePatient
              handleBack={() => setStep((prev) => --prev)}
              handleGoNext={() => {
                setStep((prev) => ++prev);
              }}
            />
          </div>
        )}
        {step === 2 && (
          // <div className="p-4">
          //   <AppointmentChoosePatient
          //     handleBack={() => setStep(1)}
          //     handleGoNext={(id) => {
          //       setPatientId(id);
          //       setStep(3);
          //     }}
          //   />
          // </div>
          <div>
            <AppointmentChooseDirection
              userProfileId={user?.role_id ?? ""}
              setIsInDirection={(status: boolean) => setIsInDirection(status)}
              handleBack={() => setStep(1)}
              handleGoNext={(id) => {
                setPatientId(id);
                setStep(3);
              }}
              handleClose={() => setIsOpen(false)}
            />
          </div>
        )}
        {step === 3 && (
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
                format: appointmentTimeAndFormat?.format ?? "online",
              }}
              handleBack={() => setStep(2)}
              handleGoToNextPage={async () => {
                await createConsultationSlot({
                  consultationType: consultationType,
                  consultationData: {
                    isInDirection,
                    price,
                  },
                  userProfileId: String(patientId),
                  clinicId,
                  doctorProfileId: String(doctor?.id),
                  toTime: toTime,
                  fromTime: fromTime,
                  consultationStatus: "CREATED",
                });
                router.push({
                  pathname: `/booking/${1}`,
                });
              }}
            />
          </div>
        )}
        {/* {step === 4 && (
          <PaymentsCreditCardFinal
            type="noMoney"
            handleNext={() => setStep(5)}
            handleClose={() => setStep(3)}
            handleRetry={() => console.log(123)}
          />
         
        )} */}
        {step === 5 && (
          <FinalInfo
            isMedicalTest={false}
            dateString={dayjs(fromTime).format("DD MMMM YYYY в HH:mm")}
            handleClose={() => setIsOpen(false)}
            isError={createError}
          />
        )}
      </div>
    </Dialog>
  );
};
