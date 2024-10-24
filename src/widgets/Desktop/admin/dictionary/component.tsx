import type { FC } from "react";
import { useState } from "react";

import type { SegmentedValue } from "antd/es/segmented";
import { useTranslations } from "next-intl";

import { HomeHeartIcon, SegmentedControlDesktop } from "@/shared/components";
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

export const AdminDictionaryComponent: FC = () => {
  const t = useTranslations("Common");
  const [activeTab, setActiveTab] =
    useState<string | SegmentedValue>("allergies");
  return (
    <div className="w-full px-6">
      <div className="my-4 flex w-full items-center text-Regular12 text-secondaryText">
        <HomeHeartIcon size="sm" color="gray-icon" />
        <span className="m-1">{t("Main")}</span> /{" "}
        <span className="m-1">{t("Patients")}</span>
      </div>
      <div className="my-10 flex flex-row items-center justify-between">
        <p className="m-0 text-Bold32">{t("Guide")}</p>
      </div>
      <SegmentedControlDesktop
        options={[
          { label: t("Services"), value: "services" },
          { label: t("Cities"), value: "cities" },
          { label: t("Roles"), value: "roles" },
          { label: t("Allergy"), value: "allergies" },
          { label: t("Specialization"), value: "speciality" },
        ]}
        size="large"
        className="!bg-gray-0"
        value={activeTab}
        onChange={(value) => setActiveTab(value)}
        activeStyle={SegmentedOption}
      />
      {}
      {activeTab === "allergies" && <></>}
      {activeTab === "supplymentIntolerance" && <></>}
      {activeTab === "vaccines" && <></>}
      {activeTab === "infections" && <></>}
    </div>
  );
};
