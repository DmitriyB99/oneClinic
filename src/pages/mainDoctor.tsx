import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery, useMutation } from "react-query";

import { RightOutlined } from "@ant-design/icons";
import { SplideSlide } from "@splidejs/react-splide";
import dayjs from "dayjs";
import type { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import type { DoctorProfile } from "@/entities/clinics";
import type { ConsultationType, ParseConsultationTypes } from "@/entities/main";
import {
  AddProfileInfoDialog,
  OnDutyDoctorDialog,
  StartEarningWithOneclinicDialog,
} from "@/entities/mainDoctor";
import { UpcomingDoctorsConsultations } from "@/entities/mainDoctor/ui/upcomingDoctorsConsultations";
import { DutyDoctorSwitch } from "@/features/mainDoctor";
import { appointmentBookingApi } from "@/shared/api/appointmentBooking";
import { doctorBookingsApi } from "@/shared/api/doctor/bookings";
import { doctorsApi } from "@/shared/api/doctors";
import {
  AidKit,
  ArrowUpIcon,
  Avatar,
  Button,
  Carousel,
  Chips,
  CloseIcon,
  Heartbeat,
  InfoIcon,
  Island,
  OnlineMeeting,
  ProgressBar,
  ThreeDotsHorizontalIcon,
} from "@/shared/components";
import {
  colors,
  dateFormat,
  timeFormat,
  dateTimeWithOffset,
  formatMoney,
  systemDateWithoutTime,
} from "@/shared/config";
import {
  COMPLETED_DOCTOR_ONBOARDING,
  getOnboardingStatusByType,
} from "@/shared/utils";
import { DoctorMainHeader } from "@/widgets/doctorMain/DoctorMainHeader";
import { StoriesOnMain } from "@/widgets/stories";

const MainDoctorChart = lazy(() =>
  import("@/features/mainDoctor").then((module) => ({
    default: module.MainDoctorChart,
  }))
);

function HomeDoctor() {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.MyDoctor");
  const tDesktop = useTranslations("Desktop.Bookings");
  const { data: myProfile } = useQuery(["getMyProfile"], () =>
    doctorsApi.getMyDoctorProfile().then((res) => res.data)
  );
  const [isDutyDoctorActive, setIsDutyDoctorActive] = useState(false);

  const [onDutyDoctorDialogOpen, setOnDutyDoctorDialogOpen] =
    useState<boolean>(false);

  const [startEarningDialogOpen, setStartEarningDialogOpen] =
    useState<boolean>(false);

  const [addProfileInfo, setAddProfileInfo] = useState<boolean>(false);

  const [isProfileProgressShown, setIsProfileProgressShown] =
    useState<boolean>(false);

  const [chartFilters, setChartFilters] = useState<string>("Все клиники");

  // const dateForStatatistics = {
  //   start_date: dayjs(new Date()).format(systemDateWithoutTime),
  //   end_date: dayjs(new Date()).format(systemDateWithoutTime),
  // };

  const dateForStatatistics = {
    start_date: "2024-09-23",
    end_date: "2024-10-25",
  };

  const { data: bookingStatistic } = useQuery(
    ["getBookingStatistic", myProfile],
    () =>
      doctorBookingsApi
        .getStatusStatistic(dateForStatatistics)
        .then((res) => res.data)
  );

  const bookingsState = Array.isArray(bookingStatistic)
    ? bookingStatistic.reduce((acc, item) => {
        acc[item.status.toLowerCase()] = item.count;
        acc.all = (acc.all || 0) + item.count;
        return acc;
      }, {})
    : { all: 0, active: 0, canceled: 0, done: 0, moved: 0, paid: 0 };

  const { data: doctorIncomeData } = useQuery(["getDoctorIncome"], () =>
    doctorsApi
      .getDoctorIncome(
        dayjs().add(-1, "week").format(dateTimeWithOffset),
        dayjs().format(dateTimeWithOffset)
      )
      .then((res) => res.data.earningsSum)
  );

  const { data: doctorUpcomingBookings } = useQuery(
    ["getUpcomingBookings"],
    () => doctorBookingsApi.getUpcomingBookings().then((res) => res.data)
  );

  const { mutate: updateDutyDoctorStatus } = useMutation(
    ["updateDutyDoctorStatus"],
    (updatedDutyDoctorStatus: DoctorProfile) =>
      doctorsApi.updateDutyDoctorStatus(updatedDutyDoctorStatus)
  );

  const router = useRouter();
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
        case "CUSTOM":
          return {
            text: t("ClinicAdmission") as ParseConsultationTypes,
            icon: <Heartbeat size="sm" />,
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

  const UpcomingDoctorsSlides = useMemo(
    () =>
      doctorUpcomingBookings?.map((consultation) => (
        <UpcomingDoctorsConsultations
          key={consultation.id}
          consultation={consultation}
          parseConsultationType={parseConsultationType}
        />
      )) ?? [],
    [parseConsultationType, router, doctorUpcomingBookings]
  );

  useEffect(() => {
    if (!getOnboardingStatusByType(COMPLETED_DOCTOR_ONBOARDING)) {
      router.push("/myDoctor/onboarding");
    }
  }, [router]);

  return (
    <>
      <main className="bg-gray-0">
        <StoriesOnMain avatarUrl={"doctor-profile.png"} rating={2} />
        {/* <DoctorMainHeader
          avatarUrl={myProfile?.photoUrl}
          rating={myProfile?.rating}
          className="mb-4"
        /> */}
        <Island className="m-4">
          <div className="flex flex-col">
            <div className="flex justify-between">
              <div className="text-Bold16">{t("OnlineConsultations")}</div>
              <InfoIcon width={16} height={16} />
            </div>
            {isDutyDoctorActive ? (
              <div className="mt-2 flex items-center gap-1 text-Regular14 text-positiveStatus">
                <div className="h-2 w-2 rounded-full bg-positiveStatus" />
                Вы на линии
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-1 text-Regular14 text-secondaryText">
                <div className="h-2 w-2 rounded-full bg-secondaryText" />
                {t("YouAreOfflineNotOnDuty")}
              </div>
            )}
          </div>
          <div className="mb-2 mt-4">
            <DutyDoctorSwitch
              isInitiallyActive={!!myProfile?.isOnDuty}
              consultationsCount={340}
              money={345000}
              onSwitch={(active) => {
                if (active) {
                  setOnDutyDoctorDialogOpen(true);
                }
                setIsDutyDoctorActive(active);
                myProfile &&
                  updateDutyDoctorStatus({
                    id: myProfile.id,
                    isOnDuty: active,
                  });
              }}
            />
            {/* <div className="mt-2 text-Regular12 text-secondaryText">
              {t("ThereWillBeRequestsForOnlineConsultationsFromPatients")}
            </div> */}
          </div>
        </Island>
        {isProfileProgressShown && (
          <Island className="mx-4 mt-3" onClick={() => setAddProfileInfo(true)}>
            <div className="flex w-full flex-col items-center">
              <div className="mb-2 flex w-full items-center justify-between">
                <div className="flex w-full items-center text-left text-Bold16">
                  {t("YourProfileIsSixtyFivePercentageComplete")}
                </div>
                <Button
                  variant="tertiary"
                  className="!h-fit !p-0"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsProfileProgressShown(false);
                  }}
                >
                  <CloseIcon />
                </Button>
              </div>
              <ProgressBar percent={65} className="mb-2" />
              <div className="text-left text-Regular12 text-secondaryText">
                {t(
                  "FullyCompletedProfileIsMoreCredibleAndStandsOutBetterInSearchResults"
                )}
              </div>
            </div>
          </Island>
        )}
        {/* <button
          onClick={() => setStartEarningDialogOpen(true)}
          className="mx-4 mt-3 flex cursor-pointer items-center justify-between rounded-xl border-none bg-gradient-to-r from-[#DBEBCE] to-[#DEF2E0] p-5"
        >
          <div className="w-1/2 text-left text-Bold16">
            {tMob("HowToStartMakingMoneyWithOneClinic")}
          </div>
          <img src="/heartPulse.png" alt="heartPulse" />
        </button> */}
        <Island className="mx-4 mt-3">
          <div className="flex items-center justify-between">
            <div className="text-Regular16 text-secondaryText">
              Сегодня, 23 консультации
            </div>
            <ThreeDotsHorizontalIcon className="cursor-pointer" />
          </div>
          <div className="my-2">
            <span className="text-Bold24">
              ₸{formatMoney(doctorIncomeData ?? 0)}
            </span>
            <div className="ml-3 inline-flex items-center text-Medium14 text-success">
              3.24%
              <ArrowUpIcon className="ml-1" size="sm" color={colors.success} />
            </div>
          </div>
          <Link href="/myDoctor/statistics">
            <Suspense>
              <MainDoctorChart />
            </Suspense>
          </Link>
          <Chips
            onChange={(value) => setChartFilters(value as string)}
            chipLabels={["Все клиники", "Emirmed", "Dostarmed"]}
            type="single"
            isCarousel={false}
            className="mb-0"
          />
        </Island>
        {/* {bookingSlots && bookingSlots?.length > 0 && (
          <div className="my-2 !p-0 !pt-4">
            <p className="mb-0 ml-4 text-Bold16">{t("NextAppointment")}</p>
            <Carousel
              customSlides
              items={
                bookingSlots?.map((consultation) => (
                  <SplideSlide
                    key={consultation?.id}
                    className="mb-4 ml-3 mt-3 !w-[327px]"
                  >
                    <Island
                      isCard
                      className="!px-4"
                      onClick={() =>
                        router.push({
                          pathname: `/myDoctor/booking/${consultation?.id}`,
                        })
                      }
                    >
                      <div className="flex items-center justify-start text-Regular12">
                        <div className="mr-2 flex items-center rounded-3xl bg-lightWarning px-2 py-1">
                          <Heartbeat color="brand-icon" size="sm" />
                          <div className="ml-1.5">
                            {t("Appointment")}{" "}
                            {parseConsultationType(
                              consultation?.consultationType
                            )}
                          </div>
                        </div>
                        <div className="mr-2 flex items-center rounded-3xl bg-lightWarning px-2 py-1">
                          <div className="text-red">⏰ Через 10 минут</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center justify-start">
                          <Avatar isSquare={true} size="avatar" />
                          <div className="ml-3 flex flex-col">
                            <div className="mb-1 text-Regular16">
                              {consultation?.reservedFullname}
                            </div>
                            <div className="text-Regular12 text-secondaryText">
                              Пациент
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-Regular16">
                            {dayjs(consultation?.fromTime).format(timeFormat)}
                          </div>
                          <div className="text-Regular12 text-secondaryText">
                            {dayjs(consultation?.fromTime).format(dateFormat)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between py-2">
                        <div className="flex items-center justify-start">
                          <Avatar size="avatar" />
                          <div className="ml-3 flex flex-col">
                            <div className="mb-1 text-Regular16">Helmir</div>
                            <div className="text-Regular12 text-secondaryText">
                              ул. Жамакаева 254/1
                            </div>
                          </div>
                        </div>
                      </div>
                    </Island>
                  </SplideSlide>
                )) ?? []
              }
            />
          </div>
        )} */}
        {UpcomingDoctorsSlides.length > 0 && (
          <Island className="mb-2 ml-1 !rounded-r-none !bg-gray-0 !p-0 !pt-6">
            <p className="mb-0 ml-4 text-Bold20">{t("NextAppointment")}</p>
            <Carousel customSlides items={UpcomingDoctorsSlides} />
          </Island>
        )}
        <Island
          className="m-4"
          onClick={() => router.push("/myDoctor/appointments")}
        >
          <div className="mb-4 flex justify-between">
            <div>
              <p className="mb-2 text-Bold16">{t("AppointmentsForToday")}</p>
              <p className="mb-0 w-3/4 text-Regular12 text-secondaryText">
                {tMob("OnlineConsultationsFaceToFaceAppointmentsHomeCalls")}
              </p>
            </div>
            <div className="flex items-start">
              <div className="text-Bold16">{bookingsState?.all}</div>
              <RightOutlined className="ml-4 mt-1" />
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between py-1">
              <p className="mb-0 text-Regular12">{t("Planned")}</p>
              <p className="mb-0 text-Medium14">{bookingsState?.paid}</p>
            </div>
            <div className="flex justify-between py-1">
              <p className="mb-0 text-Regular12">{t("Done")}</p>
              <p className="mb-0 text-Medium14">{bookingsState?.done}</p>
            </div>
            <div className="flex justify-between py-1">
              <p className="mb-0 text-Regular12">{t("Rescheduled")}</p>
              <p className="mb-0 text-Medium14">{bookingsState?.moved}</p>
            </div>
            <div className="flex justify-between py-1">
              <p className="mb-0 text-Regular12">{t("Canceled")}</p>
              <p className="mb-0 text-Medium14">{bookingsState?.canceled}</p>
            </div>
          </div>
        </Island>
      </main>
      <OnDutyDoctorDialog
        open={onDutyDoctorDialogOpen}
        setIsOpen={setOnDutyDoctorDialogOpen}
      />
      <StartEarningWithOneclinicDialog
        open={startEarningDialogOpen}
        setIsOpen={setStartEarningDialogOpen}
      />
      <AddProfileInfoDialog
        open={addProfileInfo}
        setIsOpen={setAddProfileInfo}
      />
    </>
  );
}

export default HomeDoctor;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
}
