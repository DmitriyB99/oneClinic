import { useCallback, useState } from "react";
import { useQuery } from "react-query";

import { PhoneOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

import { DoctorShortStats } from "@/entities/doctor";
import { KaspiFillDialog } from "@/features/balance";
import { doctorsApi } from "@/shared/api/doctors";
import {
  Avatar,
  Button,
  Island,
  Navbar,
  SegmentedControl,
  ShareIcon,
} from "@/shared/components";
import {
  ConsultationsSegment,
  AboutSegment,
} from "@/widgets/clinics/DoctorsPage";
import { AppointmentDialog } from "@/widgets/clinics/Final/AppointmentDialog";
import { RatingClinicComponent } from "@/widgets/clinics/Rating";

export function DoctorClinicsWidget({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const [segment, setSegment] = useState<string>("services");
  const [activePrice, setActivePrice] = useState<string>("");
  const [activeConsultationType, setActiveConsultationType] =
    useState<string>("online");
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);

  const doctorId = router.query.doctorId as string;
  const clinicId = router.query.clinicId as string;

  const { data: doctor } = useQuery(["getChatDoctorProfile"], () =>
    doctorsApi
      .getDoctorProfileById(router.query.doctorId as string)
      .then((res) => {
        setActivePrice(res?.data?.servicePrices?.[0]?.firstPrice ?? "");
        return res.data;
      })
  );
  const handleDoctorShare = useCallback(() => {
    navigator.share({
      title: "Промокод",
      text: "Лучшая клиника в мире!!",
      url: window.location.href,
    });
  }, []);

  return (
    <div>
      <AppointmentDialog
        doctor={doctor}
        doctorId={doctorId}
        clinicId={clinicId}
        activeConsultationType={activeConsultationType}
        isOpen={isOpenDialog}
        setIsOpen={setIsOpenDialog}
      />
      <KaspiFillDialog
        isDialogOpen={isWalletDialogOpen}
        setDialogOpen={setIsWalletDialogOpen}
      />
      <Navbar
        title=""
        leftButtonOnClick={onBack}
        className="h-15"
        rightIconOnClick={handleDoctorShare}
        rightIcon={<ShareIcon />}
      />
      <Island className="rounded-b-3xl rounded-t-none">
        <div className="mb-4 flex">
          <Avatar
            src={doctor?.photoUrl}
            text={`${doctor?.lastName?.[0]?.toUpperCase()} ${doctor?.lastName?.[0]?.toUpperCase()} ${doctor?.fatherName?.[0]?.toUpperCase()}`}
            size="clinicAva"
          />
          <div className="ml-4 w-full">
            <div className="text-Bold20">
              {doctor?.lastName} {doctor?.firstName} {doctor?.fatherName}
            </div>
            <p className="text-Regular12">
              Люблю помогать людям поддерживать их здоровье в отличном
              состоянии!
            </p>
          </div>
        </div>

        <DoctorShortStats
          workExperience={doctor?.workExperience}
          rating={doctor?.rating}
        />
        <SegmentedControl
          options={[
            { label: "Услуги", value: "services" },
            { label: "О враче", value: "about" },
            { label: "Отзывы", value: "feedback" },
          ]}
          value={segment}
          onChange={(val) => setSegment(val as string)}
        />
      </Island>
      {segment === "services" && (
        <ConsultationsSegment
          servicePrices={doctor?.servicePrices ?? []}
          setActivePrice={setActivePrice}
          setActiveConsultationType={setActiveConsultationType}
        />
      )}
      {segment === "feedback" && <RatingClinicComponent ratingNumber={4} />}
      {segment === "about" && (
        <AboutSegment studyDegrees={doctor?.studyDegrees} />
      )}
      <div className="sticky bottom-0 flex w-full bg-white p-4">
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
    </div>
  );
}
