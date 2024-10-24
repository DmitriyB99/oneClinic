import type { FC } from "react";
import { useMemo } from "react";

import clsx from "clsx";

import {
  ArrowDownFromLineIcon,
  ArrowUpFromLineIcon,
  DividerSaunet,
  LineIcon,
} from "@/shared/components";

import type { AnalysisResultEntryProps } from "./props";

export const AnalysisResultEntry: FC<AnalysisResultEntryProps> = ({
  analysisName,
  isDivided = false,
  indicators,
  type,
  rejection,
}) => {
  const analysisRejection = useMemo(() => {
    let iconType = "text-positiveStatus";
    switch (type) {
      case "warning":
        iconType = "text-warningStatus";
        break;
      case "negative":
        iconType = "text-negativeStatus";
    }
    switch (rejection) {
      case "above":
        return <ArrowUpFromLineIcon className={iconType} />;
      case "below":
        return <ArrowDownFromLineIcon className={iconType} />;
      default:
        return <LineIcon className={iconType} />;
    }
  }, [rejection, type]);
  return (
    <>
      <div className="mt-6 flex justify-start">
        <div
          className={clsx(
            "flex h-10 w-10 items-center justify-center rounded-xl bg-gray-1",
            {
              "bg-lightWarning": type === "warning",
              "bg-lightNegative": type === "negative",
              "bg-lightPositive": type === "positive",
            }
          )}
        >
          {analysisRejection}
        </div>
        <div className="ml-3 flex flex-col justify-start">
          <div className="mb-1 text-Regular16 text-dark">{analysisName}</div>
          <div className="mb-1 text-Regular12 text-secondaryText">
            {indicators}
          </div>
        </div>
      </div>
      {isDivided && <DividerSaunet className="my-3" />}
    </>
  );
};
