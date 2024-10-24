import { useCallback, useState } from "react";
import type { FC } from "react";

import clsx from "clsx";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { DesktopBookingsDrawer } from "@/entities/desktopDrawer";
import {
  Heartbeat,
  OnlineMeeting,
  FirstAidKit,
  DividerSaunet,
} from "@/shared/components";

import type { OtherCellsWindowProps } from "../models/BookingTableRenderProps";

enum BookingTypeLabel {
  "AWAY" = "Вызов на дом",
  "OFFLINE" = "Прием в клинике",
  "ONLINE" = "Онлайн консультация",
}

export const OtherCellsWindow: FC<OtherCellsWindowProps> = ({
  data,
  setOpenPopover,
  isClinic,
}) => {
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations("Common");
  const bookingPageOpen = useCallback(
    (id: string) => {
      if (isClinic) {
        setOpenDrawerId((prevId) => (prevId === id ? null : id));
      } else {
        router.push({
          pathname: `bookings/${id}`,
        });
      }
      setOpenPopover(false);
    },
    [router, setOpenDrawerId, setOpenPopover, isClinic]
  );

  return (
    <>
      {data?.map((cellInfo, index) => (
        <div key={cellInfo.id} className="w-48">
          {index !== 0 && <DividerSaunet className="my-2" />}
          <div
            className="relative h-20 cursor-pointer"
            onClick={() => bookingPageOpen(cellInfo.id)}
          >
            <div className="mb-1 truncate font-semibold">{cellInfo.name}</div>
            <div className="mb-2 flex h-6 items-center gap-1">
              <div className="text-Regular12 text-secondaryText">
                {cellInfo.fromTime} - {cellInfo.toTime}
              </div>
              {cellInfo.soon && (
                <div className="flex items-center justify-start text-Regular12 text-red">
                  <div className="mr-2 flex items-center rounded-3xl bg-lightWarning px-2 py-1">
                    ⏰ {t("AfterAmountMinutes", { amount: 10 })}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-start text-Regular12">
              {cellInfo.bookingStatus ? (
                <div className="py-1 text-secondaryText">
                  {t(
                    BookingTypeLabel[
                      cellInfo.bookingType as keyof typeof BookingTypeLabel
                    ]
                  )}
                  <span className="text-red">{t("Cancelled")}</span>
                </div>
              ) : (
                <div
                  className={clsx(
                    "mr-2 flex items-center rounded-3xl px-2 py-1",
                    {
                      "bg-lightWarning": cellInfo.bookingType === "OFFLINE",
                      "bg-lightNeutral": cellInfo.bookingType === "ONLINE",
                      "bg-lightPositive": cellInfo.bookingType === "AWAY",
                    }
                  )}
                >
                  {cellInfo.bookingType === "OFFLINE" && (
                    <Heartbeat size="sm" />
                  )}
                  {cellInfo.bookingType === "ONLINE" && (
                    <OnlineMeeting size="sm" />
                  )}
                  {cellInfo.bookingType === "AWAY" && <FirstAidKit size="sm" />}
                  <div className="ml-1.5">
                    {t(
                      BookingTypeLabel[
                        cellInfo?.bookingType as keyof typeof BookingTypeLabel
                      ]
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DesktopBookingsDrawer
            id={cellInfo.id}
            onClose={() => setOpenDrawerId(null)}
            open={openDrawerId === cellInfo.id}
          />
        </div>
      ))}
    </>
  );
};
