import type { FC } from "react";
import { useState, useMemo, useContext } from "react";
import { useMutation, useQuery } from "react-query";

import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import type { DoctorProfile } from "@/entities/clinics";
import { DesktopMainCard, DesktopMainSubCard } from "@/entities/desktopMain";
import { DutyDoctorSwitch } from "@/features/mainDoctor";
import { bookingInfoApi } from "@/shared/api/bookingInfo";
import { clinicsApi } from "@/shared/api/clinics";
import { doctorsApi } from "@/shared/api/doctors";
import {
  Button,
  CloseIcon,
  Island,
  ProgressBar,
  SegmentedControlDesktop,
  StarIcon,
} from "@/shared/components";
import { dateTimeWithOffset } from "@/shared/config";
import { UserContext } from "@/shared/contexts/userContext";
import { convertToTimeZonedString } from "@/shared/utils";

const IncomeTimeRange = {
  today: dayjs().format(dateTimeWithOffset),
  week: dayjs().add(7, "day").format(dateTimeWithOffset),
  period: dayjs().add(1, "month").format(dateTimeWithOffset),
};

enum TimeRange {
  period = "period",
  today = "today",
  week = "week",
}

export const DesktopMainPage: FC = () => {
  const [activeTab, setActiveTab] = useState<TimeRange>(TimeRange.today);
  const router = useRouter();
  const { user } = useContext(UserContext);
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.DesktopMain");
  const [isProfileProgressShown, setIsProfileProgressShown] = useState(true);
  const [isDutyDoctorActive, setIsDutyDoctorActive] = useState(false);

  const { data: myProfile } = useQuery(
    ["getMyProfileInfo"],
    () =>
      doctorsApi
        .getDoctorProfileInfoById(user?.role_id ?? "")
        .then((res) => res.data),
    {
      enabled: user?.role === "doctor",
    }
  );

  const { mutate: updateDutyDoctorStatus } = useMutation(
    ["updateDutyDoctorStatus"],
    (updatedDutyDoctorStatus: DoctorProfile) =>
      doctorsApi.updateDutyDoctorStatus(updatedDutyDoctorStatus)
  );

  const { data: clinicProfile } = useQuery(
    ["getClinicProfileInfo"],
    () => clinicsApi.getClinicMe().then((res) => res.data),
    {
      enabled: user?.role === "clinic",
    }
  );

  const { data: ClinicBookingSlots } = useQuery(
    ["getClinicBookingSlots"],
    () =>
      bookingInfoApi
        .getClinicSlots(
          convertToTimeZonedString(dayjs().toDate()),
          convertToTimeZonedString(dayjs().add(6, "hour").toDate())
        )
        .then((res) => res.data),
    {
      enabled: user?.role === "clinic",
    }
  );

  const { data: DoctorBookingSlots } = useQuery(
    ["getDoctorBookingSlots"],
    () =>
      bookingInfoApi
        .getDoctorSlots(
          convertToTimeZonedString(dayjs().toDate()),
          convertToTimeZonedString(dayjs().add(6, "hour").toDate())
        )
        .then((res) => res.data),
    {
      enabled: user?.role === "doctor",
    }
  );

  const { data: clinicMainData } = useQuery(
    ["getClinicMainData"],
    () => clinicsApi.getClinicMain(user?.role_id ?? "").then((res) => res.data),
    {
      enabled: user?.role === "clinic",
    }
  );

  const { data: doctorIncomeData } = useQuery(
    ["getDoctorIncome", activeTab],
    () =>
      doctorsApi
        .getDoctorIncome(IncomeTimeRange["today"], IncomeTimeRange[activeTab])
        .then((res) => res.data.earningsSum),
    {
      enabled: user?.role === "doctor",
    }
  );

  const { data: doctorMainData } = useQuery(
    ["getDoctorMainData", myProfile],
    () => doctorsApi.getDoctorMain(myProfile?.id ?? "").then((res) => res.data),
    {
      enabled: !!myProfile?.id,
    }
  );

  const bookingSlots = useMemo(() => {
    const data =
      user?.role === "doctor"
        ? DoctorBookingSlots?.content
        : ClinicBookingSlots?.content;
    return (data ?? [])
      .slice(0, 3)
      .filter((consultation) => consultation.bookingType === "CONSULTATION")
      .map((consultation) => ({
        onClick: () =>
          router.push({ pathname: `/desktop/bookings/${consultation?.id}` }),
        notifications: consultation.consultationType,
        time: consultation.fromTime,
        name: consultation?.patientFullName,
        id: consultation.id,
      }));
  }, [router, ClinicBookingSlots, DoctorBookingSlots, user]);

  const [name, rating, bookingsState, patientCount] = useMemo(() => {
    const profile = user?.role === "doctor" ? myProfile : clinicProfile;
    const mainData = user?.role === "doctor" ? doctorMainData : clinicMainData;
    const profileName =
      user?.role === "doctor" ? myProfile?.firstName : clinicProfile?.name;
    return [
      profileName,
      profile?.rating,
      mainData?.bookingState,
      mainData?.myPatientCount,
    ];
  }, [clinicMainData, user, myProfile, clinicProfile, doctorMainData]);

  return (
    <div className="relative flex w-full flex-col items-center px-7 py-4">
      <p className="absolute left-7 m-0 p-0 text-Medium14">{t("Main")}</p>
      <div className="mt-12 flex w-[922px] flex-col gap-6 px-5">
        <div className="flex flex-row items-center justify-between">
          <p className="m-0 text-Bold32">{tDesktop("HelloClinic", { name })}</p>
          <SegmentedControlDesktop
            options={[
              { label: t("Today"), value: "today" },
              { label: t("Week"), value: "week" },
              { label: t("Period"), value: "period" },
            ]}
            value={activeTab}
            onChange={(value) => setActiveTab(value as TimeRange)}
            activeStyle={{ controlHeight: 36 }}
            className="h-9 !bg-gray-6"
          />
        </div>
        {user?.role === "doctor" && (
          <div className="flex w-full justify-between gap-6">
            <Island className="h-40 w-1/2">
              {!isDutyDoctorActive && (
                <div className="flex flex-col">
                  <div className="text-Bold16">{t("OnlineConsultations")}</div>
                  <div className="mt-2 flex items-center gap-1 text-Regular14 text-secondaryText">
                    <div className="h-2 w-2 rounded-full bg-secondaryText" />
                    {t("YouAreOfflineNotOnDuty")}
                  </div>
                </div>
              )}
              <div className="mt-3">
                <DutyDoctorSwitch
                  isInitiallyActive={!!myProfile?.isOnDuty}
                  consultationsCount={340}
                  money={345000}
                  onSwitch={(active) => {
                    setIsDutyDoctorActive(active);
                    myProfile &&
                      updateDutyDoctorStatus({
                        id: myProfile.id,
                        isOnDuty: active,
                      });
                  }}
                />
                <div className="mt-2 text-Regular12 text-secondaryText">
                  {t("ThereWillBeRequestsForOnlineConsultationsFromPatients")}
                </div>
              </div>
            </Island>
            {isProfileProgressShown && (
              <Island className="w-1/2">
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
          </div>
        )}
        <div className="mt-3 flex w-full justify-between gap-5">
          <DesktopMainCard
            value={rating}
            icon={<StarIcon />}
            title={tDesktop("MyRating")}
          />
          <DesktopMainCard value={patientCount} title={t("Patients")} />
          <DesktopMainCard
            value={doctorIncomeData}
            title={tDesktop("IncomeOneClinic")}
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <p className="m-0 text-Bold24">{t("NextAppointment")}</p>
          <p
            onClick={() => router.push("/desktop/bookings")}
            className="m-0 cursor-pointer p-0 text-Medium16 text-blue"
          >
            {t("AllEntries")}
          </p>
        </div>
        <div className="flex w-full flex-row gap-5">
          {bookingSlots && bookingSlots.length > 0 ? (
            bookingSlots?.map((props) => (
              <DesktopMainSubCard key={props.id} {...props} />
            ))
          ) : (
            <>
              <p className="m-0 p-0 text-Bold16">{tDesktop("NoBookings")}</p>
            </>
          )}
        </div>
        <div className="flex h-[252px] w-[302px] flex-col gap-4 rounded-[20px] bg-white p-5 shadow-md">
          <span className="flex flex-row items-center justify-between">
            <p className="m-0 p-0 text-Bold16">{tDesktop("TodayBookings")}</p>
            <p className="m-0 p-0 text-Bold20">{bookingsState?.all}</p>
          </span>
          <span className="flex flex-col justify-between">
            <p className="m-0 p-0 text-Regular12 text-secondaryText">
              {t("OnlineConsultations")},
            </p>
            <p className="m-0 p-0 text-Regular12 text-secondaryText">
              {t("ReceptionsAndHouseCalls")}
            </p>
          </span>
          <span className="flex flex-row items-center justify-between text-Regular14">
            <p className="m-0 p-0">{t("Planned")}</p>
            <p className="m-0 p-0">{bookingsState?.created}</p>
          </span>
          <span className="flex flex-row items-center justify-between text-Regular14 text-brand-darkGreen">
            <p className="m-0 p-0">{t("Done")}</p>
            <p className="m-0 p-0">{bookingsState?.done}</p>
          </span>
          <span className="flex flex-row items-center justify-between text-Regular14 text-warningStatus">
            <p className="m-0 p-0">{t("Rescheduled")}</p>
            <p className="m-0 p-0">{bookingsState?.moved}</p>
          </span>
          <span className="flex flex-row items-center justify-between text-Regular14 text-red">
            <p className="m-0 p-0">{t("Canceled")}</p>
            <p className="m-0 p-0">{bookingsState?.canceled}</p>
          </span>
        </div>
      </div>
    </div>
  );
};
