import { useMemo } from "react";
import type { FC } from "react";

import { Table as AntdTable } from "antd";
import type { ColumnProps } from "antd/es/table";
import clsx from "clsx";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import { BookingTableRender } from "./BookingTableRender";
import type { BookingData, BookingType, BookingTableProps } from "./props";

const workTimes = [
  "08:00",
  "08:20",
  "08:40",
  "09:00",
  "09:20",
  "09:40",
  "10:00",
  "10:20",
  "10:40",
  "11:00",
  "11:20",
  "11:40",
  "12:00",
  "12:20",
  "12:40",
  "13:00",
  "13:20",
  "13:40",
  "14:00",
  "14:20",
  "14:40",
  "15:00",
  "15:20",
  "15:40",
  "16:00",
  "16:20",
  "16:40",
  "17:00",
  "17:20",
  "17:40",
  "18:00",
  "18:20",
  "18:40",
  "19:00",
  "19:20",
  "19:40",
  "20:00",
  "20:20",
  "20:40",
  "21:00",
  "21:20",
  "21:40",
  "22:00",
  "22:20",
  "22:40",
  "23:00",
  "23:20",
  "23:40",
  "00:00",
  "00:20",
  "00:40",
  "01:00",
  "01:20",
  "01:40",
  "02:00",
  "02:20",
  "02:40",
  "03:00",
  "03:20",
  "03:40",
  "04:00",
  "04:20",
  "04:40",
  "05:00",
  "05:20",
  "05:40",
  "06:00",
  "06:20",
  "06:40",
  "07:00",
  "07:20",
  "07:40",
];

const tableDataSource = workTimes.map((time) => ({
  key: time,
  workTime: time,
}));

export const BookingTable: FC<BookingTableProps> = ({
  data,
  className,
  ...rest
}) => {
  const t = useTranslations("Common");
  const columns: ColumnProps<BookingType>[] = useMemo(() => {
    const columnDateHeads = [];

    for (let day = 0; day < 7; day++) {
      const nextDate = dayjs().add(day, "day");
      columnDateHeads.push(nextDate);
    }
    return [
      {
        title: t("Time"),
        dataIndex: "workTime",
        key: "time",
        fixed: "left",
        width: 113,
      },
      ...columnDateHeads.map((day) => ({
        title: () => (
          <div className="capitalize">{day.format("DD MMMM YYYY")}</div>
        ),
        dataIndex: day.format("DDMMYY"),
        key: day.format("DDMMYY"),
        render: (matchingData: BookingData[]) => (
          <BookingTableRender data={matchingData} />
        ),
      })),
    ];
  }, [t]);

  console.log("data", data);

  const updatedDataSource = useMemo(() => {
    const dataSourceCopy = [...tableDataSource];

    data?.forEach((el) => {
      const matchingData: BookingType = dataSourceCopy.find(
        (entry) => entry.workTime === dayjs(el.fromTime).format("HH:mm")
      ) as BookingType;

      if (matchingData) {
        const dateKey = dayjs(el.fromTime).format("DDMMYY");

        const bookingList: BookingData[] = matchingData[
          dateKey
        ] as BookingData[];

        if (!bookingList) {
          const fistBooking = [];
          fistBooking.push(el);
          matchingData[dateKey] = fistBooking;
        } else {
          if (!bookingList.find((booking) => booking === el)) {
            bookingList.push(el);
            matchingData[dateKey] = bookingList;
          }
        }
      }
    });

    return dataSourceCopy;
  }, [data]);

  return (
    <AntdTable
      {...rest}
      className={clsx("absolute left-0", className)}
      columns={columns}
      dataSource={updatedDataSource}
      scroll={{ x: 1793, y: 600 }}
      pagination={false}
    />
  );
};
