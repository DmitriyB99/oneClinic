import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import { Alert } from "antd";
import { useRouter } from "next/router";

import {
  defaultFilter,
  DoctorsFilterDialog,
} from "@/entities/clinics/ui/DoctorsFilterDialog";
import { dictionaryApi } from "@/shared/api/dictionary";
import type { DoctorsFilter } from "@/shared/api/patientContent/doctors";
import { patientDoctorsApi } from "@/shared/api/patientContent/doctors";
import {
  Avatar,
  Button,
  Chips,
  DividerSaunet,
  FilterIcon,
  Island,
  List,
  SaunetIcon,
  StarIcon,
} from "@/shared/components";
import { LikeButton } from "@/shared/components/molecules/FavouriteButton";
import { useFavourite } from "@/shared/hooks/useFavourite";
import { convertStringToAvatarLabel } from "@/shared/utils";
import { DoctorClinicsWidget } from "@/widgets/clinics/DoctorsPage/doctorWidget";

import { AppointmentDialog } from "../Final";

export function DoctorRender() {
  const [filters, setFilters] = useState<DoctorsFilter>(defaultFilter);
  const [isOpenAppointmentDialog, setIsOpenAppointmentDialog] =
    useState<boolean>(false);
  const [isOpenFilterDialog, setIsOpenFilterDialog] = useState<boolean>(false);
  const router = useRouter();

  const specialityId = router.query.speciality as string;

  const { data: doctors } = useQuery(
    ["getDoctors", filters],
    () => patientDoctorsApi.getDoctors(filters).then((res) => res.data),
    { retry: false, retryOnMount: false, refetchOnWindowFocus: false }
  );

  console.log("doctors");
  console.log(doctors);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    if (specialityId) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        speciality_ids: [specialityId],
      }));
    }
  }, [specialityId]);

  const { data: doctorName, isLoading } = useQuery(
    ["getSpecialyById", router.query.speciality],
    () =>
      dictionaryApi
        .getSpecialyById("ru", router.query.speciality as string)
        .then((response) => response.data.name)
  );

  const { handleLikeToggle } = useFavourite("Doctor");

  if (router.query.doctorId) {
    return <DoctorClinicsWidget onBack={() => router.back()} />;
  }

  return (
    <>
      <Island className="!px-4 !pt-8">
        <div className="flex items-center justify-between">
          <p className="mb-0 text-Bold24">
            {isLoading ? "Loading..." : doctorName ?? "Онлайн консультация"}
          </p>
          <Button
            iconButton
            icon={<FilterIcon />}
            variant="tertiary"
            size="s"
            onClick={() => setIsOpenFilterDialog(true)}
            className="z-50"
          />
        </div>
        <Chips
          onChange={(value) => setFilters(value as string[])}
          chipLabels={[
            "По популярности",
            "Рядом со мной",
            "Онлайн",
            "Рейтинг",
            "Стоимость",
          ]}
          type="multiselect"
          className="mb-0"
        />
      </Island>
      {doctors?.total === 0 && (
        <Alert message="Врачи данной специальности отсутсвуют" type="warning" />
      )}
      {doctors?.content?.map((doctor) => (
        <Island key={doctor?.id} className="mx-4 my-3">
          <div className="flex">
            <div onClick={() => router.push(`/doctor/${doctor.id}`)}>
              <Avatar
                src={doctor?.photo_url}
                size="clinicAva"
                isOnline
                text={convertStringToAvatarLabel(doctor?.full_name)}
              />
            </div>
            <div className="ml-4 w-full">
              <div className="flex items-center justify-between">
                <p
                  className="mb-0 text-Regular16"
                  onClick={() => router.push(`/doctor/${doctor.id}`)}
                >
                  {doctor?.full_name}
                </p>
                <span>
                  <LikeButton
                    initialLiked={doctor.is_favourite}
                    onToggle={(updatedState) =>
                      handleLikeToggle(doctor.id, doctor.is_favourite, () => {
                        doctor.is_favourite = updatedState;
                      })
                    }
                  />
                </span>
              </div>
              <div className="mb-3 flex items-center">
                <StarIcon size="xs" />
                <p className="mb-0 ml-1 text-Semibold12">
                  {doctor?.rating?.toFixed(1)}
                </p>
                <p className="mb-0 ml-2 text-Regular12 text-secondaryText">
                  {doctor?.review_count} отзыва
                </p>
              </div>
              <Button
                block
                size="s"
                onClick={() => setIsOpenAppointmentDialog(true)}
              >
                Записаться
              </Button>
            </div>
          </div>
          <Chips
            chipLabels={doctor?.specialities ?? []}
            type="suggest"
            className="my-4"
          />
          <List
            items={[
              {
                title: doctor?.clinic && doctor?.clinic[0]?.name,
                description: doctor?.clinic && doctor?.clinic[0]?.address,
                icon: (doctor?.clinic && doctor?.clinic[0]?.icon_url) || (
                  <SaunetIcon size="lg" />
                ),
                id: doctor?.clinic && doctor?.clinic[0]?.id,
              },
            ]}
          />
          <div className="mt-4 flex justify-between">
            <div>
              <p className="mb-0 text-Semibold12">Выезд на дом</p>
              <p className="mb-0 text-Regular12">
                {doctor?.consultation_prices?.find(
                  (servicePrice) => servicePrice?.consultation_type === "AWAY"
                )?.price ?? "Цена не указана"}{" "}
                ₸
              </p>
            </div>
            <DividerSaunet type="vertical" className="m-0 h-inherit" />
            <div>
              <p className="mb-0 text-Semibold12">В больнице</p>
              <p className="mb-0 text-Regular12">
                {doctor?.consultation_prices?.find(
                  (servicePrice) =>
                    servicePrice?.consultation_type === "OFFLINE"
                )?.price ?? "Цена не указана"}{" "}
                ₸
              </p>
            </div>
            <DividerSaunet type="vertical" className="m-0 h-inherit" />
            <div>
              <p className="mb-0 text-Semibold12">Онлайн-прием</p>
              <p className="mb-0 text-Regular12">
                {doctor?.consultation_prices?.find(
                  (servicePrice) => servicePrice?.consultation_type === "ONLINE"
                )?.price ?? "Цена не указана"}{" "}
                ₸
              </p>
            </div>
          </div>
        </Island>
      ))}
      <div className="p-4">
        <DoctorsFilterDialog
          isOpen={isOpenFilterDialog}
          setIsOpen={setIsOpenFilterDialog}
          onFiltersChange={handleFiltersChange}
        />
      </div>
      <AppointmentDialog
        doctorId={"1" as string}
        clinicId={"1" ?? ""}
        isOpen={isOpenAppointmentDialog}
        setIsOpen={setIsOpenAppointmentDialog}
      />
    </>
  );
}
