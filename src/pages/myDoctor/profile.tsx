import type { FC } from "react";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";

import type { GetServerSidePropsContext } from "next";

import { doctorsApi } from "@/shared/api";
import { clinicsApi } from "@/shared/api/clinics";
import { Island, SegmentedControl } from "@/shared/components";
import {
  ConsultationsSegment,
  AboutSegment,
} from "@/widgets/clinics/DoctorsPage";
import { RatingClinicComponent } from "@/widgets/clinics/Rating";
import {
  FilledProfile,
  UnfilledProfile,
} from "@/widgets/doctorProfile/DoctorProfile";

const MyDoctorProfile: FC = () => {
  const [segment, setSegment] = useState<string>("about");
  const { data: myProfile } = useQuery(["getMyProfile"], () =>
    doctorsApi.getMyDoctorProfile().then((res) => res.data)
  );
  const { data: clinicData } = useQuery(
    ["getClinicById", myProfile?.clinics?.[0]?.clinicId],
    () =>
      clinicsApi
        .getClinicById(myProfile?.clinics?.[0]?.clinicId ?? "")
        .then((res) => res.data)
  );

  const hasFilledProfile = useMemo(
    () => myProfile?.id && myProfile?.firstName,
    [myProfile?.firstName, myProfile?.id]
  );

  const clinicInfo = useMemo(
    () => ({
      title: clinicData?.name ?? "",
      address: `ул. ${clinicData?.street ?? ""} ${
        clinicData?.buildNumber ?? ""
      }`,
      locationPoint: clinicData?.locationPoint,
    }),
    [
      clinicData?.buildNumber,
      clinicData?.locationPoint,
      clinicData?.name,
      clinicData?.street,
    ]
  );

  return (
    <>
      <Island className="!p-0">
        {/* {hasFilledProfile && <FilledProfile {...myProfile} />} */}
        {!hasFilledProfile && <UnfilledProfile />}
        <div className="mx-4 my-5">
          <SegmentedControl
            options={[
              // { label: "Видео", value: "videos" },
              { label: "О себе", value: "about" },
              { label: "Услуги", value: "services" },
              { label: "Отзывы", value: "feedback" },
            ]}
            value={segment}
            onChange={(val) => setSegment(val as string)}
          />
        </div>
      </Island>
      {/* {segment === "videos" && <VideosSegment />} */}
      {segment === "about" && (
        <AboutSegment
          studyDegrees={myProfile?.studyDegrees}
          clinicInfo={clinicInfo}
        />
      )}
      {segment === "services" && (
        <ConsultationsSegment
          servicePrices={myProfile?.servicePrices ?? []}
          isReadonly
        />
      )}
      {segment === "feedback" && (
        <RatingClinicComponent
          ratingNumber={myProfile?.rating ?? 0}
          canAddReview={false}
        />
      )}
    </>
  );
};

export default MyDoctorProfile;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
