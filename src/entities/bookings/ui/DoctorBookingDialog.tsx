import type { FC } from "react";

import { useTranslations } from "next-intl";

import type { DoctorBookingDialogProps } from "@/entities/bookings/";
import {
  Avatar,
  Button,
  CloseIcon,
  Dialog,
  DividerSaunet,
  Island,
} from "@/shared/components";

export const DoctorBookingDialog: FC<DoctorBookingDialogProps> = ({
  openDoctorBookingDialog,
  setOpenDoctorBookingDialog,
  clinicName,
  subtitle,
  address,
  price,
  personName,
  reminderText,
  title,
  buttons,
  imageUrl,
}) => {
  const t = useTranslations("Common");

  return (
    <Dialog
      isOpen={openDoctorBookingDialog}
      setIsOpen={setOpenDoctorBookingDialog}
      className="!p-0"
    >
      <div className="relative h-screen bg-gray-1">
        <Island className="mb-2">
          <Button
            size="s"
            variant="tinted"
            className="mb-6 bg-gray-2"
            onClick={() => setOpenDoctorBookingDialog(false)}
          >
            <CloseIcon />
          </Button>
          <div className="mb-6 flex justify-center">
            <Avatar size="clinicAva" src={imageUrl ?? ""} />
          </div>
          <div className="px-12 text-center">
            <div className="text-Bold24">{title ?? ""}</div>
            <div className="mt-3 text-Bold16">
              {subtitle ?? ""}
              <div className="text-Regular16 text-red">
                {reminderText ?? ""}
              </div>
            </div>
          </div>
        </Island>
        <Island className="mb-2">
          <div className="flex flex-col items-start justify-start">
            <h3 className="mb-3 text-Bold20 text-dark">
              {t("AboutAppointment2")}
            </h3>
            <div className="mt-3">
              <div className="text-Regular12 text-secondaryText">
                {t("Patient")}
              </div>
              <div className="mt-1 text-Regular16 text-blue">
                {personName ?? ""}
              </div>
              <DividerSaunet className="mb-0 mt-3" />
            </div>
            <div className="mt-3">
              <div className="text-Regular12 text-secondaryText">
                {t("Clinic")}
              </div>
              <div className="mt-1 text-Regular16 text-blue">
                {clinicName ?? ""}
              </div>
              <DividerSaunet className="mb-0 mt-3" />
            </div>
            <div className="mt-3">
              <div className="text-Regular12 text-secondaryText">
                {t("Address")}
              </div>
              <div className="mt-1 text-Regular16">{address ?? ""}</div>
              <DividerSaunet className="mb-0 mt-3" />
            </div>
            <div className="mt-3">
              <div className="text-Regular12 text-secondaryText">
                {t("CostOfServicesFirstAppointment")}
              </div>
              <div className="mt-1 text-Regular16">{price ?? ""}</div>
              <DividerSaunet className="mb-0 mt-3" />
            </div>
          </div>
        </Island>
        {/* <Island className="mb-2"> TODO: Добавить как бек сделает REST
        <h3 className="mb-3 text-Bold20 text-dark">Направление</h3>
        <div className="mt-3">
          <div className="text-Regular12 text-secondaryText">25 мая 14:32</div>
          <div className="mt-1 text-Regular16">Терапевт → Отоларинголог</div>
          <div className="mt-1 text-Regular12 text-secondaryText">
            от Савченко В.И., Saunet Clinic
          </div>
        </div>
      </Island> */}
        <Island>
          <DividerSaunet className="mb-0 mt-3 w-screen" />
          {buttons}
        </Island>
      </div>
    </Dialog>
  );
};
