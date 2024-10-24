import type { FC, Key } from "react";
import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Input, Space, Table, notification, Button as But } from "antd";
import type { IconType } from "antd/es/notification/interface";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { superAdminApis } from "@/shared/api";
import type { ClinicDoctorStatus } from "@/shared/api/dtos";
import {
  Button,
  HomeHeartIcon,
  SearchIcon,
  StatusTag,
} from "@/shared/components";

interface DataType {
  action: string;
  key: React.Key;
  name: string;
  city: string;
  status: string;
}

export const AdminClinicComponent: FC = () => {
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [search, setSearch] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  }
  const [selectedClinics, setSelectedClinics] = useState<any>([]);
  const queryClient = useQueryClient();
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Admin");

  const getColumnSearchProps = (dataIndex: string): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{ padding: 8 }}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={tDesktop("SearchByClinicName")}
          value={selectedKeys[0]}
          onChange={(event) =>
            setSelectedKeys(event.target.value ? [event.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <But
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, color: "black" }}
          >
            {t("Search")}
          </But>
          <But
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              confirm({ closeDropdown: false });
              setSearchedColumn(dataIndex);
            }}
            size="small"
            style={{ width: 90 }}
          >
            {t("ThrowOff")}
          </But>
          <But
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            {t("Close")}
          </But>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record: any) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => (searchedColumn === dataIndex ? text : text),
  });

  const columns: ColumnsType<DataType> = [
    {
      title: t("Name"),
      dataIndex: "name",
      render: (text: string) => <a>{text}</a>,
      ...getColumnSearchProps("name"),
    },
    {
      title: tDesktop("ManagerPhone"),
      dataIndex: "phoneNumber",
      ...getColumnSearchProps("phoneNumber"),
    },
    {
      title: t("Status"),
      dataIndex: "status",
      render: (status: ClinicDoctorStatus) => <StatusTag status={status} />,
    },
    {
      title: t("Action"),
      dataIndex: "clinicId",
      render: (link: string) => (
        <Link href={`/desktop/admin/clinic/${link}`}>{t("Look")}</Link>
      ),
    },
  ];

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: string
  ) => {
    confirm();
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const openNotification = useCallback(
    (message: string, type: IconType) => {
      api["success"]({
        message: message,
        placement: "topRight",
        type,
      });
    },
    [api]
  );

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedClinics(newSelectedRowKeys);
  };

  const { mutate: changedClinics } = useMutation(
    ["changedClinics"],
    (id: string) => superAdminApis.putClinicStatus(id, "BANNED"),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["newClinicData"]);
        queryClient.invalidateQueries(["clinicData"]);
        openNotification(tDesktop("ClinicStatusSuccesChanged"), "success");
      },
      onError() {
        openNotification(tDesktop("StatusChangeError"), "error");
      },
    }
  );

  const handleChangeStatus = async () => {
    (selectedClinics ?? []).map(async (id: string) => {
      await changedClinics(id);
    });
  };

  const { data: clinics } = useQuery(["clinicData"], () =>
    superAdminApis.getClinics().then((res) =>
      res.data.content.map(({ phoneNumbers, name, clinicId }) => ({
        key: clinicId,
        phoneNumber: phoneNumbers[0].phoneNumber ?? "-",
        name: name ?? "-",
        clinicId,
        status: "ACTIVE",
      }))
    )
  );

  const { data: newClinics } = useQuery(["newClinicData"], () =>
    superAdminApis.getNewClinics().then((res) =>
      res.data.content.map(({ name, phoneNumber, clinicId }) => ({
        key: clinicId,
        name: name ?? "-",
        phoneNumber: phoneNumber ?? "-",
        clinicId,
        status: "NEW_DISABLED",
      }))
    )
  );

  return (
    <div className="w-full px-6">
      {contextHolder}
      <div className="my-4 flex w-full items-center text-Regular12 text-secondaryText">
        <HomeHeartIcon size="sm" color="gray-icon" />
        <span className="m-1">{t("Main")}</span> /{" "}
        <span className="m-1">{t("Clinics")}</span>
      </div>
      <div className="my-10 flex flex-row items-center justify-between">
        <p className="m-0 text-Bold32">{t("Clinics")}</p>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex gap-4">
          <Button
            className="!h-10 !rounded-md !border-borderLight !px-4 !text-Regular16"
            variant="primary"
          >
            + {t("AddClinic")}
          </Button>
          <Button
            className="!h-10 !rounded-md !border-solid !border-red !bg-white !px-4 !text-Regular16 !text-red"
            variant="primary"
            danger={true}
            onClick={handleChangeStatus}
          >
            {t("Delete")}
          </Button>
        </div>
        <div>
          <Button
            className="flex !h-10 items-center justify-center !rounded-md !bg-white"
            variant="outline"
            onClick={() => setSearch(!search)}
          >
            <SearchIcon size="md" />
          </Button>
        </div>
      </div>
      <div className="mt-7 w-full">
        <Table
          rowSelection={{
            type: "checkbox",
            ...{ selectedClinics, onChange: onSelectChange },
          }}
          dataSource={clinics?.concat(newClinics as any)}
          columns={columns as any}
        />
      </div>
    </div>
  );
};
