import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";

import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import type { SpecializationsListType } from "@/entities/login";
import { AuthDoctorSpecializationsDialog } from "@/entities/login";
import type {
  GetDutyDoctorsListRequestDTO,
  GetDutyDoctorsListResponseDTO,
} from "@/shared/api/dtos";
import {
  ArrowLeftIcon,
  Avatar,
  Button,
  Chips,
  Island,
  Navbar,
  SaunetIcon,
  StarIcon,
} from "@/shared/components";
import { DutyDoctorsDialogSelected } from "@/shared/pages/dutyDoctor";
import {
  PriceDialog,
  SpecializationsDialog,
  ClinicsDialog,
} from "@/entities/dutyDoctor";
import { dictionaryApi } from "@/shared/api/dictionary";

export default function DutyDoctorsListPage() {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.DutyDoctors");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [specialities, setSpecialities] = useState<SpecializationsListType[]>([]);
  const [otherActiveFilters, setOtherActiveFilters] =
    useState<GetDutyDoctorsListRequestDTO>({});
  const [specialitiesDialogOpen, setSpecialitiesDialogOpen] =
    useState<boolean>(false);
  const [clinicsDialogOpen, setClinicsDialogOpen] = useState<boolean>(false);
  const [filterByPriceDialogOpen, setFilterByPriceDialogOpen] =
    useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] =
    useState<GetDutyDoctorsListResponseDTO | undefined>(undefined);

  const fakeDoctorsList: GetDutyDoctorsListResponseDTO[] = [
    {
      userId: "1",
      email: "ivan.ivanov@example.com",
      doctorId: "1",
      fullName: "Доктор Иван Иванов",
      rating: 4.5,
      reviewCount: 23,
      workExperience: 10,
      phoneNumber: "+79001234567",
      photoUrl: "https://randomuser.me/api/portraits/men/1.jpg",
      clinicInfos: [
        {
          clinicId: "1",
          name: "Клиника №1",
          description:
            "Современная клиника с квалифицированными специалистами.",
          iconUrl: "/path/to/icon.png",
          rating: 4.7,
          reviewCount: 15,
          locationPoint: { x: 55.7558, y: 37.6176 },
          cityId: "1",
          cityName: "Москва",
          street: "Ленина",
          buildNumber: "15",
          phoneNumbers: [
            {
              type: "Мобильный",
              phoneNumber: "+79001234567",
            },
          ],
          clinicServices: [
            {
              type: "Консультация",
              analysisTypeId: "1",
              analysisTypeName: "Общий прием",
              serviceDirectoryId: "1",
              serviceDirectoryName: "Консультация терапевта",
              price: 3000,
            },
          ],
          workPeriods: [
            {
              days: "Пн-Пт",
              startTimes: "09:00",
              endTimes: "18:00",
            },
          ],
        },
      ],
      specialityCodes: ["Терапевт", "Инфекционист"],
      servicePrices: [
        {
          consultationType: "Обычная",
          firstPrice: "3000",
          secondPrice: "3500",
        },
      ],
      inWorkEndTimes: "18:00",
      statuss: "available",
    },
    {
      userId: "2",
      email: "anna.smirnova@example.com",
      doctorId: "2",
      fullName: "Доктор Анна Смирнова",
      rating: 4.8,
      reviewCount: 30,
      workExperience: 8,
      phoneNumber: "+79007654321",
      photoUrl: "https://randomuser.me/api/portraits/women/2.jpg",
      clinicInfos: [
        {
          clinicId: "2",
          name: "Клиника №2",
          description: "Клиника для детей с широким спектром услуг.",
          iconUrl: "/path/to/icon.png",
          rating: 4.9,
          reviewCount: 20,
          locationPoint: { x: 55.7512, y: 37.6184 },
          cityId: "1",
          cityName: "Москва",
          street: "Мира",
          buildNumber: "25",
          phoneNumbers: [
            {
              type: "Рабочий",
              phoneNumber: "+79007654321",
            },
          ],
          clinicServices: [
            {
              type: "Консультация",
              analysisTypeId: "2",
              analysisTypeName: "Педиатрия",
              serviceDirectoryId: "2",
              serviceDirectoryName: "Консультация педиатра",
              price: 3500,
            },
          ],
          workPeriods: [
            {
              days: "Пн-Пт",
              startTimes: "10:00",
              endTimes: "17:00",
            },
          ],
        },
      ],
      specialityCodes: ["Терапевт", "Инфекционист"],
      servicePrices: [
        {
          consultationType: "Обычная",
          firstPrice: "3500",
          secondPrice: "4000",
        },
      ],
      inWorkEndTimes: "17:00",
      statuss: "available",
    },
  ];

  const doctorsList = fakeDoctorsList;

  const activeSpecialities = useMemo(
    () =>
      specialities
        ?.filter((speciality) => speciality.checked)
        .map((speciality) => speciality.code ?? "") ?? [],
    [specialities]
  );

  // const { data: doctorsList } = useQuery(
  //   ["getDutyDoctorsList", activeSpecialities, otherActiveFilters],
  //   () =>
  //     doctorsApi
  //       .getDutyDoctorsList({
  //         ...otherActiveFilters,
  //         specialityCodes: String(activeSpecialities),
  //       })
  //       .then((res) => res.data.content),
  //   {
  //     retry: false,
  //     retryOnMount: false,
  //     refetchOnWindowFocus: false,
  //   }
  // );

  useQuery(["getSpecialities"], () =>
    dictionaryApi.getSpecialities().then((response) => {
      const specializations = response.data.result.map(
        (speciality: { code: string; id: string; name: string }) => ({
          code: speciality.code,
          id: speciality.id,
          speciality: speciality.name ?? "No name",
          checked: router.query?.speciality === speciality.code,
        })
      );

      setSpecialities(specializations);
      return specializations;
    })
  );

  const handleClearSpecialities = useCallback(() => {
    setSpecialities((prev) =>
      prev.map((speciality) => ({ ...speciality, checked: false }))
    );
  }, []);

  const handleChipsChange = useCallback(
    (value: string | string[] | undefined) => {
      if (Array.isArray(value)) {
        if (value.includes("По специальности") && specialitiesDialogOpen) {
          setSpecialitiesDialogOpen(true);
        } else {
          handleClearSpecialities();
        }

        // const searchFilters: Record<string, boolean | number> = {};
        if (value.includes("Клиника") && clinicsDialogOpen) {
          setClinicsDialogOpen(true);
        } else {
          handleClearSpecialities();
        }
        if (value.includes("Стоимость") && filterByPriceDialogOpen) {
          setFilterByPriceDialogOpen(true);
        }

        // setOtherActiveFilters(searchFilters);
      }
    },
    [handleClearSpecialities]
  );

  const handleSpecialitiesClick = useCallback(() => {
    setSpecialitiesDialogOpen(true);
    setClinicsDialogOpen(true);
    setFilterByPriceDialogOpen(true);
    // Закрываем другие модалки, если они открыты
    // setClinicsDialogOpen(false);
    // setFilterByPriceDialogOpen(false);
  }, []);

  const handleClinicsClick = useCallback(() => {
    setClinicsDialogOpen(true);
    // Закрываем другие модалки, если они открыты
    // setSpecialtiesDialogOpen(false);
    // setFilterByPriceDialogOpen(false);
  }, []);

  const handlePriceClick = useCallback(() => {
    setFilterByPriceDialogOpen(true);
    // Закрываем другие модалки, если они открыты
    // setSpecialtiesDialogOpen(false);
    // setClinicsDialogOpen(false);
  }, []);

  const renderedDutyDoctorList = useMemo(() => {
    if (!doctorsList || doctorsList.length === 0)
      return (
        <p className="mx-4 mt-4 text-center text-Bold16">
          {tMob("AtMomentThereAreNoAvailableDoctorsOnDuty")}
        </p>
      );

    return (
      <>
        {doctorsList?.map((doctor) => {
          const clinicInfo = doctor?.clinicInfos?.[0];
          const clinicAddress = clinicInfo?.street
            ? `ул. ${clinicInfo.street ?? ""} ${clinicInfo?.buildNumber ?? ""}`
            : "";

          return (
            <Island key={doctor.doctorId} className="mb-3">
              <div className="flex">
                <Avatar src={doctor.photoUrl} size="clinicAva" isOnline />
                <div className="ml-4 w-full">
                  <p className="mb-0 text-Regular16">{doctor.fullName}</p>
                  <div className="mb-3 flex items-center">
                    <StarIcon size="xs" />
                    <p className="mb-0 ml-1 text-Semibold12">
                      {doctor.rating.toFixed(1)}
                    </p>
                    <p className="mb-0 ml-2 text-Regular12 text-secondaryText">
                      {t("ReviewsCount", { count: doctor.reviewCount })}
                    </p>
                  </div>
                  <Button
                    block
                    size="s"
                    onClick={() => {
                      setIsOpen(true);
                      setSelectedDoctor(doctor);
                    }}
                  >
                    {t("ContactDoctor")}
                  </Button>
                </div>
              </div>
              <Chips
                chipLabels={doctor.specialityCodes ?? []}
                type="suggest"
                className="my-4"
              />
              {clinicAddress && (
                <div className="flex items-center">
                  <SaunetIcon height={32} width={32} />
                  <div className="my-0 ml-4">
                    <span className="text-Medium14">
                      {clinicInfo?.name ?? ""}
                    </span>
                    <p className="mb-0 text-Regular12 text-secondaryText">
                      {clinicAddress}
                    </p>
                  </div>
                </div>
              )}
            </Island>
          );
        })}
      </>
    );
  }, [doctorsList, t, tMob]);

  return (
    <div className="relative flex flex-col">
      <Navbar
        title={t("DoctorsOnDuty")}
        leftButtonOnClick={() => router.push("/main")}
        buttonIcon={<ArrowLeftIcon />}
        description={
          <div className="text-Medium12 text-brand-primary">24 / 7</div>
        }
        className="px-4"
      />
      <div className="rounded-b-3xl bg-white">
        <Chips
          chipLabels={["По специальности", "Стоимость", "Клиника"]}
          type="multiselect"
          className="mt-2 px-4"
          onChange={() => handleSpecialitiesClick()}
        />
      </div>
      <div className="mx-4 my-3">
        {renderedDutyDoctorList}
        <DutyDoctorsDialogSelected
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          doctor={selectedDoctor}
        />
      </div>
      <SpecializationsDialog
        specializations={specialities ?? []}
        setSpecializations={setSpecialities}
        openSpecializationsDialog={specialitiesDialogOpen}
        setOpenSpecializationsDialog={setSpecialitiesDialogOpen}
      />
      <PriceDialog
        filterByPriceDialogOpen={filterByPriceDialogOpen}
        setFilterByPriceDialogOpen={setFilterByPriceDialogOpen}
      />
      <ClinicsDialog
        clinicsDialogOpen={clinicsDialogOpen}
        setClinicsDialogOpen={setClinicsDialogOpen}
      />
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
