import type { FC } from "react";

import { useTranslations } from "next-intl";

import { StarIcon } from "@/shared/components";

import type { ReviewBarProps } from "./props";

export const ReviewBar: FC<ReviewBarProps> = ({ rate, rateNumber }) => {
  const t = useTranslations("Common");
  return (
    <div className="flex w-full flex-col gap-1 rounded-xl bg-white p-3">
      <p className="m-0 p-0 text-Bold20">{t("Reviews")}</p>
      <span className="flex items-center gap-2">
        <p className="m-0 p-0 text-Bold14">
          <StarIcon width={14} height={14} /> {rate}
        </p>
        <p className="m-0 p-0 text-Regular14 text-gray-secondary">
          {t("AmountOffReviews", { amount: rateNumber ?? 0 })}
        </p>
      </span>
    </div>
  );
};
