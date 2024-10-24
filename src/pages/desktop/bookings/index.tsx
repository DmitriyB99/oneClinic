import type { ReactElement } from "react";
import { useContext, useMemo, useState } from "react";
import { useQuery } from "react-query";

import dayjs from "dayjs";
import type { GetServerSidePropsContext } from "next";
import { useTranslations } from "next-intl";

import {
  DesktopNewBookingDrawer,
  DesktopFiltersDrawer,
} from "@/entities/desktopDrawer";
import { appointmentBookingApi } from "@/shared/api/appointmentBooking";
import { Button, BookingTable, FilterIcon } from "@/shared/components";
import { dateTimeWithOffset } from "@/shared/config";
import { UserContext } from "@/shared/contexts/userContext";
import { DesktopLayout } from "@/shared/layout";
export default function DesktopBookingPage() {
  const [open, setOpen] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [hideCancelBookings, setHideCancelBookings] = useState(false);
  const { user } = useContext(UserContext);
  const isClinic = useMemo(() => user?.role === "clinic", [user]);
  const userRole = useMemo(
    () => (isClinic ? "clinicId" : "doctorProfileId"),
    [isClinic]
  );

  const t = useTranslations("Common");

  const { data: doctorConsultationsData } = useQuery(
    ["getAllConsultations"],
    () =>
      appointmentBookingApi
        .getAllConsultations({
          fromTime: dayjs(new Date()).format(dateTimeWithOffset),
          toTime: dayjs(new Date()).add(7, "day").format(dateTimeWithOffset),
          [userRole]: user?.role_id,
        })
        .then((res) =>
          res.data.content.map(
            ({
              bookingConsultationSlotId,
              reservedFullname,
              fromTime,
              toTime,
              consultationType,
              consultationStatus,
            }) => ({
              id: bookingConsultationSlotId,
              name: reservedFullname,
              fromTime: fromTime,
              toTime: toTime,
              bookingType: consultationType,
              bookingStatus: consultationStatus !== "CREATED",
            })
          )
        )
  );

  const filteredConsultationsData = useMemo(() => {
    if (hideCancelBookings) {
      return doctorConsultationsData?.filter(
        (consultation) => consultation.bookingStatus === false
      );
    }
    return doctorConsultationsData;
  }, [hideCancelBookings, doctorConsultationsData]);

  return (
    <>
      <div className="w-full px-6">
        <div className="my-4">{isClinic ? t("Bookings") : t("MyBookings")}</div>
        <div className="relative bg-white p-6">
          <div className="mb-6 flex justify-between">
            <div className="text-Bold32">{t("Bookings")}</div>
            <div className="flex items-center">
              <Button
                className="relative h-fit w-fit cursor-pointer !p-2"
                transparent
                onClick={() => setOpenFilters(true)}
              >
                <div className="absolute -right-1 -top-0 w-6 rounded-full bg-red text-center text-Bold11 text-white">
                  6
                </div>
                <FilterIcon />
              </Button>
              <Button
                className="ml-6 !h-10 rounded-lg px-4 py-0"
                onClick={() => setOpen(true)}
              >
                {filteredConsultationsData?.length === 0
                  ? `+ ${t("AddBooking")}`
                  : `+ ${t("NewBooking")}`}
              </Button>
            </div>
          </div>
          <BookingTable data={filteredConsultationsData} />
        </div>
      </div>
      <DesktopNewBookingDrawer onClose={() => setOpen(false)} open={open} />
      <DesktopFiltersDrawer
        onClose={() => setOpenFilters(false)}
        onSubmit={(filter) => setHideCancelBookings(filter)}
        open={openFilters}
      />
    </>
  );
}

DesktopBookingPage.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout hideSidebar={false}>{page}</DesktopLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}
