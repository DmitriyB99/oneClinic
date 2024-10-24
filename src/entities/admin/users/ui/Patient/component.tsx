import type { FC } from "react";
import { useState } from "react";
import { useQuery } from "react-query";

import { Spin } from "antd";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import {
  FinancesPatient,
  Appointment,
  MedCard,
  Data,
  Reviews,
} from "@/entities/admin";
import { superAdminApis } from "@/shared/api";
import {
  Avatar,
  FormTopbar,
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

export const ProfileIdComponent: FC = () => {
  const { query } = useRouter();
  const [activeTab, setActiveTab] = useState<number | string>("medcard");
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Admin");
  const {
    data: userProfileData,
    isSuccess,
    isLoading,
    isError,
  } = useQuery(["userProfileData", query.userProfileId], () =>
    superAdminApis
      .getPatientProfile(String(query.userProfileId))
      .then((res) => res.data)
  );

  return (
    <div className="flex w-full justify-center">
      {isSuccess && (
        <div className="mt-14 flex w-[508px] flex-col items-start gap-6">
          <FormTopbar
            title={tDesktop("AboutPatient")}
            id={String(query.userProfileId)}
          />
          <Avatar
            size="clinicAva"
            text={`${userProfileData.surname[0]}.${userProfileData.name[0]}.`}
            src={userProfileData.photoUrl}
          />
          <div className="flex flex-col gap-3">
            <p className="m-0 text-Bold32">
              {userProfileData?.surname} {userProfileData?.name}{" "}
              {userProfileData?.patronymic}
            </p>
            <p className="m-0 text-Regular16 text-gray-4">{t("Patient")}</p>
          </div>
          <SegmentedControlDesktop
            options={[
              { label: t("MedCard"), value: "medcard" },
              { label: t("ServiceHistory"), value: "serviceStory" },
              { label: t("Data"), value: "data" },
              { label: tDesktop("Finances"), value: "finances" },
              { label: t("Reviews"), value: "review" },
            ]}
            size="large"
            className="!bg-gray-0"
            value={activeTab}
            onChange={(value) => setActiveTab(value)}
            activeStyle={SegmentedOption}
          />
          {activeTab === "medcard" && <MedCard />}
          {activeTab === "serviceStory" && <Appointment />}
          {activeTab === "data" && <Data />}
          {activeTab === "finances" && (
            <FinancesPatient
              userId={userProfileData?.userId}
              userProfileId={userProfileData.userProfileId}
            />
          )}
          {activeTab === "review" && <Reviews />}
        </div>
      )}
      {isLoading && (
        <div className="flex h-fit w-full items-center justify-center">
          <Spin size="large" />
        </div>
      )}
      {isError && <p>Server Error</p>}
    </div>
  );
};
