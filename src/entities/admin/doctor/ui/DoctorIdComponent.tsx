import type { FC } from "react";
import { useState, useRef, useMemo } from "react";
import { useQuery } from "react-query";

import type { SegmentedValue } from "antd/es/segmented";
import { useTranslations } from "next-intl";

import {
  ClinicMessages,
  ClinicPatients,
  ClinicReviews,
} from "@/entities/admin";
import { superAdminApis } from "@/shared/api";
import { ClinicDoctorStatus } from "@/shared/api/dtos";
import {
  FormTopbar,
  SegmentedControlDesktop,
  Button,
  LeftSegmentedIcon,
  Avatar,
  UserIcon,
  StatusTag,
} from "@/shared/components";
import { colors } from "@/shared/config";

import {
  AppointmentDoctor,
  DoctorFinances,
  DoctorProfile,
  Statistics,
} from "./index";

const SegmentedOption = {
  colorText: colors?.brand?.darkGreen,
  boxShadowTertiary: `0px 4px 0px -2px ${colors?.brand?.darkGreen}`,
  borderRadiusOuter: 0,
  borderRadius: 0,
  borderRadiusLG: 0,
  borderRadiusSM: 0,
  borderRadiusXS: 0,
  colorBgElevated: colors?.gray,
};

type DoctorTabs =
  | "statistics"
  | "serviceStory"
  | "profile"
  | "patients"
  | "messages"
  | "finances"
  | "reviews";

interface DoctorIdComponentProps {
  id: string;
}

export const DoctorIdComponent: FC<DoctorIdComponentProps> = ({ id }) => {
  const [activeTab, setActiveTab] =
    useState<DoctorTabs | SegmentedValue>("profile");

  const segmentedRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Admin");

  const scrollLeft = () => {
    if (segmentedRef.current) {
      segmentedRef.current.scrollLeft -= 100;
    }
  };

  const scrollRight = () => {
    if (segmentedRef.current) {
      segmentedRef.current.scrollLeft += 100;
    }
  };

  const {
    isLoading,
    isError,
    isSuccess,
    data: doctorData,
    refetch,
  } = useQuery(["getDoctorById", id], () =>
    superAdminApis.getDoctorProfileInfoById(id).then((res) => res.data)
  );

  const doctorStatus: ClinicDoctorStatus = useMemo(
    () => doctorData?.status as ClinicDoctorStatus,
    [doctorData]
  );

  return (
    <div className="flex h-auto w-full justify-center">
      <div className="mt-14 flex w-[508px] flex-col items-center gap-6">
        <FormTopbar
          title={t("Doctor")}
          id={doctorData?.id ?? ""}
          status={doctorStatus}
          isClinic={false}
          refetch={refetch}
        />
        <Avatar
          size="clinicAva"
          src={doctorData?.photoUrl}
          icon={<UserIcon size="lg" />}
        />
        <div className="flex flex-col items-center gap-3">
          <p className="m-0 text-center text-Bold32">
            {doctorData?.lastName} {doctorData?.firstName}{" "}
            {doctorData?.fatherName}
          </p>
          <p className="m-0 text-Regular16 text-gray-4">{t("Doctor")}</p>
          {doctorStatus && <StatusTag status={doctorStatus} />}
        </div>
        {doctorStatus !== ClinicDoctorStatus.NEW_DISABLED && (
          <div className="flex w-full justify-between gap-5">
            <Button className="!h-10 w-full !rounded-md !text-Regular16">
              {t("ChangePassword")}
            </Button>
            <Button
              className="!h-10 w-full !rounded-md !bg-white !text-Regular16"
              variant="outline"
            >
              {tDesktop("ResetRating")}
            </Button>
          </div>
        )}
        <div className="relative w-full">
          <div
            className="absolute left-[-40px] top-1/2 z-[9999] -translate-y-1/2 cursor-pointer"
            onClick={scrollLeft}
          >
            <LeftSegmentedIcon />
          </div>
          <div
            className="absolute right-[-40px] top-1/2 z-[9999] -translate-y-1/2 cursor-pointer"
            onClick={scrollRight}
          >
            <LeftSegmentedIcon rotate={180} />
          </div>
          <div
            ref={segmentedRef}
            className="scrollbar-hide relative w-full overflow-x-auto"
          >
            <SegmentedControlDesktop
              options={[
                { label: t("Profile"), value: "profile" },
                { label: t("ServiceHistory"), value: "serviceStory" },
                { label: t("Statistics"), value: "statistics" },
                { label: t("Patients"), value: "patients" },
                { label: t("Messages"), value: "messages" },
                { label: tDesktop("Finances"), value: "finances" },
                { label: t("Reviews"), value: "reviews" },
              ]}
              size="large"
              className="!bg-gray-0"
              value={activeTab}
              onChange={(value) => setActiveTab(value)}
              activeStyle={SegmentedOption}
            />
          </div>
        </div>
        {isSuccess && (
          <>
            {activeTab === "statistics" && (
              <Statistics
                rating={doctorData.rating ?? 0}
                reviewCount={doctorData.reviewCount ?? 0}
              />
            )}
            {activeTab === "serviceStory" && <AppointmentDoctor id={id} />}
            {activeTab === "profile" && <DoctorProfile data={doctorData} />}
            {activeTab === "patients" && (
              <ClinicPatients status={doctorStatus} />
            )}
            {activeTab === "messages" && doctorData && (
              <ClinicMessages
                id={String(doctorData.userId)}
                status={doctorStatus}
              />
            )}
            {activeTab === "finances" && <DoctorFinances id={id} />}
            {activeTab === "reviews" && (
              <ClinicReviews clinicId="0" clinicOverallRate={3} />
            )}
          </>
        )}
        {isLoading && <p>Loading...</p>}
        {isError && <p>{tDesktop("ErrorOccurredWhileReceivingData")}</p>}
      </div>
    </div>
  );
};
