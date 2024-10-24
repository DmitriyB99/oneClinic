import type { FC } from "react";
import { useState } from "react";
import { useQuery } from "react-query";

import { Alert } from "antd";
import { useRouter } from "next/router";

import { DoctorInfoCard } from "@/entities/doctor";
import { patientDoctorsApi } from "@/shared/api/patientContent/doctors";
import { AppointmentDialog } from "@/widgets/clinics/Final";

export const DoctorsClinicSegment: FC = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const router = useRouter();
  const { data: doctors } = useQuery(
    ["getClinicDoctors", router.query.clinicId],
    () =>
      patientDoctorsApi
        .getDoctorsByClinicId(router.query.clinicId as string)
        .then((res) => res.data)
  );

  const doctorId = router.query.doctorId as string;
  const clinicId = router.query.clinicId as string;

  return (
    <div>
      <AppointmentDialog
        doctorId={doctorId}
        clinicId={clinicId}
        isOpen={isOpenDialog}
        setIsOpen={setIsOpenDialog}
      />
      {!doctors && (
        <Alert message="Врачи в данной клинике отсутсвуют" type="warning" />
      )}
      {doctors?.map(
        (
          doctor //убрать аватарку клиники у врача
        ) => (
          <DoctorInfoCard
            key={doctor?.id}
            onRegisterAppointment={() => setIsOpenDialog(true)}
            onCardClick={() =>
              router.push({
                pathname: "/clinics/map",
                query: {
                  widget: "doctors",
                  doctorId: doctor?.id,
                  clinicId: clinicId ?? doctor?.clinic?.[0]?.id ?? "",
                },
              })
            }
            {...doctor}
          />
        )
      )}
    </div>
  );
};
