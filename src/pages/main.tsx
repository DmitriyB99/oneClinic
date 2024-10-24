import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";

import { EllipsisOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { SpecialistDialog } from "@/entities/clinics";
import { PopularDoctors } from "@/entities/doctor";
import type { ConsultationType, ParseConsultationTypes } from "@/entities/main";
import { UpcomingConsultationsItems } from "@/entities/main";
import { dictionaryApi } from "@/shared/api/dictionary";
import { patientBookingsApi } from "@/shared/api/patientContent/bookings";
import {
  AidKit,
  Bandaids,
  Button,
  Carousel,
  Facemask,
  FirstAidKit,
  handleQrTrigger,
  Heartbeat,
  InteractiveList,
  Island,
  MainPageChip,
  Microscope,
  Notebook,
  OnlineMeeting,
  Pills,
  QrCode,
} from "@/shared/components";
import type { ListType } from "@/shared/components";
import { CONSULTATION_STATUS } from "@/shared/constants";
import { UserContext } from "@/shared/contexts/userContext";
import {
  COMPLETED_AMBULANCE_ONBOARDING,
  COMPLETED_DUTY_DOCTOR_ONBOARDING,
  getOnboardingStatusByType,
} from "@/shared/utils";
import { ComingSoonDialog } from "@/widgets/comingSoon";
import { StoriesOnMain } from "@/widgets/stories";

function Home() {
  const router = useRouter();
  const { user, setAuthToken, setLocale, setGeo } = useContext(UserContext);
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.Main");
  const tDesktop = useTranslations("Desktop.Bookings");

  const [isComingSoonDialogOpen, setIsComingSoonDialogOpen] = useState(false);

  const { data: upcomingConsultations } = useQuery(["getMyConsultations"], () =>
    patientBookingsApi.getBookings()
  );

  const { data: specialities } = useQuery(["getSpecialities"], () =>
    dictionaryApi.getSpecialities().then((response) =>
      response.data.result.map(
        (speciality: { id: string; name: string; image_url?: string }) => ({
          id: speciality.id,
          title: speciality.name ?? "No name",
          startIcon: (
            <Avatar
              shape="square"
              size={64}
              style={{ borderRadius: "12px" }}
              src={speciality?.image_url}
            />
          ),
        })
      )
    )
  );

  const parseConsultationType = useCallback(
    (type: string): ConsultationType => {
      switch (type) {
        case "OFFLINE":
          return {
            text: t("ClinicAdmission") as ParseConsultationTypes,
            icon: <Heartbeat size="sm" />,
          };
        case "AWAY":
          return {
            text: tDesktop("DoctorCallAtHome") as ParseConsultationTypes,
            icon: <AidKit size="sm" color="black" />,
          };
        case "ANALYSIS":
          return {
            text: t("Analyzes") as ParseConsultationTypes,
            icon: <Microscope size="sm" />,
          };
        default:
          return {
            text: t("OnlineConsultation2") as ParseConsultationTypes,
            icon: <OnlineMeeting size="sm" />,
          };
      }
    },
    [t, tDesktop]
  );

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

  useEffect(() => {
    if (user?.role === "doctor") {
      router.push("/mainDoctor");
    }
  }, [router, user?.role]);

  const nonConfirmedUpcomingConsultations = useMemo(
    () =>
      upcomingConsultations?.data?.filter(
        ({ status }) =>
          status === CONSULTATION_STATUS.NOT_CONFIRMED ||
          status === CONSULTATION_STATUS.MOVED_NOT_CONFIRMED
      ) ?? [],
    [upcomingConsultations?.data]
  );

  useEffect(() => {
    if (nonConfirmedUpcomingConsultations.length > 0) {
      router.push(`/booking/${nonConfirmedUpcomingConsultations[0].id}`);
    }
  }, [nonConfirmedUpcomingConsultations, router]);

  const UpcomingConsultationSlides = useMemo(
    () =>
      upcomingConsultations?.data?.map((consultation) => (
        <UpcomingConsultationsItems
          key={consultation.id}
          consultation={consultation}
          parseConsultationType={parseConsultationType}
          router={router}
        />
      )) ?? [],
    [parseConsultationType, router, upcomingConsultations?.data]
  );

  useEffect(() => {
    window.handleMessageFromMobile = (message) => {
      try {
        const data = JSON.parse(message);

        if (data.token) {
          setAuthToken(data.token);
        }

        if (data.language) {
          setLocale(data.language);
        }

        if (data.latitude && data.longitude) {
          setGeo([parseFloat(data.latitude), parseFloat(data.longitude)]);
        }
      } catch (error) {
        console.error("Error while processing data:", error);
      }
    };

    // Очистка обработчика при размонтировании компонента
    return () => {
      delete window.handleMessageFromMobile;
    };
  }, []);

  return (
    <main className="bg-gray-0">
      <StoriesOnMain />

      <span className="text-brand-icon" />
      <Island className="mb-2 grid grid-cols-4 gap-x-6 gap-y-7 !px-5 !py-7">
        <MainPageChip
          bottomText={t("ClinicsAndDoctors")}
          icon={<Bandaids color="brand-icon" size="mainIcon" />}
          redirectTo="/clinics"
        />
        <MainPageChip
          bottomText={t("MyMedCard")}
          icon={<Notebook color="brand-icon" size="mainIcon" />}
          redirectTo="/medicalCard"
        />
        <MainPageChip
          bottomText={t("DoctorOnDuty")}
          icon={<Facemask color="brand-icon" size="mainIcon" />}
          redirectTo={
            getOnboardingStatusByType(COMPLETED_DUTY_DOCTOR_ONBOARDING)
              ? "/dutyDoctors/list"
              : "/dutyDoctors"
          }
        />

        <MainPageChip
          bottomText={t("OnlineConsultation2")}
          icon={<OnlineMeeting color="brand-icon" size="mainIcon" />}
          redirectTo="/onlineConsultations"
        />
        <MainPageChip
          bottomText={tMob("OneQr")}
          icon={<QrCode size="mainIcon" color="brand-icon" />}
          // onClick={() => handleQrTrigger()}
          redirectTo="/oneQr"
        />
        <MainPageChip
          bottomText={t("Analyzes")}
          icon={<Heartbeat size="mainIcon" color="brand-icon" />}
          redirectTo="/medicalTest"
        />
        <MainPageChip
          bottomText={tMob("Pharmacy")}
          icon={<Pills color="brand-icon" size="mainIcon" />}
          onClick={() => setIsComingSoonDialogOpen(true)}
        />
        <MainPageChip
          bottomText={t("Emergency")}
          icon={<FirstAidKit color="red" size="mainIcon" />}
          redirectTo={
            getOnboardingStatusByType(COMPLETED_AMBULANCE_ONBOARDING)
              ? "/callAmbulance"
              : "/callAmbulance/onboarding"
          }
          // onClick={() => setIsComingSoonDialogOpen(true)}
        />
      </Island>

      <Island className="mb-2 !rounded-r-none !p-0 !pt-4">
        <p className="mb-0 ml-4 text-Bold20">{t("NextAppointment")}</p>
        {UpcomingConsultationSlides.length > 0 ? (
          <Carousel customSlides items={UpcomingConsultationSlides} />
        ) : (
          <div className="p-4 pt-3">
            <p className="text-Regular16">{tMob("NotHaveConsultations")}</p>
            <Button className="w-full" onClick={() => router.push("/clinics")}>
              {tMob("ReceiveFirstConsultation")}
            </Button>
          </div>
        )}
      </Island>

      {/* <PopularDoctors /> */}

      <Island className="mt-2 !p-4">
        <div className="flex items-center justify-between">
          <p className="mb-0 text-Bold20">{t("Specializations")}</p>
          <SpecialistDialog
            list={specialities ?? []}
            onSpecialityClick={handleSpecialtyClick}
          />
        </div>
        <InteractiveList
          list={specialities ?? []}
          onClick={handleSpecialtyClick}
          maxItems={3}
        />
      </Island>

      <ComingSoonDialog
        open={isComingSoonDialogOpen}
        setIsOpen={setIsComingSoonDialogOpen}
      />
    </main>
  );
}

export default Home;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
}
