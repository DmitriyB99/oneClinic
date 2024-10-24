import type { FC } from "react";
import { useState, useRef, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Input, Space, Table, Button as But, notification } from "antd";
import type { IconType } from "antd/es/notification/interface";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import Link from "next/link";
import { useTranslations } from "next-intl";

import type { DoctorProfile } from "@/entities/clinics";
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
  speciality: string;
  status: boolean;
  telephone: string | number;
}

export const AdminDoctorProfilesComponent: FC = () => {
  const [, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const searchInput = useRef<InputRef>(null);
  const [selectedDoctors, setSelectedDoctors] = useState<React.Key[]>([]);
  const [api, contextHolder] = notification.useNotification();
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
          placeholder={t("Search")}
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
              setSearchText((selectedKeys as string[])[0]);
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
    /* eslint-disable  @typescript-eslint/no-explicit-any */
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
      title: t("Doctor"),
      ...getColumnSearchProps("fullName"),
      render: (profile: DoctorProfile) => (
        <span>
          {profile.fullName
            ? profile.fullName
            : `${profile.firstName} ${profile.lastName}`}
        </span>
      ),
    },
    {
      title: t("Specialization"),
      dataIndex: "specialityCodes",
      ...getColumnSearchProps("specialityCodes"),
      render: (spec: string[]) =>
        spec.map((sp: string) => (
          <span key={sp} className="text-black">
            {sp}
            {", "}
          </span>
        )),
    },
    {
      title: t("PhoneNumber"),
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
      dataIndex: "doctorId",
      render: (link: string) => (
        <Link href={`/desktop/admin/doctors/${link}`}>{t("Look")}</Link>
      ),
    },
  ];

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedDoctors(newSelectedRowKeys);
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

  const { mutate: removeDoctor } = useMutation(
    ["removeDoctor"],
    (id: string) => superAdminApis.removeDoctor(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["getDoctors"]);
        queryClient.invalidateQueries(["getAwaitsDoctors"]);
        openNotification(tDesktop("DoctorRemoved"), "success");
      },
      onError() {
        openNotification(tDesktop("DoctorRemovedError"), "error");
      },
    }
  );

  const handleChangeStatus = () => {
    (selectedDoctors ?? []).forEach(async (id: React.Key) => {
      await removeDoctor(id as string);
    });
  };

  const { data: doctors, isSuccess } = useQuery(["getDoctors"], () =>
    superAdminApis
      .getDoctor({})
      .then((res) =>
        res.data.content.map((doctor) => ({ ...doctor, key: doctor.doctorId }))
      )
  );

  const { data: awaitsDoctors } = useQuery(["getAwaitsDoctors"], () =>
    superAdminApis.getAwaitsDoctors().then((res) =>
      res.data.content.map((doctor) => ({
        ...doctor,
        key: doctor.doctorId,
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
        <span className="m-1">{t("Doctors")}</span>
      </div>
      <div className="my-10 flex flex-row items-center justify-between">
        <p className="m-0 text-Bold32">{t("Doctors")}</p>
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
            onClick={handleChangeStatus}
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
        {isSuccess && (
          <Table
            rowSelection={{
              type: "checkbox",
              ...{ selectedDoctors, onChange: onSelectChange },
            }}
            dataSource={[...(awaitsDoctors ?? []), ...doctors]}
            /* eslint-disable  @typescript-eslint/no-explicit-any */
            columns={columns as ColumnsType<DoctorProfile>}
            pagination={{}}
          />
        )}
      </div>
    </div>
  );
};
