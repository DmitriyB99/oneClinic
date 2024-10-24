import { useMemo, useState } from "react";
import type { ReactElement } from "react";
import { useQuery } from "react-query";

import { Alert, Tag } from "antd";
import dayjs from "dayjs";
import type { GetServerSidePropsContext } from "next";

import { doctorsApi } from "@/shared/api";
import { DefaultTable, SegmentedControlDesktop } from "@/shared/components";
import type { EarningDataType } from "@/shared/components";
import { dateTimeWithOffset } from "@/shared/config";
import { DesktopLayout } from "@/shared/layout";

const tabItems = [
  { label: "Сегодня", value: "today" },
  { label: "Неделя", value: "week" },
  { label: "Период", value: "period" },
];

const tableData = [
  {
    patientName: "Кажегельдиев Арыстан",
    date: "2023-06-21T07:20:00.000",
    serviceType: "Онлайн консультация",
    serviceCount: "first",
    price: "5000",
    earning: "3000",
  },
  {
    patientName: "Карлыгаш Дуйсенова",
    date: "2023-06-29T13:20:00.000",
    serviceType: "Прием в клинике",
    serviceCount: "second",
    price: "9000",
    earning: "6000",
  },
  {
    patientName: "Кажегельдиев Арыстан",
    date: "2023-07-21T11:20:00.000",
    serviceType: "Вызов на дом",
    serviceCount: "first",
    price: "9000",
    earning: "6000",
  },
];

const repeatedTableData = Array.from({ length: 10 }, () => [
  ...tableData,
]).flat();

const rightNumberFormat = (number: string) =>
  new Intl.NumberFormat("en-US").format(parseInt(number)).replace(/,/g, " ");

const columns = [
  {
    title: "Пациент",
    dataIndex: "patientName",
    key: "patientName",
    render: (name: string) => <a>{name}</a>,
  },
  {
    title: "Услуга",
    dataIndex: "service",
    key: "service",
    render: (serviceData: string[]) => (
      <div className="flex justify-between">
        {serviceData[0]}
        <Tag color={serviceData[2]}>{serviceData[1]}</Tag>
      </div>
    ),
  },
  {
    title: "Дата и время",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Стоимость /  мой заработок",
    dataIndex: "earnings",
    key: "earnings",
    render: (earningsData: string[]) => (
      <div>
        {rightNumberFormat(earningsData[0])} ₸ /{" "}
        <span className="text-positiveStatus">
          {rightNumberFormat(earningsData[1])} ₸
        </span>
      </div>
    ),
  },
];

const IncomeTimeRange = {
  today: dayjs(),
  week: dayjs().add(7, "day"),
  period: dayjs().add(1, "month"),
};

enum TimeRange {
  period = "period",
  today = "today",
  week = "week",
}
export default function DesktopEarningsPage() {
  const [activeTab, setActiveTab] = useState<TimeRange>(TimeRange.today);
  const { data: doctorIncomeData } = useQuery(
    ["getDoctorIncome", activeTab],
    () =>
      doctorsApi
        .getDoctorIncome(
          IncomeTimeRange["today"].format(dateTimeWithOffset),
          IncomeTimeRange[activeTab].format(dateTimeWithOffset)
        )
        .then((res) => res.data.earningsSum)
  );

  const dataSource: EarningDataType[] = useMemo(
    () =>
      repeatedTableData.map((item) => {
        const serviceData: string[] = [];
        switch (item.serviceCount) {
          case "first":
            serviceData.push(...["Первичный", "green"]);
          case "second":
            serviceData.push(...["Повторный", "purple"]);
        }
        return {
          patientName: item.patientName,
          service: [item.serviceType, ...serviceData],
          date: dayjs(item.date).format("DD.MM.YYYY HH:mm"),
          earnings: [item.price, item.earning],
        };
      }),
    []
  );
  return (
    <div className="w-full px-6">
      <div className="my-4">Статистика</div>
      <div className="my-4 flex items-center justify-between">
        <div>
          <div className="text-Bold32">
            Чистый заработок: {doctorIncomeData}
          </div>
          <div className="text-Medium14 text-secondaryText">
            Деньги автоматически поступают на вашу карту каждое утро
          </div>
        </div>
        <SegmentedControlDesktop
          options={tabItems}
          size="large"
          value={activeTab}
          onChange={(value) => setActiveTab(value as TimeRange)}
          isDefault
          className="!bg-segmentedGroupBg"
        />
      </div>
      <Alert
        message="OneClinic Pro: Увеличьте процент заработка и получите доступ к дополнительным сервисам"
        type="info"
        showIcon
        closable
        className="my-4"
      />
      <DefaultTable
        dataSource={dataSource}
        pagination={{ pageSize: 9 }}
        columns={columns}
      />
    </div>
  );
}

DesktopEarningsPage.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout hideSidebar={false}>{page}</DesktopLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}
