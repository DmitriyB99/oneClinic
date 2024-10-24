import type { FC } from "react";

import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button, HomeHeartIcon, SearchIcon } from "@/shared/components";

interface DataType {
  action: string;
  key: React.Key;
  name: string;
  speciality: string;
  status: boolean;
  telephone: string | number;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Врач",
    dataIndex: "name",
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: "Специализация",
    dataIndex: "speciality",
  },
  {
    title: "Номер телефона",
    dataIndex: "telephone",
  },
  {
    title: "Статус",
    dataIndex: "status",
    render: (status: boolean) =>
      !status ? (
        <Button
          className="!h-7 !rounded-sm !p-1 !px-2 !text-Regular12"
          variant="outline"
        >
          Не активный
        </Button>
      ) : (
        <Button
          className="!h-7 !rounded-sm !p-1 !px-2 !text-Regular12"
          variant="tinted"
        >
          Активный
        </Button>
      ),
  },
  {
    title: "Действие",
    dataIndex: "action",
    render: (link: string) => (
      <Link href={`/desktop/admin/doctors/${link}`}>Посмотреть</Link>
    ),
  },
];

const data = [
  {
    key: "1",
    name: "Калдыков Рахым",
    speciality: "ЛОР, терапевт",
    telephone: "+7 777 168 72 12",
    status: false,
    action: "123123",
  },
];

export const AdminDictionaryComponent: FC = () => {
  const t = useTranslations("Common");

  return (
    <div className="w-full px-6">
      <div className="my-4 flex w-full items-center text-Regular12 text-secondaryText">
        <HomeHeartIcon size="sm" color="gray-icon" />
        <span className="m-1">{t("Main")}</span> /{" "}
        <span className="m-1">{t("Patients")}</span>
      </div>
      <div className="my-10 flex flex-row items-center justify-between">
        <p className="m-0 text-Bold32">{t("Guide")}</p>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex gap-4">
          <Button
            className="!h-10 !rounded-md !border-borderLight !px-4 !text-Regular16"
            variant="primary"
          >
            + {t("AddDoctor")}
          </Button>
          <Button
            className="!h-10 !rounded-md !border-solid !border-red !bg-white !px-4 !text-Regular16 !text-red"
            variant="primary"
            danger
          >
            {t("Delete")}
          </Button>
        </div>
        <div>
          <Button
            className="flex !h-10 items-center justify-center !rounded-md !bg-white"
            variant="outline"
          >
            <SearchIcon size="md" />
          </Button>
        </div>
      </div>
      <div className="mt-7 w-full">
        <Table
          rowSelection={{ type: "checkbox" }}
          dataSource={data}
          columns={columns}
          pagination={{}}
        />
      </div>
    </div>
  );
};
