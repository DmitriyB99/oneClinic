import type { FC } from "react";
import { useContext, useMemo } from "react";
import { useQuery } from "react-query";

import { Button as AntButton } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { clinicsApi } from "@/shared/api/clinics";
import { ClinicDoctorStatus } from "@/shared/api/dtos";
import type { DoctorsDataType, TableColumnModels } from "@/shared/components";
import {
  Button,
  DefaultTable,
  InputSearch,
  SearchIcon,
  StatusTag,
} from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";

const doctorClinicStatuses = Object.keys(ClinicDoctorStatus).filter(
  (key) => key !== "NEW" && key !== "DISABLED" && key !== "NEW_DISABLED"
);

export const DesktopStaffDoctorsTable: FC = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Staff");

  const { data: clinicDoctorsData } = useQuery(["getAllClinicDoctors"], () =>
    clinicsApi
      .getClinicDoctors(user?.role_id, doctorClinicStatuses)
      .then((res) =>
        res.data.content.map((doctor) => ({
          id: doctor.doctorId,
          doctorName: doctor.fullName,
          specialization: !!doctor.specialityCodes
            ? doctor.specialityCodes.join(" ")
            : "",
          phoneNumber: doctor.phoneNumber,
          status: doctor.status,
        }))
      )
  );

  const columns = useMemo(
    () => [
      {
        title: t("Doctor"),
        dataIndex: "doctorName",
        key: "doctorName",
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
              placeholder={tDesktop("FindDoctorByName")}
              value={selectedKeys[0]}
            />
            <div className="mt-2 flex justify-between">
              <Button onClick={() => confirm()} size="s">
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
        title: t("Specialization"),
        dataIndex: "specialization",
        key: "specialization",
        filters: [
          { text: t("ENT"), value: t("ENT") },
          { text: t("Surgeon"), value: t("Surgeon") },
          { text: t("Therapist"), value: t("Therapist") },
        ],
        onFilter: (value: string, record: DoctorsDataType) =>
          record.specialization.indexOf(value) === 0,
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
        render: (data: string, doctor: DoctorsDataType) => (
          <StatusTag status={doctor.status} />
        ),
      },
      {
        title: t("Action"),
        key: "action",
        render: (record: DoctorsDataType) => (
          <AntButton
            onClick={() => router.push(`/desktop/admin/doctors/${record.id}`)}
            type="link"
          >
            {t("Look")}
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
      dataSource={clinicDoctorsData}
      locale={{
        emptyText: tDesktop("NoDoctorsYet"),
      }}
    />
  );
};
