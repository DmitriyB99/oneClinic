import type { ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";

import { PhoneOutlined } from "@ant-design/icons";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { DoctorShortStats } from "@/entities/doctor";
import { doctorsApi } from "@/shared/api/doctors";
import {
  ArrowLeftIcon,
  AsteriskIcon,
  Button,
  HalfGreenheartIcon,
  Island,
  SegmentedControl,
  ShareIcon,
} from "@/shared/components";
import { MainLayout } from "@/shared/layout";
import {
  AboutSegment,
  ConsultationsSegment,
} from "@/widgets/clinics/DoctorsPage";
import { RatingClinicComponent } from "@/widgets/clinics/Rating";

export default function ViewDoctorProfile() {
  const t = useTranslations("Common");
  const router = useRouter();
  const [segment, setSegment] = useState<string>("services");
  const [activePrice, setActivePrice] = useState<string>("");
  const [_activeConsultationType, setActiveConsultationType] =
    useState<string>("online");

  const { data: doctor } = useQuery(["getMyProfile"], () =>
    doctorsApi.getMyDoctorProfile().then((res) => res.data)
  );

  const handleDoctorShare = useCallback(() => {
    navigator.share({
      title: "Промокод",
      text: "Лучшая клиника в мире!!",
      url: window.location.href,
    });
  }, []);

  const clinicId = useMemo(
    () => doctor?.clinics?.[0]?.clinicId,
    [doctor?.clinics]
  );

  const doctorName = useMemo(
    () =>
      `${doctor?.lastName ?? ""} ${doctor?.firstName ?? ""} ${
        doctor?.fatherName ?? ""
      }`,
    [doctor?.fatherName, doctor?.firstName, doctor?.lastName]
  );

  const backgroundImage = useMemo(
    () => (doctor?.photoUrl ? doctor?.photoUrl : "/doctor-profile.png"),
    [doctor]
  );

  return (
    <>
      <div className="h-screen overflow-auto bg-gray-2">
        <div
          className="relative h-[415px] w-full rounded-b-3xl bg-gray-4 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="flex w-full place-items-center justify-between px-6">
            <div
              onClick={() => router.back()}
              className="absolute left-5 top-5 flex cursor-pointer rounded-3xl bg-gray-2 px-5 py-2 text-Bold20"
            >
              <ArrowLeftIcon />
            </div>
            <div className="absolute right-40 top-5">
              <AsteriskIcon size="lg" />
              <HalfGreenheartIcon className="-ml-6" size="lg" />
            </div>
            <div
              onClick={handleDoctorShare}
              className="absolute right-5 top-5 flex cursor-pointer rounded-3xl bg-gray-2 p-2 text-Bold20"
            >
              <ShareIcon />
            </div>
          </div>
          <div className="absolute bottom-5 left-5 text-white">
            <h2 className="font-bold">{doctorName}</h2>
            <p className="text-left text-white text-opacity-80">
              Врач-терапевт
            </p>
          </div>
        </div>
        <Island className="mt-2 rounded-b-3xl rounded-t-none">
          <DoctorShortStats
            workExperience={doctor?.workExperience}
            rating={doctor?.rating}
          />
        </Island>
        <Island className="mt-2 pb-24">
          <SegmentedControl
            options={[
              { label: t("Services"), value: "services" },
              { label: t("AboutDoctor"), value: "about" },
              { label: t("Reviews"), value: "feedback" },
            ]}
            value={segment}
            onChange={(val) => setSegment(val as string)}
          />
          {segment === "services" && (
            <ConsultationsSegment
              servicePrices={doctor?.servicePrices ?? []}
              setActivePrice={setActivePrice}
              setActiveConsultationType={setActiveConsultationType}
              isReadonly
            />
          )}
          {segment === "feedback" && (
            <RatingClinicComponent ratingNumber={4} canAddReview={false} />
          )}
          {segment === "about" && (
            <AboutSegment studyDegrees={doctor?.studyDegrees} />
          )}
        </Island>
      </div>
      {clinicId && (
        <div className="fixed bottom-0 flex w-full bg-white p-4">
          <Button variant="tertiary" className="mr-2">
            <PhoneOutlined className="text-Bold20" />
          </Button>
          <Button
            block
            className="flex !h-14 items-center justify-between px-4"
            disabled
          >
            <p className="mb-0 text-Medium16">{t("Register")}</p>
            <p className="mb-0 text-Medium16">от {activePrice} ₸</p>
          </Button>
        </div>
      )}
    </>
  );
}

ViewDoctorProfile.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
