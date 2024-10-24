import type { FC } from "react";
import { useMemo } from "react";
import { useQuery } from "react-query";

import { useRouter } from "next/router";

import { patientClinicsApi } from "@/shared/api/patientContent/clinics";
import {
  DividerSaunet,
  Island,
  RatingCard,
  StarIcon,
} from "@/shared/components";
import { ModalRatingClinics } from "@/widgets/clinics/Rating/Modal";
import { ModalAddRating } from "@/widgets/clinics/Rating/ModalAddRating";
import { patientDoctorsApi } from "@/shared/api/patientContent/doctors";

export const RatingClinicComponent: FC<{
  ratingNumber: number;
  canAddReview?: boolean;
  isDoctor?: boolean;
}> = ({ ratingNumber = 0, canAddReview = true, isDoctor = false }) => {
  const router = useRouter();

  const reviewingId = useMemo(
    () =>
      (router.query.clinicId as string) ?? (router.query.id as string),
    [router.query.clinicId, router.query.id]
  );

  const { data: reviews, refetch } = useQuery(
    isDoctor ? ["getDoctorsReviews", reviewingId] : ["getClinicsReviews", reviewingId],
    () =>
      isDoctor
        ? patientDoctorsApi
            .getDoctorsReview(reviewingId)
            .then((res) => res.data)
        : patientClinicsApi
            .getClinicsReview(reviewingId)
            .then((res) => res.data),
    {
      enabled: !!reviewingId,
    }
  );

  return (
    <Island className="mt-2">
      <div className="mb-1 flex items-center justify-between">
        <p className="mb-0 text-Bold20">Отзывы</p>
        {reviews?.total_count && reviews?.total_count > 2 ? (
          <ModalRatingClinics content={reviews} />
        ) : (
          <div />
        )}
      </div>
      {reviews?.total_count && reviews?.total_count > 0 ? (
        <div className="mb-3 flex items-center">
          <StarIcon size="xs" />
          <p className="mb-0 ml-1 text-Semibold12">
            {ratingNumber ? ratingNumber.toFixed(1) : ""}
          </p>
          <p className="mb-0 ml-2 text-Regular12 text-secondaryText">
            {reviews?.total_count} отзыва
          </p>
        </div>
      ) : (
        <div />
      )}
      {reviews?.total_count && reviews?.total_count > 0 ? (
        reviews?.reviews.map((rating) => (
          <div key={rating.id}>
            <RatingCard
              icon_url={rating.patient_photo_url}
              className="mb-4"
              name={rating.patient_full_name}
              rating={rating.rating}
              date={rating.created}
            />
            <p className="text-Regular14">{rating.comment}</p>
            <DividerSaunet className="m-0 mb-3" />
          </div>
        ))
      ) : (
        <div className="px-0.5 py-3">Отзывов еще нет</div>
      )}
      <ModalAddRating
        reviewingId={reviewingId}
        refetchReviews={refetch}
        canAddReview={canAddReview}
      />
    </Island>
  );
};
