import type { FC } from "react";
import { useState, useMemo, useContext } from "react";
import { useMutation } from "react-query";

import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  AppointmentCheckInformation,
  AppointmentChoosePatient,
} from "@/entities/appointments";
import { doctorsApi } from "@/shared/api";
import { chatApi } from "@/shared/api/chat";
import type { GetDutyDoctorsListResponseDTO } from "@/shared/api/dtos";
import { Dialog } from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";

export const DutyDoctorsDialogSelected: FC<{
  doctor?: GetDutyDoctorsListResponseDTO;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}> = ({ isOpen, setIsOpen, doctor }) => {
  const t = useTranslations("Common");
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { user } = useContext(UserContext);

  const onlineConsultationPrice = useMemo(
    () =>
      doctor?.servicePrices?.find(
        (service) => service.consultationType === "ONLINE"
      )?.firstPrice ?? "0",
    [doctor]
  );

  const { mutate: createChatRoom } = useMutation(
    ["createRoomId"],
    () => chatApi.createChat({ doctorId: doctor?.userId || "" }),
    {
      retry: false,
      onSuccess: (res) => {
        router.push(`/chat/${res.data?.id}`);
      },
    }
  );

  const { mutate: activateSessionWithDutyDoctor } = useMutation(
    ["activateSessionWithDutyDoctor"],
    () =>
      doctorsApi.activateSessionWithDutyDoctor(
        doctor?.doctorId ?? "",
        user?.role_id ?? "",
        doctor?.clinicInfos?.[0]?.clinicId ?? "",
        parseInt(onlineConsultationPrice)
      ),
    {
      onSuccess: () => {
        createChatRoom();
      },
    }
  );

  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen} className="h-screen !p-0">
      <>
        {step === 1 && (
          <div className="p-4">
            <AppointmentChoosePatient
              handleBack={() => setIsOpen(false)}
              handleGoNext={() => setStep(2)}
            />
          </div>
        )}
        {step === 2 && (
          <div className="p-4">
            <AppointmentCheckInformation
              appointmentInformation={{
                cost: parseInt(onlineConsultationPrice),
                date: format(new Date(), "dd.MM.yyyy hh:mm"),
                doctor: doctor?.fullName,
                format: "home",
                medicalFacility: doctor?.clinicInfos?.[0]?.name || "-",
              }}
              handleGoToNextPage={() => activateSessionWithDutyDoctor()}
              handleBack={() => setStep(1)}
              submitButtonText={t("CallDoctor")}
            />
          </div>
        )}
      </>
    </Dialog>
  );
};
