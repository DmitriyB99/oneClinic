import { useMemo, useState } from "react";
import { useQuery } from "react-query";

import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { DoctorInfoCard } from "@/entities/doctor";
import { ArrowLeftIcon, Chips, Dialog, Navbar } from "@/shared/components";
import { AppointmentCheckInformation } from "@/entities/appointments";

// Фейковые данные для врачей
const fakeDoctors = [
  {
    doctorId: "1",
    fullName: "Ахметова Жанна Маратовна",
    photoUrl: "doctor-profile.png",
    rating: 4.5,
    phoneNumber: "77085596445",
    clinicInfos: [{ clinicId: "1" }],
    reviewCount: 100,
    specialityCodes: ["Cardiology", "Pediatrics"],
    servicePrices: [
      {
        consultationType: "ONLINE",
        firstPrice: "5000",
        secondPrice: "6000",
      },
      {
        consultationType: "OFFLINE",
        firstPrice: "10000",
        secondPrice: "12000",
      },
      {
        consultationType: "AWAY",
        firstPrice: "15000",
        secondPrice: "18000",
      },
    ],
  },
  {
    doctorId: "2",
    fullName: "Пак Ли Александрович",
    rating: 4.7,
    reviewCount: 200,
    specialityCodes: ["Dermatology", "Allergy"],
    servicePrices: [
      {
        consultationType: "ONLINE",
        firstPrice: "4000",
        secondPrice: "5000",
      },
      {
        consultationType: "OFFLINE",
        firstPrice: "8000",
        secondPrice: "10000",
      },
      {
        consultationType: "AWAY",
        firstPrice: "12000",
        secondPrice: "15000",
      },
    ],
  },
  {
    doctorId: "3",
    fullName: "Dr. Emily Johnson",
    rating: 4.8,
    reviewCount: 150,
    specialityCodes: ["Neurology", "Psychiatry"],
    servicePrices: [
      {
        consultationType: "ONLINE",
        firstPrice: "6000",
        secondPrice: "7000",
      },
      {
        consultationType: "OFFLINE",
        firstPrice: "11000",
        secondPrice: "14000",
      },
      {
        consultationType: "AWAY",
        firstPrice: "16000",
        secondPrice: "19000",
      },
    ],
  },
];

export default function DutyDoctorsListPage() {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.DutyDoctors");
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: doctorsList } = useQuery(
    ["getAllDoctors"],
    () =>
      new Promise<{ content: typeof fakeDoctors }>((resolve) =>
        setTimeout(() => resolve({ content: fakeDoctors }), 500)
      ),
    // doctorsApi
    // .getDoctor({
    //   bodySpecialityCodes: activeSpecialities,
    // })
    // .then((res) => res.data.content),

    {
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const renderedDoctorsList = useMemo(() => {
    if (!doctorsList || doctorsList.content.length === 0)
      // if (!doctorsList || doctorsList.length === 0)

      return (
        <p className="mx-4 mt-4 text-center text-Bold16">
          {tMob("AtMomentThereAreNoAvailableDoctorsOnDuty")}
        </p>
      );

    return (
      <>
        {doctorsList.content.map((doctor, idx) => (
          // {doctorsList?.map((doctor, idx) => (
          //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //   // @ts-ignore-next-line

          <DoctorInfoCard
            key={doctor?.doctorId ?? idx}
            className="m-0"
            isOnlineConsultation
            onCardClick={() => router.push(`/doctor/${doctor.doctorId}`)}
            onRegisterAppointment={() => setIsOpen(true)}
            {...doctor}
          />
        ))}
      </>
    );
  }, [doctorsList, router, tMob]);

  return (
    <div className="relative flex flex-col">
      <Navbar
        title={t("Doctors")}
        leftButtonOnClick={() => router.back()}
        buttonIcon={<ArrowLeftIcon />}
        className="px-4"
      />
      <div className="rounded-b-3xl bg-white">
        <Chips
          chipLabels={[t("Schedule"), t("Price")]}
          type="multiselect"
          className="mt-2 px-4"
          // onChange={handleChipsChange}
        />
      </div>
      {renderedDoctorsList}

      <Dialog isOpen={isOpen} setIsOpen={setIsOpen} className="!p-0">
        <div className="p-4">
          <AppointmentCheckInformation
            appointmentInformation={{
              cost: 2900,
              date: `3 марта, среда, 12:00`,
              doctor: `Тестовый Доктор Отчество`,
              medicalFacility: "OneClinic",
              format: "online",
            }}
            submitButtonText="Связаться с врачом"
            handleBack={() => setIsOpen(false)}
            handleGoToNextPage={() => {
              router.push({
                pathname: `/chat/${1}`,
              });
            }}
          />
        </div>
      </Dialog>
    </div>
  );
}

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
