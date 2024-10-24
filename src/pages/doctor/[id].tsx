import type { ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";

import { PhoneOutlined } from "@ant-design/icons";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { SpecialistDialog } from "@/entities/clinics";
import { DoctorShortStats } from "@/entities/doctor";
import { KaspiFillDialog } from "@/features/balance";
import { patientDoctorsApi } from "@/shared/api/patientContent/doctors";
import {
  ArrowLeftIcon,
  AsteriskIcon,
  Button,
  HalfGreenheartIcon,
  InteractiveList,
  Island,
  SegmentedControl,
  ShareIcon,
} from "@/shared/components";
import { LikeButton } from "@/shared/components/molecules/FavouriteButton";
import { CONSULTATION_TYPE } from "@/shared/constants";
import { useFavourite } from "@/shared/hooks/useFavourite";
import { MainLayout } from "@/shared/layout";
import {
  AboutSegment,
  ConsultationsSegment,
} from "@/widgets/clinics/DoctorsPage";
import { AppointmentDialog } from "@/widgets/clinics/Final";
import { RatingClinicComponent } from "@/widgets/clinics/Rating";

export default function DoctorDetailPage() {
  const t = useTranslations("Common");
  const router = useRouter();
  const { id: doctorId } = router.query;
  const [segment, setSegment] = useState<string>("services");
  const [activePrice, setActivePrice] = useState<string>("");

  const [activeConsultationType, setActiveConsultationType] =
    useState<string>("online");
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);

  const { handleLikeToggle } = useFavourite("Doctor");

  const { data: doctor } = useQuery(
    ["getDoctorProfile"],
    () =>
      patientDoctorsApi
        .getDoctoById(doctorId as string, { latitude: 0, longitude: 0 })
        .then((res) => res.data),
    { enabled: !!doctorId }
  );

  const { data: doctorServices } = useQuery(
    ["getDoctorServices"],
    () =>
      patientDoctorsApi.getDoctorsServices(doctorId as string).then((res) => {
        setActivePrice(res?.data?.services?.[0]?.first_price ?? "");
        return res.data;
      }),
    { enabled: !!doctorId }
  );

  const handleDoctorShare = useCallback(() => {
    navigator.share({
      title: "Промокод",
      text: "Лучшая клиника в мире!!",
      url: window.location.href,
    });
  }, []);

  const clinicId = useMemo(
    () => doctor?.doctor_clinic?.[0]?.id,
    [doctor?.doctor_clinic]
  );

  const doctorName = useMemo(() => `${doctor?.full_name}`, [doctor?.full_name]);

  const backgroundImage = useMemo(
    () => (doctor?.photo_url ? doctor?.photo_url : "/doctor-profile.png"),
    [doctor]
  );

  const customServices = doctorServices?.custom_services.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.first_price,
  }));

  return (
    <>
      {clinicId && (
        <AppointmentDialog
          doctor={doctor}
          doctorId={doctorId as string}
          clinicId={clinicId ?? ""}
          activeConsultationType={activeConsultationType}
          isOpen={isOpenDialog}
          setIsOpen={setIsOpenDialog}
        />
      )}
      <KaspiFillDialog
        isDialogOpen={isWalletDialogOpen}
        setDialogOpen={setIsWalletDialogOpen}
      />
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
            <div className="absolute right-20 top-5 flex cursor-pointer rounded-3xl bg-gray-2 p-2 text-Bold20">
              <LikeButton
                initialLiked={doctor?.is_favourite}
                onToggle={(updatedState) =>
                  handleLikeToggle(doctor.id, doctor?.is_favourite, () => {
                    doctor.is_favourite = updatedState;
                  })
                }
              />
            </div>
            <div
              onClick={handleDoctorShare}
              className="absolute right-5 top-5 flex cursor-pointer rounded-3xl bg-gray-2 p-2 text-Bold20"
            >
              <ShareIcon />
            </div>
          </div>
          <div className="absolute bottom-3 left-5 text-white">
            <div className="mb-3 inline-flex items-center rounded-3xl bg-brand-ultraLight px-2 py-1">
              <div className="text-Semibold16 text-black">
                был(а) в сети 13.02.2023 в 14:32
              </div>
            </div>
            <h2 className="font-bold">{doctorName}</h2>
            <p className="text-left text-white text-opacity-80">
              {t("DoctorTherapist")}
            </p>
          </div>
        </div>
        <Island className="mt-2 rounded-b-3xl rounded-t-none">
          <DoctorShortStats
            workExperience={doctor?.work_experience}
            rating={doctor?.rating}
            reviewCount={doctor?.review_count}
            patientCount={doctor?.patient_count}
          />
        </Island>
        <Island className="mt-2">
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
            <>
              <ConsultationsSegment
                servicePrices={doctorServices ?? []}
                setActivePrice={setActivePrice}
                setActiveConsultationType={setActiveConsultationType}
              />
              {customServices?.length > 0 && (
                <Island className="mt-2 !p-4">
                  <div className="flex items-center justify-between">
                    <p className="mb-3 text-Bold20">Другие услуги</p>
                    <SpecialistDialog
                      list={customServices || []}
                      onSpecialityClick={() => setIsOpenDialog(true)}
                    />
                  </div>
                  <InteractiveList
                    list={customServices || []}
                    onClick={() => setIsOpenDialog(true)}
                    maxItems={5}
                  />
                </Island>
              )}
            </>
          )}
          {segment === "feedback" && (
            <div className="!pb-20">
              <RatingClinicComponent ratingNumber={4} isDoctor={true} />
            </div>
          )}
          {segment === "about" && (
            <div className="!pb-20">
              <AboutSegment studyDegrees={doctor} />
            </div>
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
            onClick={() => setIsOpenDialog(true)}
          >
            <p className="mb-0 text-Medium16">Записаться</p>
            <p className="mb-0 text-Medium16">от {activePrice} ₸</p>
          </Button>
        </div>
      )}
    </>
  );
}

DoctorDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}

export const getStaticPaths = () => ({
  paths: [],
  fallback: true,
});
