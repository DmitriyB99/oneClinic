import type { FC } from "react";
import { useMemo } from "react";

import { Button as AntButton, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import type { DoctorsDataType, TableColumnModels } from "@/shared/components";
import {
  Button,
  DefaultTable,
  InputSearch,
  SearchIcon,
} from "@/shared/components";

export const DesktopStaffManagersTable: FC = () => {
  const router = useRouter();
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Staff");

  const columns = useMemo(
    () => [
      {
        title: tDesktop("Manager"),
        dataIndex: "managerName",
        key: "managerName",
        render: (name: string) => (
          <div className=" text-colorPrimaryBase">{name}</div>
        ),
        filterIcon: () => <SearchIcon size="xs" />,
        filterDropdown: ({
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
        }: FilterDropdownProps) => (
          <div className="flex flex-col p-2">
            <InputSearch
              onChange={(elem) =>
                setSelectedKeys(elem.target.value ? [elem.target.value] : [])
              }
              allowClear={false}
              placeholder={tDesktop("FindManagerByName")}
              value={selectedKeys[0]}
            />
            <div className="mt-2 flex justify-between">
              <Button
                onClick={() => {
                  confirm();
                }}
                size="s"
              >
                {t("Search")}
              </Button>
              <Button
                onClick={() => {
                  clearFilters?.();
                  confirm();
                }}
                className="!bg-gray-3"
                size="s"
              >
                {t("ThrowOff")}
              </Button>
            </div>
          </div>
        ),
        onFilter: (value: string, record: DoctorsDataType) =>
          record.doctorName.toLowerCase().includes(value.toLowerCase()),
      },
      {
        title: t("PhoneNumber"),
        dataIndex: "phoneNumber",
        key: "phoneNumber",
      },
      {
        title: t("Status"),
        dataIndex: "statusLabel",
        key: "statusLabel",
        render: (tag: string) => (
          <Tag color={tag} key={tag}>
            {tag}
          </Tag>
        ),
      },
      {
        title: t("Action"),
        key: "action",
        render: () => (
          <AntButton onClick={() => router.push("bookings")} type="link">
            Посмотреть
          </AntButton>
        ),
      },
    ],
    [router, t, tDesktop]
  );

  return (
    <DefaultTable
      selectDataList={(datalist) => datalist}
      columns={columns as ColumnsType<TableColumnModels>}
      className="mt-2"
      dataSource={[]}
      locale={{
        emptyText: tDesktop("NoManagersYet"),
      }}
    />
  );
};
