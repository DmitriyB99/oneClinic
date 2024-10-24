import type { FC } from "react";
import { useState } from "react";

import { useTranslations } from "next-intl";

import type { DesktopFiltersNewDrawerProps } from "@/entities/desktopDrawer";
import {
  Button,
  Checkbox,
  DividerSaunet,
  Drawer,
  Toggle,
} from "@/shared/components";

export const DesktopFiltersDrawer: FC<DesktopFiltersNewDrawerProps> = ({
  onClose,
  open,
  onSubmit,
}) => {
  const [hideCancelBookings, setHideCancelBookings] = useState(true);
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Bookings");
  return (
    <Drawer onClose={onClose} open={open} title={tDesktop("Filters")}>
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-col">
          <div className="mb-6 text-Bold20">{tDesktop("ShowEntries")}:</div>
          <Checkbox desktop className="py-1 text-Regular16">
            {t("OnlineConsultations")}
          </Checkbox>
          <DividerSaunet />
          <Checkbox desktop className="py-1 text-Regular16">
            {tDesktop("ClinicAppointments")}
          </Checkbox>
          <DividerSaunet />
          <Checkbox desktop className="py-1 text-Regular16">
            {tDesktop("HousesCalls")}
          </Checkbox>
          <DividerSaunet />
          <Checkbox desktop className="py-1 text-Regular16">
            {t("Diagnostics")}
          </Checkbox>
          <DividerSaunet />
          <Checkbox desktop className="py-1 text-Regular16">
            {t("Analyzes")}
          </Checkbox>
          <div className="mb-6 mt-9 text-Bold20">
            {tDesktop("BookingsByDoctors")}:
          </div>
          <Checkbox desktop className="py-1 text-Regular16">
            Калдыкозов Рахым
          </Checkbox>
          <div className="mb-6 mt-9 text-Bold20">
            {tDesktop("CanceledBookings")}
          </div>
          <div className="flex items-center gap-3">
            <Toggle
              onChange={(checked) => setHideCancelBookings(checked)}
              defaultChecked
              desktop
            />
            <div className="text-Regular16">
              {tDesktop("ShowCanceledBookings")}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button className="!h-10 rounded-lg !border px-4" variant="outline">
            {t("ThrowOff")}
          </Button>
          <Button
            className="!h-10 rounded-lg px-4"
            onClick={() => {
              onSubmit?.(!hideCancelBookings);
              onClose();
            }}
          >
            {t("IsReady")}
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
