import { ReactElement, useState } from "react";

import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import type { MyProfileReviewModel } from "@/entities/myProfile";
import { MyProfileReview } from "@/entities/myProfile";
import {
  ArrowLeftIcon,
  Navbar,
  SpinnerWithBackdrop,
} from "@/shared/components";
import { MainLayout } from "@/shared/layout";
import { useQuery } from "react-query";
import { patientReviewsApi } from "@/shared/api/patient/reviews";

export default function Reviews() {
  const t = useTranslations("Common");
  const router = useRouter();

  const { data: clinicReviews, refetch: clinicReviewsRefetch } = useQuery(
    ["getClinicReviews"],
    () =>
      patientReviewsApi.getClinicReviews({
        page: 1,
        size: 999,
        sort: "created,desc",
      })
  );

  const { data: doctorReviews, refetch: doctorReviewsRefetch } = useQuery(
    ["getDoctorReviews"],
    () =>
      patientReviewsApi.getDoctorReviews({
        page: 1,
        size: 999,
        sort: "created,desc",
      })
  );

  if (!clinicReviews?.data?.content && !doctorReviews?.data?.content) {
    return <SpinnerWithBackdrop />;
  }

  const reviews = [
    ...clinicReviews?.data?.content,
    ...doctorReviews?.data?.content,
  ];

  return (
    <div className="bg-white">
      <Navbar
        title={t("MyReviews")}
        leftButtonOnClick={() => router?.back()}
        buttonIcon={<ArrowLeftIcon />}
        className="mb-4 pt-4"
      />
      <div className="px-4">
        {reviews.map((review) => (
          <MyProfileReview
            {...review}
            key={review?.id}
            refetchClinicReviews={clinicReviewsRefetch}
            refetchDoctorReviews={doctorReviewsRefetch}
          />
        ))}
      </div>
    </div>
  );
}

Reviews.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout hideToolbar>
      <div className="bg-white h-full">{page}</div>
    </MainLayout>
  );
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
