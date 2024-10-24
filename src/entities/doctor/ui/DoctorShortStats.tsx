import type { FC } from "react";

import { useTranslations } from "next-intl";

import {
  ArrowGrowthIcon,
  MessageLeftTextIcon,
  PeopleAltIcon,
  StarColoredIcon,
} from "@/shared/components";

import type { DoctorShortStatsProps } from "../model/DoctorShortStats";

export const DoctorShortStats: FC<DoctorShortStatsProps> = ({
  patientCount = 0,
  workExperience = 0,
  rating = 0,
  reviewCount = 0,
  hidePatientCount = false,
  hideWorkExperience = false,
  hideRating = false,
  hideReviewCount = false,
}: DoctorShortStatsProps) => {
  const t = useTranslations("Common");
  return (
    <div className="my-4 flex justify-around text-center">
      {!hidePatientCount && (
        <div className="flex flex-col items-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-3xl bg-brand-ultraLight">
            <PeopleAltIcon color="brand-primary" />
          </div>
          <p className="mb-0 text-Bold16">{patientCount}</p>
          <p className="mb-0 text-Regular12">Пациентов</p>
        </div>
      )}
      {!hideWorkExperience && (
        <div className="flex flex-col items-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-3xl bg-brand-ultraLight">
            <ArrowGrowthIcon color="brand-primary" />
          </div>
          <p className="mb-0 text-Bold16">{workExperience} лет</p>
          <p className="mb-0 text-Regular12">{t("Experience")}</p>
        </div>
      )}
      {!hideRating && (
        <div className="flex flex-col items-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-3xl bg-brand-ultraLight">
            <StarColoredIcon color="brand-primary" />
          </div>
          <p className="mb-0 text-Bold16">{rating}</p>
          <p className="mb-0 text-Regular12">{t("Rating")}</p>
        </div>
      )}
      {!hideReviewCount && (
        <div className="flex flex-col items-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-3xl bg-brand-ultraLight">
            <MessageLeftTextIcon color="brand-primary" />
          </div>
          <p className="mb-0 text-Bold16">{reviewCount}</p>
          <p className="mb-0 text-Regular12">{t("Reviews")}</p>
        </div>
      )}
    </div>
  );
};
