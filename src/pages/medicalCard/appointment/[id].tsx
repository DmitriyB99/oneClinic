import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";

import { ArrowRightOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import dayjs from "dayjs";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { RateAppointmentDialog } from "@/entities/medicalCard";
import { appointmentBookingApi } from "@/shared/api/appointmentBooking";
import {
  ArrowLeftIcon,
  Button,
  DataEntry,
  Island,
  SegmentedControl,
} from "@/shared/components";
import { dateTimeFormatWithMinutes } from "@/shared/config";
import { MainLayout } from "@/shared/layout";
import { DrugEntry } from "@/widgets/medicalCard";

export default function AppointmentPage() {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.MedicalCard");
  const router = useRouter();
  const [isRateAppointmentDialogOpen, setIsRateAppointmentDialogOpen] =
    useState(true);

  // const { data: consultationData, isLoading: isConsultationDataLoading } =
  //   useQuery(["getConsultationById"], () =>
  //     appointmentBookingApi
  //       .getConsultationSlotById(String(router.query.id))
  //       .then((res) => res.data)
  //   );

  const fakeConsultationData = {
    fromTime: "2024-08-01T10:00:00Z",
    doctorFullname: "Доктор Иван Иванов",
    price: 5000,
    currency: "₸",
    medicalPrescriptionInfo: {
      patientComplaints: "Боль в горле, кашель",
      diagnosis: "Острый фарингит",
      medications: [
        { name: "Амоксициллин", frequency: "2 раза в день", durationDays: 7 },
        { name: "Парацетамол", frequency: "3 раза в день", durationDays: 5 },
      ],
    },
  };

  const consultationData = fakeConsultationData;

  const consultationTime = useMemo(() => {
    if (!consultationData?.fromTime) return "Дата не указана";

    return dayjs(consultationData.fromTime).format(dateTimeFormatWithMinutes);
  }, [consultationData?.fromTime]);

  const medications = useMemo(
    () => consultationData?.medicalPrescriptionInfo?.medications ?? [],
    [consultationData?.medicalPrescriptionInfo?.medications]
  );

  const complaints = useMemo(
    () => consultationData?.medicalPrescriptionInfo,
    [consultationData?.medicalPrescriptionInfo]
  );

  return (
    <div className="flex h-screen flex-col">
      <Island className="mb-2 flex h-fit flex-col px-4 pb-0">
        <div className="flex items-center justify-start">
          <Button
            size="s"
            variant="tinted"
            className="bg-gray-2"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon />
          </Button>
          <div className="ml-16 text-Bold16">
            {" "}
            {tMob("AppointmentsWithDoctor")}
          </div>
        </div>
        {/* {isConsultationDataLoading ? ( */}
        {false ? (
          <div className="flex h-fit w-full items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="my-6 text-Bold20 text-dark">
              {tMob("AboutAppointment")}
            </div>
            <DataEntry
              bottomText={
                consultationData?.doctorFullname ?? t("DoctorNotSpecified")
              }
              isDivided
              topText={t("Doctor")}
            />
            <DataEntry
              bottomText={
                consultationData?.price
                  ? `${consultationData.price} ${
                      consultationData?.currency ?? "₸"
                    }`
                  : t("PriceNotSpecified")
              }
              isDivided
              topText={t("Price")}
            />
            <DataEntry
              bottomText={consultationTime}
              topText={t("TimeAppointment")}
            />
          </>
        )}
      </Island>
      {(complaints?.patientComplaints || complaints?.diagnosis) && (
        <Island className="mb-2 flex h-fit flex-col p-4 pb-0">
          <div className="mb-6 text-Bold20 text-dark">
            {tMob("ComplaintsAndConclusion")}{" "}
          </div>
          <DataEntry
            bottomText={complaints?.patientComplaints ?? t("NotIndicated")}
            topText={tMob("PatientComplaints")}
            isDivided
          />
          <DataEntry
            bottomText={complaints?.diagnosis ?? t("NotIndicated")}
            topText={t("Conclusion")}
          />
        </Island>
      )}
      <Island className="mb-2 p-4 pb-0">
        <div className="pb-4 text-Bold20 text-dark">Направления</div>
        <SegmentedControl
          options={[
            { label: "Приемы", value: "appointments" },
            { label: "Анализы", value: "medicalTests" },
            { label: "Процедуры", value: "procedures" },
          ]}
          size="l"
        />
        <div className="mt-4">
          <DataEntry bottomText="Отоларинголог" topText="Прием" />
          <DataEntry bottomText="Невропатолог" topText="Прием" />
        </div>
      </Island>
      {medications.length > 0 && (
        <Island className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-Bold20 text-dark">{t("Treatment")}</div>
            <Button
              size="s"
              variant="tinted"
              className="flex items-center justify-center bg-gray-2"
              onClick={() => router.back()}
            >
              <div className="text-Medium12">{tMob("MedicationSchedule")}</div>
              <ArrowRightOutlined className="ml-1.5 mt-1.5 text-Bold14" />
            </Button>
          </div>
          {medications.map(({ name, frequency, durationDays }) => (
            <DrugEntry
              key={name}
              drugName={name}
              frequency={frequency}
              totalTime={t("DurationDays", { duration: durationDays })}
              isDivided
            />
          ))}
        </Island>
      )}
      <RateAppointmentDialog
        isOpen={isRateAppointmentDialogOpen}
        setIsOpen={setIsRateAppointmentDialogOpen}
      />
    </div>
  );
}

AppointmentPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}

export const getStaticPaths = () => ({
  paths: [],
  fallback: true,
});
