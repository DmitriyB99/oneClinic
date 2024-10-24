import { useQuery } from "react-query";
import { useCallback, useState } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { SplideSlide } from "@splidejs/react-splide";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { DoctorInfoCard } from "@/entities/doctor";
import { doctorsApi } from "@/shared/api";
import { Carousel, Island } from "@/shared/components";
import { SpecialistDialog } from "@/entities/clinics"; // Импортируем SpecialistDialog
import { AppointmentDialog } from "@/widgets/clinics/Final";
import { AppointmentForOnlineConsultationsDialog } from "@/widgets/clinics/Final/AppointmentDialogForOnlineConsultations";
import { patientDoctorsApi } from "@/shared/api/patientContent/doctors";

export const PopularDoctors = ({ isOnlineConsultation = false }) => {
  const [isOpenAppointmentDialog, setIsOpenAppointmentDialog] =
    useState<boolean>(false);
  const [isOpenOnlineAppointmentDialog, setIsOpenOnlineAppointmentDialog] =
    useState<boolean>(false);
  const router = useRouter();
  const t = useTranslations("Common");

  const { data: popularDoctors } = useQuery(["getPopularDoctors"], () =>
    patientDoctorsApi.getPopularDoctors().then((res) => res.data)
  );

  console.log('popularDoctors')
  console.log(popularDoctors)

  // const popularDoctors = [
  //   {
  //     doctorId: "1",
  //     fullName: "Ахметова Жанна Маратовна",
  //     photoUrl: "doctor-profile.png",
  //     rating: 4.5,
  //     phoneNumber: "77085596445",
  //     clinicInfos: [{ clinicId: "1" }],
  //     reviewCount: 100,
  //     specialityCodes: ["Cardiology", "Pediatrics"],
  //     servicePrices: [
  //       {
  //         consultationType: "ONLINE",
  //         firstPrice: "5000",
  //         secondPrice: "6000",
  //       },
  //       {
  //         consultationType: "OFFLINE",
  //         firstPrice: "10000",
  //         secondPrice: "12000",
  //       },
  //       {
  //         consultationType: "AWAY",
  //         firstPrice: "15000",
  //         secondPrice: "18000",
  //       },
  //     ],
  //   },
  //   {
  //     doctorId: "2",
  //     fullName: "Пак Ли Александрович",
  //     rating: 4.7,
  //     reviewCount: 200,
  //     specialityCodes: ["Dermatology", "Allergy"],
  //     servicePrices: [
  //       {
  //         consultationType: "ONLINE",
  //         firstPrice: "4000",
  //         secondPrice: "5000",
  //       },
  //       {
  //         consultationType: "OFFLINE",
  //         firstPrice: "8000",
  //         secondPrice: "10000",
  //       },
  //       {
  //         consultationType: "AWAY",
  //         firstPrice: "12000",
  //         secondPrice: "15000",
  //       },
  //     ],
  //   },
  //   {
  //     doctorId: "3",
  //     fullName: "Dr. Emily Johnson",
  //     rating: 4.8,
  //     reviewCount: 150,
  //     specialityCodes: ["Neurology", "Psychiatry"],
  //     servicePrices: [
  //       {
  //         consultationType: "ONLINE",
  //         firstPrice: "6000",
  //         secondPrice: "7000",
  //       },
  //       {
  //         consultationType: "OFFLINE",
  //         firstPrice: "11000",
  //         secondPrice: "14000",
  //       },
  //       {
  //         consultationType: "AWAY",
  //         firstPrice: "16000",
  //         secondPrice: "19000",
  //       },
  //     ],
  //   },
  // ];

  // Пример списка для передачи в SpecialistDialog
  const specialistList = [
    { id: "Cardiology", title: "Кардиология" },
    { id: "Pediatrics", title: "Педиатрия" },
    { id: "Dermatology", title: "Дерматология" },
    { id: "Allergy", title: "Аллергология" },
    { id: "Neurology", title: "Неврология" },
    { id: "Psychiatry", title: "Психиатрия" },
  ];

  const handleSpecialityClick = (code: string | number) => {
    router.push({
      pathname: "clinics/map",
      query: { widget: "doctors", speciality: code },
    });
  };

  const handleSpecialtyClick = useCallback(
    (doctorSpeciality?: number | string) => {
      router.push({
        pathname: "clinics/map",
        query: {
          widget: "doctors",
          ...(!!doctorSpeciality && { speciality: doctorSpeciality }),
        },
      });
    },
    [router]
  );

  return popularDoctors && popularDoctors.length > 0 ? (
    <Island className="my-2 !p-4 !rounded-r-none">
      <div className="flex items-center justify-between">
        <p className="mb-0 text-Bold20">{t("PopularSpecialists")}</p>
        <div
          className="flex cursor-pointer rounded-3xl bg-gray-2 px-3 py-1 text-Medium12"
          onClick={() =>
            isOnlineConsultation
              ? router.push("/doctors")
              : handleSpecialtyClick()
          }
        >
          <span className="mr-1">{t("All")}</span>
          <ArrowRightOutlined />
        </div>
      </div>
      <Carousel
        customSlides
        items={popularDoctors.map((doctor) => (
          <SplideSlide key={1} className="mr-3 mt-3 !w-[327px]">
            <div className="rounded-3xl border border-solid border-gray-3">
              <DoctorInfoCard
                className="!p-0"
                isOnlineConsultation={isOnlineConsultation}
                onRegisterAppointment={() =>
                  isOnlineConsultation
                    ? setIsOpenOnlineAppointmentDialog(true)
                    : setIsOpenAppointmentDialog(true)
                }
                {...doctor}
                onCardClick={() => router.push(`/doctor/${1}`)}
              />
            </div>
          </SplideSlide>
        ))}
      />
      <AppointmentDialog
        doctorId={"1" as string}
        clinicId={"1" ?? ""}
        isOpen={isOpenAppointmentDialog}
        setIsOpen={setIsOpenAppointmentDialog}
      />
      <AppointmentForOnlineConsultationsDialog
        doctorId={"1" as string}
        clinicId={"1" ?? ""}
        isOpen={isOpenOnlineAppointmentDialog}
        setIsOpen={setIsOpenOnlineAppointmentDialog}
      />
    </Island>
  ) : null;
};
