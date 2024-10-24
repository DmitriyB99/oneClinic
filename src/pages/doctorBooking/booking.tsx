import { useState } from "react";

import clsx from "clsx";
import dayjs from "dayjs";
import type { GetServerSidePropsContext } from "next";
import { useTranslations } from "next-intl";

import { DoctorBookingDialog } from "@/entities/bookings";
import {
  Avatar,
  Button,
  Calendar,
  Chips,
  Heartbeat,
  Island,
} from "@/shared/components";

const chipLabelsData = [
  {
    label: "Все записи",
    isActive: true,
  },
  {
    label: "Предстоящие",
  },
  {
    label: "Уже прошедшие",
  },
  {
    label: "Отмененные",
  },
];

const allBookingsData = [
  {
    location: "Прием в клинике",
    bookStatus: "Идет консультация 00:15",
    clientName: "Акерке Айбарова",
    clientType: "Пациент",
    bookingTime: "14:30",
    bookingDay: "Сегодня",
  },
  {
    location: "Прием в клинике",
    bookStatus: "⏰ Через 10 минут",
    clientName: "Акерке Айбарова",
    clientType: "Пациент",
    bookingTime: "14:30",
    bookingDay: "Сегодня",
  },
  {
    location: "Прием в клинике",
    bookStatus: "Завершена",
    clientName: "Акерке Айбарова",
    clientType: "Пациент",
    bookingTime: "14:30",
    bookingDay: "Сегодня",
  },
  {
    location: "Прием в клинике",
    bookStatus: "Отменена",
    clientName: "Акерке Айбарова",
    clientType: "Пациент",
    bookingTime: "14:30",
    bookingDay: "Сегодня",
  },
];

type BookingListTypes =
  | "Все записи"
  | "Предстоящие"
  | "Уже прошедшие"
  | "Отмененные";

export default function MyBookingPage() {
  const t = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const [, setbookingsList] = useState<BookingListTypes>("Все записи");

  return (
    <>
      <Island className="mb-2">
        <Calendar
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onChange={() => {}}
          bookDates={[{ books: 3, day: dayjs().format("MM D") }]}
        />
      </Island>
      <Island>
        <h3 className="mb-2 text-Bold20 text-dark">
          Сегодня,{" "}
          <span className="capitalize">{dayjs().format("MMMM D")}</span>
        </h3>
        <Chips
          chipLabels={chipLabelsData}
          type="single"
          onChange={(chipLabels) =>
            setbookingsList((chipLabels as BookingListTypes[])?.[0])
          }
        />
        <div className="flex flex-col gap-4">
          {allBookingsData.map((bookings, index) => (
            <Island
              isCard
              key={index}
              className="!px-4"
              onClick={() => setOpen(true)}
            >
              <div className="flex items-center justify-start text-Regular12">
                <div className="mr-2 flex items-center rounded-3xl bg-lightWarning px-2 py-1">
                  <Heartbeat color="brand-icon" size="sm" />
                  <div className="ml-1.5">{bookings.location}</div>
                </div>
                <div
                  className={clsx("rounded-3xl px-2 py-1", {
                    "bg-lightNeutral text-neutralStatus":
                      bookings.bookStatus === "Идет консультация 00:15",
                    "bg-lightWarning text-red":
                      bookings.bookStatus === "⏰ Через 10 минут",
                    "bg-lightPositive text-positiveStatus":
                      bookings.bookStatus === "Завершена",
                    "bg-red text-white": bookings.bookStatus === "Отменена",
                  })}
                >
                  {bookings.bookStatus}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center justify-start">
                  <Avatar />
                  <div className="ml-3 flex flex-col">
                    <div className="mb-1 text-Regular16">Акерке Айбарова</div>
                    <div className="text-Regular12 text-secondaryText">
                      Пациент
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-Regular16">14:30</div>
                  <div className="text-Regular12 text-secondaryText">
                    Сегодня
                  </div>
                </div>
              </div>
            </Island>
          ))}
          <Button variant="secondary" className="w-full">
            Добавить запись
          </Button>
        </div>
      </Island>
      <DoctorBookingDialog
        openDoctorBookingDialog={open}
        setOpenDoctorBookingDialog={setOpen}
        title={t("ClientHasAppointmentAtClinic")}
        subtitle="3 марта в 13:30"
        reminderText="через 10 минут"
        personName="Евгений Кондратенко"
        clinicName="OneClinic"
        address="ул. Наурызбай батыра 50, 8 этаж, кв. 91"
        price="5 000 ₸"
        buttons={
          <>
            <Button variant="primary" className="mb-4 w-full">
              {t("StartConsultation")}
            </Button>
            <Button variant="secondary" className="mb-4 w-full">
              {t("TransferAppointment")}
            </Button>
            <Button variant="tertiary" className="mb-4 w-full text-red">
              {t("CancelEntry")}
            </Button>
          </>
        }
      />
    </>
  );
}

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
