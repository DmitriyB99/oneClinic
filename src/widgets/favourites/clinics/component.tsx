import { ReactElement, useState } from "react";
import { useQuery } from "react-query";

import { Alert } from "antd";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { DoctorInfoCard } from "@/entities/doctor";
import { patientFavouritesApi } from "@/shared/api/patient/favourites";
import {
  Avatar,
  Button,
  Chips,
  DividerSaunet,
  Island,
  UnlikedHeartIcon,
  List,
  SaunetIcon,
  StarIcon,
} from "@/shared/components";
import { DoctorClinicsWidget } from "@/widgets/clinics/DoctorsPage/doctorWidget";
// import { AppointmentDialog } from "../Final";

export function FavouritesClinics() {
  const [isOpenAppointmentDialog, setIsOpenAppointmentDialog] =
    useState<boolean>(false);
  const router = useRouter();

  const { data: favouriteDoctors } = useQuery(
    ["getfavouriteDoctors"],
    () =>
      patientFavouritesApi.getFavouriteDoctors({
        page: 1,
        size: 999,
        sort: "created,desc",
      })
    // {
    //   retry: false,
    //   retryOnMount: false,
    //   refetchOnWindowFocus: false,
    // }
  );

  console.log("favouriteDoctors");
  console.log(favouriteDoctors);


  if (router.query.doctorId) {
    return <DoctorClinicsWidget onBack={() => router.back()} />;
  }

  return (
    <>
      {favouriteDoctors?.data?.content ? (
        favouriteDoctors?.data?.content?.map((doctor) => (
          <DoctorInfoCard
            isOnlineConsultation={true}
            onRegisterAppointment={() =>
              //   isOnlineConsultation
              //     ? setIsOpenOnlineAppointmentDialog(true)
              //     : setIsOpenAppointmentDialog(true)
              console.log(123)
            }
            {...doctor}
            onCardClick={() => router.push(`/doctor/${doctor.doctorId}`)}
          />
        ))
      ) : (
        <div className="mt-32 px-4">
          <div className="mb-6 text-center text-Bold24">
            У вас еще нет <br /> избранных клиник
          </div>
          <div className="mb-6 text-center text-Medium16 text-gray-secondary">
            Добавляйте клиники в Избранное, <br /> чтобы проще искать свои
            клиники <br /> из списка
          </div>
          <Button
            variant="primary"
            className="mt-4 w-full"
            onClick={() => router.push(`/clinics`)}
          >
            К списку клиник
          </Button>
        </div>
      )}
      {/* <AppointmentDialog
        doctorId={"1" as string}
        clinicId={"1" ?? ""}
        isOpen={isOpenAppointmentDialog}
        setIsOpen={setIsOpenAppointmentDialog}
      /> */}
    </>
  );
}
