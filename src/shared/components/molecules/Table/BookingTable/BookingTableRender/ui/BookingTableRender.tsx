import { useCallback, useContext, useMemo, useState } from "react";
import type { FC } from "react";

import clsx from "clsx";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import {
  DesktopNewBookingDrawer,
  DesktopBookingsDrawer,
} from "@/entities/desktopDrawer";
import type { BookingData } from "@/shared/components";
import {
  Heartbeat,
  OnlineMeeting,
  Button,
  FirstAidKit,
  Popover,
} from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";

import { OtherCellsWindow } from "./OtherCellsWindow";
import type { BookingTableRenderProps } from "../models/BookingTableRenderProps";

enum BookingTypeLabel {
  "AWAY" = "HouseCall2",
  "OFFLINE" = "ClinicAdmission",
  "ONLINE" = "OnlineConsultation2",
}

export const BookingTableRender: FC<BookingTableRenderProps> = ({ data }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const [newBookingOpen, setNewBookingOpen] = useState(false);
  const { user } = useContext(UserContext);
  const t = useTranslations("Common");
  const isClinic = useMemo(() => user?.role === "clinic", [user]);
  const cellInfo: BookingData[] | undefined = useMemo(() => {
    const formattedData = data?.map((item) => {
      const formattedFromTime = dayjs(item.fromTime).format("HH:mm");
      const formattedToTime = dayjs(item.toTime).format("HH:mm");

      return {
        name: item.name,
        id: item.id,
        fromTime: formattedFromTime,
        toTime: formattedToTime,
        bookingType: item.bookingType,
        bookingStatus: item.bookingStatus,
        soon: item.soon,
      };
    });

    return formattedData;
  }, [data]);

  const router = useRouter();
  const bookingPageOpen = useCallback(
    () =>
      isClinic
        ? setOpenDrawer(!openDrawer)
        : router.push({
            pathname: `bookings/${cellInfo?.[0].id}`,
          }),
    [openDrawer, router, cellInfo, isClinic]
  );

  const [cellInfoLength, otherCells] = useMemo(
    () => [(cellInfo?.length as number) - 1, cellInfo?.slice(1)],
    [cellInfo]
  );

  if (!data) {
    return (
      <div className="relative h-20">
        <div className="group absolute -left-4 -top-4 flex h-[113px] w-60 cursor-pointer justify-center hover:bg-brand-light">
          <Button
            onClick={() => setNewBookingOpen(true)}
            className="mt-5 hidden h-8 rounded-xl bg-positiveStatus px-7 py-1 text-Regular14 text-white hover:!text-white active:!bg-brand-secondary group-hover:inline-block"
          >
            {t("NewBooking")}
          </Button>
        </div>
        <DesktopNewBookingDrawer
          onClose={() => setNewBookingOpen(false)}
          open={newBookingOpen}
        />
      </div>
    );
  }

  return (
    <>
      <div className="relative h-20 cursor-pointer" onClick={bookingPageOpen}>
        <div
          className={clsx("absolute -left-4 h-20 w-1 rounded-l", {
            "bg-red": cellInfo?.[0].bookingStatus,
            "bg-positiveStatus": !cellInfo?.[0].bookingStatus,
          })}
        />
        <div className="mb-1 truncate font-semibold">{cellInfo?.[0].name}</div>
        <div className="mb-2 flex h-6 items-center gap-1">
          <div className="text-Regular12 text-secondaryText">
            {cellInfo?.[0].fromTime} - {cellInfo?.[0].toTime}
          </div>
          {cellInfo?.[0].soon && (
            <div className="flex items-center justify-start text-Regular12 text-red">
              <div className="mr-2 flex items-center rounded-3xl bg-lightWarning px-2 py-1">
                ⏰ {t("AfterAmountMinutes", { amount: 10 })}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-start text-Regular12">
          {cellInfo?.[0].bookingStatus ? (
            <div className="py-1 text-secondaryText">
              {t(
                BookingTypeLabel[
                  cellInfo[0].bookingType as keyof typeof BookingTypeLabel
                ]
              )}
              <span className="text-red">{t("Cancelled")}</span>
            </div>
          ) : (
            <div
              className={clsx("mr-2 flex items-center rounded-3xl px-2 py-1", {
                "bg-lightWarning": cellInfo?.[0].bookingType === "OFFLINE",
                "bg-lightNeutral": cellInfo?.[0].bookingType === "ONLINE",
                "bg-lightPositive": cellInfo?.[0].bookingType === "AWAY",
              })}
            >
              {cellInfo?.[0].bookingType === "OFFLINE" && (
                <Heartbeat size="sm" />
              )}
              {cellInfo?.[0].bookingType === "ONLINE" && (
                <OnlineMeeting size="sm" />
              )}
              {cellInfo?.[0].bookingType === "AWAY" && (
                <FirstAidKit size="sm" />
              )}
              <div className="ml-1.5">
                {t(
                  BookingTypeLabel[
                    cellInfo?.[0].bookingType as keyof typeof BookingTypeLabel
                  ]
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {cellInfoLength > 0 && (
        <Popover
          content={
            <OtherCellsWindow
              isClinic={isClinic}
              data={otherCells}
              setOpenPopover={setOpenPopover}
            />
          }
          placement="rightTop"
          className="!z-0"
          open={openPopover}
        >
          <div
            className="absolute right-4 top-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-0 hover:brightness-90"
            onClick={() => setOpenPopover(!openPopover)}
          >
            +{cellInfoLength}
          </div>
        </Popover>
      )}
      <DesktopBookingsDrawer
        id={data[0].id}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      />
    </>
  );
};
