import { useState } from "react";
import { useQuery } from "react-query";

import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

import { WeekdayEnum } from "@/entities/login";
import type { WorkPeriod } from "@/shared/api/clinics";
import { clinicsApi } from "@/shared/api/clinics";
import { patientClinicsApi } from "@/shared/api/patientContent/clinics";
import {
  Button,
  Dialog,
  Island,
  SegmentedControl,
  ShareIcon,
} from "@/shared/components";
import { AboutClinicSegment } from "@/widgets/clinics/AboutSegment";
import { DoctorsClinicSegment } from "@/widgets/clinics/DoctorsSegment";
import { ServiceClinicSegment } from "@/widgets/clinics/ServiceSegment";

export const ClinicWidget = ({ handleShowOnMap, isOpen, setIsOpen }) => {
  const [segment, setSegment] = useState<string>("about");
  const router = useRouter();
  const { data: clinicData } = useQuery(
    ["getClinic", router.query.clinicId],
    () =>
      patientClinicsApi
        .getClinicById(router.query.clinicId as string)
        .then((res) => res.data)
  );

  const handleBackClick = () => {
    console.log(`handleBackClick`);
    setIsOpen();
  };
  return (
    <Dialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="h-9/10 !bg-gray-0 !p-0"
    >
      <>
        <div className="rounded-b-3xl bg-white pb-4">
          <div className="flex items-center justify-between bg-white p-4">
            <div
              className="flex cursor-pointer rounded-2xl bg-gray-2 px-5 py-2 text-Bold20"
              onClick={() => setIsOpen(false)}
            >
              <ArrowLeftOutlined />
            </div>
            <div className="text-center">
              <p className="mb-0 mt-3 text-Bold16">{clinicData?.name}</p>
              <p className="mx-2 mb-0 text-Medium12 text-secondaryText">
                {clinicData?.street} {clinicData?.buil_number}
              </p>
            </div>
            <Button
              icon={<ShareIcon className="mr-2" />}
              square
              size="s"
              variant="tertiary"
              onClick={() =>
                navigator.share({
                  title: clinicData?.name,
                  text: "Лучшая клиника в мире!!",
                  url: window.location.href,
                })
              }
            />
          </div>
          <SegmentedControl
            options={[
              { label: "О клинике", value: "about" },
              { label: "Врачи", value: "doctors" },
              { label: "Услуги", value: "services" },
            ]}
            size="m"
            className="mx-4"
            onChange={(val) => setSegment(val as string)}
          />
        </div>

        {segment === "about" && (
          <AboutClinicSegment
            {...clinicData}
            status={clinicData?.status as "ACTIVE" | undefined}
            handleShowOnMap={handleShowOnMap}
          />
        )}
        {segment === "doctors" && <DoctorsClinicSegment />}
        {segment === "services" && <ServiceClinicSegment />}
      </>
    </Dialog>
  );
};
