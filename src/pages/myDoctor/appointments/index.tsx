import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";

import dayjs from "dayjs";

import "dayjs/locale/ru";
dayjs.locale("ru");

import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { ConsultationCard } from "@/entities/consultationCard";
import { doctorBookingsApi } from "@/shared/api/doctor/bookings";
import type { ConsultationSlotData } from "@/shared/api/dtos";
import { Calendar, Chips, Island } from "@/shared/components";
import { dateFormat, systemDateWithoutTime, timeFormat } from "@/shared/config";

const MyDoctorAppointments: FC = () => {
  const router = useRouter();
  const [activeDate, setActiveDate] = useState<string>(
    dayjs(new Date()).format(systemDateWithoutTime)
  );
  const [appointmentStatus, setAppointmentStatus] =
    useState<null | string>(null);

  const chipLabels = useMemo(
    () => ["Все записи", "Предстоящие", "Отмененные", "Завершенные"],
    []
  );

  useState<ConsultationSlotData | null>(null);

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  const formatDate = (date) => {
    const today = dayjs().startOf("day");
    const selectedDate = dayjs(date).startOf("day");

    let formattedDate = dayjs(date).format("MMMM D");
    formattedDate = capitalizeFirstLetter(formattedDate);

    if (today.isSame(selectedDate)) {
      return `Сегодня, ${formattedDate}`;
    }

    return formattedDate;
  };

  const handleAppointmentClick = useCallback(
    (bookingData) => () => {
      router.push(`/myDoctor/booking/${bookingData.id}`);
    },
    [router]
  );

  const renderAppointment = useCallback(
    (appointment) => {
      const { id, patient, consultation_type, from_time, status } = appointment;
      const appointmentTime = dayjs(from_time).format(timeFormat);
      const appointmentDate = dayjs(from_time).format(dateFormat);

      return (
        <ConsultationCard
          key={id}
          status={status}
          name={`${patient?.name} ${patient?.surname}`}
          time={appointmentTime}
          date={appointmentDate}
          fromTime={from_time}
          type="Пациент"
          serviceType={consultation_type}
          imageUrl={patient?.photo_url ?? ""}
          onClick={handleAppointmentClick({
            ...appointment,
            from_time: `${appointmentDate} на ${appointmentTime}`,
          })}
        />
      );
    },
    [handleAppointmentClick]
  );

  const { data: bookings } = useQuery(
    ["getBookings", appointmentStatus, activeDate],
    () =>
      doctorBookingsApi
        .getBookings({
          start_date: activeDate,
          end_date: activeDate,
          status: appointmentStatus,
        })
        .then((res) => res.data)
  );

  return (
    <div className="bg-gray-2">
      <Island>
        <Calendar
          onChange={(date) => setActiveDate(date.format("YYYY-MM-DD"))}
          bookDates={[]}
        />
      </Island>

      <Island className="mt-4 !p-0">
        <div className="p-4 !pb-0 text-Bold20">{formatDate(activeDate)}</div>
        <Chips
          onChange={(value) => {
            const selectedChip = value[0];

            switch (selectedChip) {
              case "Все записи":
                setAppointmentStatus(null);
                break;
              case "Предстоящие":
                setAppointmentStatus("PAID");
                break;
              case "Завершенные":
                setAppointmentStatus("DONE");
                break;
              case "Отмененные":
                setAppointmentStatus("CANCELED");
                break;
              default:
                setAppointmentStatus(null);
            }
          }}
          chipLabels={chipLabels}
          type="single"
          defaultValue="Все записи"
          isCarousel={true}
          className="mb-0 pl-4"
        />
        {bookings && bookings.length ? (
          <div className="p-4">
            {bookings.map((appointment) => renderAppointment(appointment))}
          </div>
        ) : (
          <div className="p-4 text-Bold20">На сегодня нет записей</div>
        )}
      </Island>
    </div>
  );
};

export default MyDoctorAppointments;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}
