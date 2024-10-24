import type { ReactElement } from "react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";

import dayjs from "dayjs";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import type { AppointmentTimeAndFormat } from "@/entities/appointments";
import {
  AppointmentCheckInformation,
  AppointmentChooseDirection,
  AppointmentChoosePatient,
  AppointmentChooseTimeFormat,
} from "@/entities/appointments";
import type { CreateBookingSlotModel } from "@/entities/medicalTest";
import { clinicsApi } from "@/shared/api/clinics";
import { medicalTestBookingApi } from "@/shared/api/medicalTestBooking";
import { dateTimeWithOffset, timeFormat } from "@/shared/config";
import { UserContext } from "@/shared/contexts/userContext";
import { MainLayout } from "@/shared/layout";
import { FinalInfo } from "@/widgets/clinics/Final/FinalInfo";

enum Steps {
  chooseDateTimePlace = 0,
  chooseDirection = 1,
  choosePatients = 2,
  checkInformation = 3,
  success = 4,
}

export default function TestAppointment() {
  const router = useRouter();
  const { user } = useContext(UserContext);

  const [appointmentTimeAndFormat, setAppointmentTimeAndFormat] =
    useState<AppointmentTimeAndFormat>();
  const [step, setStep] = useState<Steps>(Steps.chooseDateTimePlace);
  const [, setPatientId] = useState<string | number>();
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [fromTime, toTime] = useMemo(() => {
    const { date, time } = appointmentTimeAndFormat ?? {};
    const toTime = dayjs(time, timeFormat).add(20, "minute").format(timeFormat);
    return [
      dayjs(
        `${date?.toISOString()?.split("T")?.[0]} ${time}`,
        "YYYY-MM-DD HH:mm"
      )?.format(dateTimeWithOffset),
      dayjs(
        `${date?.toISOString()?.split("T")?.[0]} ${toTime}`,
        "YYYY-MM-DD HH:mm"
      )?.format(dateTimeWithOffset),
    ];
  }, [appointmentTimeAndFormat]);

  const { data: medicalTestData } = useQuery(["getMedicalTestById"], () =>
    medicalTestBookingApi
      .getSlotById(
        router?.query?.medicalTestId as string,
        router?.query?.type as string,
        router?.query?.clinicId as string
      )
      ?.then((response) => response.data)
  );

  const { data: clinicsData } = useQuery(["getClinics"], () =>
    clinicsApi.getClinics()
  );

  const currentClinic = useMemo(
    () =>
      clinicsData?.data?.content?.find(
        (clinic) => clinic?.clinicId === router?.query?.clinicId
      ),
    [clinicsData?.data?.content, router?.query?.clinicId]
  );

  const { data: bookingSlots } = useQuery(
    ["getBookingSlots", selectedDate],
    () =>
      medicalTestBookingApi?.getAllAvailableSlots(
        router?.query?.medicalTestId as string,
        selectedDate,
        router?.query?.clinicId as string
      )
  );
  const { mutate: createBookingSlot, isError } = useMutation(
    ["createBookingSlot"],
    (data: CreateBookingSlotModel) =>
      medicalTestBookingApi?.createBookingSlot(data)
  );

  useEffect(() => {
    if (!(router?.query?.medicalTestId && router?.query?.clinicId)) {
      router?.push("/medicalTest");
    }
  }, [router, router?.query?.medicalTestId]);

  const getSamplingMethod = useCallback((format: string) => {
    switch (format) {
      case "hospital":
        return "AT_CLINIC";
      case "home":
        return "AT_HOME";
      default:
        return "AT_CLINIC";
    }
  }, []);

  const renderContent = useMemo(() => {
    switch (step) {
      case Steps.chooseDateTimePlace:
        return (
          <div>
            <AppointmentChooseTimeFormat
              appointmentChips={bookingSlots?.data?.map((bookingSlot) => ({
                isBooked: !!bookingSlot?.id,
                toTime: dayjs(bookingSlot?.toTime)?.format(timeFormat),
                fromTime: dayjs(bookingSlot?.fromTime)?.format(timeFormat),
              }))}
              defaultSegmentValue="hospital"
              onlineDisabled
              onCalendarChange={(date) => {
                setSelectedDate(date);
              }}
              handleBack={() => {
                router?.back();
              }}
              onSubmit={(appointmentData) => {
                setAppointmentTimeAndFormat(appointmentData);
                setStep((prevStep) => ++prevStep);
              }}
            />
          </div>
        );
      case Steps.chooseDirection:
        return (
          <div>
            <AppointmentChooseDirection
              handleGoNext={() => setStep((prevStep) => ++prevStep)}
              handleBack={() => setStep((prevStep) => --prevStep)}
              userProfileId={user?.role_id ?? ""}
            />
          </div>
        );
      case Steps.choosePatients:
        return (
          <div className="bg-white p-4">
            <AppointmentChoosePatient
              handleGoNext={(id) => {
                setPatientId(id);
                setStep((prevStep) => ++prevStep);
              }}
              handleBack={() => {
                setStep((prevStep) => --prevStep);
              }}
            />
          </div>
        );
      case Steps.success:
        return (
          <div className="flex h-screen items-center bg-white p-4">
            <FinalInfo
              isMedicalTest
              dateString={dayjs(fromTime).format("DD MMMM YYYY в HH:mm")}
              handleClose={() => {
                router.push("/medicalTest");
              }}
              isError={isError}
            />
          </div>
        );
      case Steps.checkInformation:
        return (
          <div className="bg-white p-4">
            <AppointmentCheckInformation
              isMedicalTest
              handleBack={() => {
                setStep((prevStep) => --prevStep);
              }}
              handleGoToNextPage={() => {
                createBookingSlot({
                  samplingMethods: [
                    getSamplingMethod(
                      appointmentTimeAndFormat?.format ?? "hospital"
                    ),
                  ],
                  serviceDirectoryId: router?.query?.medicalTestId as string,
                  analysisTypeId: router?.query?.analysisTypeId as string,
                  type: router?.query?.type as string,
                  price: medicalTestData?.price,
                  fromTime: fromTime,
                  clinicId: router?.query?.clinicId as string,
                  toTime: toTime,
                  userProfileId: String(user?.role_id ?? ""),
                });
                setStep(Steps.success);
              }}
              appointmentInformation={{
                date: `${dayjs(appointmentTimeAndFormat?.date)?.format(
                  "DD.MM.YYYY"
                )} ${appointmentTimeAndFormat?.time ?? ""}`,
                format: appointmentTimeAndFormat?.format ?? "hospital",
                cost: medicalTestData?.price ?? 0,
                medicalTestType: medicalTestData?.serviceDirectoryName,
                medicalFacility: currentClinic?.name ?? "",
                paymentMethod: "cash",
              }}
            />
          </div>
        );
    }
  }, [
    appointmentTimeAndFormat?.date,
    appointmentTimeAndFormat?.format,
    appointmentTimeAndFormat?.time,
    bookingSlots?.data,
    createBookingSlot,
    currentClinic?.name,
    fromTime,
    getSamplingMethod,
    isError,
    medicalTestData?.price,
    medicalTestData?.serviceDirectoryName,
    router,
    step,
    toTime,
    user?.role_id,
  ]);

  return <div>{renderContent}</div>;
}
TestAppointment.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
