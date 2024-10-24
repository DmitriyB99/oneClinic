import { useMemo } from "react";
import type { FC } from "react";
import { useQuery } from "react-query";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { DesktopBookingsDrawerProps } from "@/entities/desktopDrawer";
import { appointmentBookingApi } from "@/shared/api/appointmentBooking";
import {
  Avatar,
  Button,
  CheckSquareIcon,
  DividerSaunet,
  Drawer,
} from "@/shared/components";

export const DesktopBookingsDrawer: FC<DesktopBookingsDrawerProps> = ({
  onClose,
  open,
  id,
}) => {
  const { data: consultationData } = useQuery(["getConsultationById", id], () =>
    appointmentBookingApi.getConsultationSlotById(id).then((res) => res.data)
  );
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Bookings");

  const consultationStartTime = useMemo(
    () => dayjs(consultationData?.fromTime).format("D MMMM в HH:mm"),
    [consultationData]
  );

  const directionCreatedTime = useMemo(
    () =>
      dayjs(consultationData?.treatmentDirectionInfo?.created).format(
        "D MMMM HH:mm"
      ),
    [consultationData]
  );

  return (
    <Drawer onClose={onClose} open={open} title="О записи">
      <Avatar
        icon={<CheckSquareIcon size="lg" />}
        className="flex items-center justify-center bg-brand-light"
        size="clinicAva"
      />
      <div className="my-6">
        <div className="text-Bold24">
          {tDesktop("PatientHasAppointmentClinic")}
        </div>
        <div className="mt-3 text-Regular16">{consultationStartTime}</div>
      </div>
      <div className="flex flex-col items-start justify-start">
        <h3 className="mb-3 text-Bold20 text-dark">{t("AboutAppointment2")}</h3>
        <div className="mt-3 w-full">
          <div className="text-Regular12 text-secondaryText">
            {t("Patient")}
          </div>
          <div className="mt-1 text-Regular16 text-blue">
            {consultationData?.reservedFullname}
          </div>
          <DividerSaunet className="mb-0 mt-3" />
        </div>
        <div className="mt-6 w-full">
          <div className="text-Regular12 text-secondaryText">
            {t("PatientPhoneNumber")}
          </div>
          <div className="mt-1 text-Regular16">
            {consultationData?.reservedPhoneNumber}
          </div>
          <DividerSaunet className="mb-0 mt-3" />
        </div>
        <div className="mt-6 w-full">
          <div className="text-Regular12 text-secondaryText">
            {tDesktop("WhoIsRegisteredWith")}
          </div>
          <div className="my-1 text-Regular16 text-blue">
            {consultationData?.doctorFullname}
          </div>
          <div className="text-Regular12 text-secondaryText">
            {t("Surgeon")}
          </div>
          <DividerSaunet className="mb-0 mt-3" />
        </div>
        <div className="mt-6 w-full">
          <div className="text-Regular12 text-secondaryText">
            {tDesktop("WhereDoctorAccept")}
          </div>
          <div className="mt-1 text-Regular16">
            {t("StreetPoint")} {consultationData?.clinicInfo?.street}{" "}
            {consultationData?.clinicInfo?.buildNumber}, 8 {t("Floor")}, 3{" "}
            {t("Office")}
          </div>
          <DividerSaunet className="mb-0 mt-3" />
        </div>
        <div className="mt-6 w-full">
          <div className="text-Regular12 text-secondaryText">
            {t("CostOfServicesFirstAppointment")}
          </div>
          <div className="mt-1 text-Regular16">{consultationData?.price}</div>
          <DividerSaunet className="mb-0 mt-3" />
        </div>
        {consultationData?.isInDirection && (
          <>
            <h3 className="mt-6 text-Bold20 text-dark">{t("Direction")}</h3>
            <div className="mt-6 w-full">
              <div className="text-Regular12 text-secondaryText">
                {directionCreatedTime}
              </div>
              <div className="my-1 text-Regular16 text-blue">
                {t("Therapist")} →{" "}
                {consultationData.treatmentDirectionInfo?.categoryName}
              </div>
              <div className="text-Regular12 text-secondaryText">
                {t("From")}{" "}
                {consultationData.treatmentDirectionInfo?.doctorFullname},
              </div>
              <DividerSaunet className="mb-0 mt-3" />
            </div>
            <div className="mt-28 flex w-full justify-end gap-4">
              <Button
                className="!h-10 rounded-lg !border px-4"
                variant="outline"
                outlineDanger
              >
                {t("CancelEntry")}
              </Button>
              <Button className="!h-10 rounded-lg px-4" variant="outline">
                {t("TransferAppointment")}
              </Button>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};
