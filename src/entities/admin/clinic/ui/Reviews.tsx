import type { FC } from "react";
import { useQuery } from "react-query";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { ReviewResponse } from "@/shared/api";
import { superAdminApis } from "@/shared/api";
import { Review, ReviewBar } from "@/shared/components";
import { dateFormat } from "@/shared/config";

import type { ClinicReviewProps } from "../model";

export const ClinicReviews: FC<ClinicReviewProps> = ({
  clinicId,
  clinicOverallRate,
  status,
}) => {
  const tDesktop = useTranslations("Desktop.Admin");
  const {
    data: clinicReviewData,
    isSuccess,
    isLoading,
    isError,
  } = useQuery(["clinicReviewDataAll"], () =>
    superAdminApis.getClinicReviews(0, 100, clinicId).then((res) => res.data)
  );

  return (
    <div className="flex w-full flex-col gap-5">
      {status === "ACTIVE" ? (
        <>
          <ReviewBar
            rate={clinicOverallRate}
            rateNumber={clinicReviewData?.totalElements}
          />
          {isSuccess &&
            clinicReviewData?.content.map((data: ReviewResponse) => (
              <Review
                key={data.id}
                name={data.reviewerName}
                rate={data.rating}
                date={dayjs(data.created).format(dateFormat)}
                message={data.text}
              />
            ))}
          {isError && (
            <p className="self-start text-gray-4">{tDesktop("ServerError")}</p>
          )}
          {isLoading && <p>Loading ...</p>}
        </>
      ) : (
        <p className="self-start text-gray-4">
          {tDesktop("NoDataAcceptApplicationRegistration")}
        </p>
      )}
    </div>
  );
};
