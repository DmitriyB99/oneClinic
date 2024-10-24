import type { FC } from "react";
import { useRef, useState } from "react";
import { useQuery } from "react-query";

import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import {
  AppointmentClinic,
  ClinicFinances,
  ClinicMessages,
  ClinicPatients,
  ClinicProfile,
  ClinicReviews,
  ClinicStaff,
  ClinicStatistics,
} from "@/entities/admin";
import { superAdminApis } from "@/shared/api";
import {
  Avatar,
  Button,
  ClinicIcon,
  FormTopbar,
  LeftSegmentedIcon,
  SegmentedControlDesktop,
} from "@/shared/components";
import { colors } from "@/shared/config";

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

export const ClinicIdComponent: FC = () => {
  const [activeTab, setActiveTab] = useState<number | string>("statistics");
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Admin");

  const { query } = useRouter();

  const {
    isLoading,
    isError,
    isSuccess,
    data: clinicData,
    refetch,
  } = useQuery(["getClinicById", query?.clinicId], () =>
    superAdminApis
      .getClinicById(String(query?.clinicId))
      .then((res) => res.data)
  );

  const segmentedRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex h-auto w-full justify-center">
      <div className="mt-14 flex w-[508px] flex-col items-center gap-6">
        <FormTopbar
          title={t("Clinic")}
          status={clinicData?.status}
          id={String(clinicData?.id)}
          isClinic
          refetch={refetch}
        />
        <Avatar
          size="clinicAva"
          src={clinicData?.iconUrl}
          icon={<ClinicIcon size="lg" />}
        />
        <div className="flex flex-col items-center gap-3">
          <p className="m-0 text-Bold32">{clinicData?.name}</p>
          <p className="m-0 text-Regular16 text-gray-4">{t("Clinic")}</p>
        </div>
        <div className="flex w-full justify-between gap-5">
          <Button className="!h-10 w-full !rounded-md !text-Regular16">
            {t("ChangePassword")}
          </Button>
          <Button
            disabled
            className="!h-10 w-full !rounded-md !bg-white !text-Regular16"
            variant="outline"
          >
            {tDesktop("ResetRating")}
          </Button>
        </div>
        <div className="relative w-full">
          <div
            className="absolute -left-10 top-1/2 z-[10] -translate-y-1/2 cursor-pointer"
            onClick={scrollLeft}
          >
            <LeftSegmentedIcon />
          </div>
          <div
            className="absolute -right-10 top-1/2 z-[10] -translate-y-1/2 cursor-pointer"
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
                { label: t("Statistics"), value: "statistics" },
                { label: t("Profile"), value: "profile" },
                { label: t("Staff"), value: "staff" },
                { label: t("Patients"), value: "patients" },
                { label: t("ServiceHistory"), value: "serviceStory" },
                { label: t("Messages"), value: "messages" },
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
            {activeTab === "staff" && (
              <ClinicStaff
                status={clinicData?.status}
                clinicDoctors={clinicData?.clinicDoctors}
              />
            )}
            {activeTab === "profile" && (
              <ClinicProfile clinicData={clinicData} />
            )}
            {activeTab === "statistics" && (
              <ClinicStatistics
                status={clinicData?.status}
                reviews={String(query.clinicId)}
                clinicStatistics={clinicData?.rating}
              />
            )}
            {activeTab === "serviceStory" && (
              <AppointmentClinic
                status={clinicData?.status}
                clinicId={String(query?.clinicId)}
              />
            )}
            {activeTab === "patients" && (
              <ClinicPatients
                clinicProfileId={String(query?.clinicId)}
                status={clinicData?.status}
              />
            )}
            {activeTab === "messages" && (
              <ClinicMessages
                status={clinicData?.status}
                id={String(query?.clinicId)}
              />
            )}
            {activeTab === "finances" && (
              <ClinicFinances status={clinicData?.status} />
            )}
            {activeTab === "reviews" && (
              <ClinicReviews
                status={clinicData?.status}
                clinicOverallRate={clinicData?.rating}
                clinicId={String(query?.clinicId)}
              />
            )}
          </>
        )}
        {isLoading && <p>Loading...</p>}
        {isError && <p>{tDesktop("ErrorOccurredWhileReceivingData")}</p>}
      </div>
    </div>
  );
};
