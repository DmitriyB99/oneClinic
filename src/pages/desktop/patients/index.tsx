import type { ReactElement } from "react";
import { useContext, useMemo, useState } from "react";
import { useQuery } from "react-query";

import { Button as AntButton } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import type { GetServerSidePropsContext } from "next";
import { useTranslations } from "next-intl";

import { DesktopPatientNewDrawer } from "@/entities/desktopDrawer";
import { clinicsApi } from "@/shared/api/clinics";
import type { PatientsDataType, TableColumnModels } from "@/shared/components";
import {
  Button,
  DefaultTable,
  InputSearch,
  SearchIcon,
} from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";
import { DesktopLayout } from "@/shared/layout";
export default function DesktopPatientsPage() {
  const [open, setOpen] = useState(false);
  const { user } = useContext(UserContext);

  const { data: clinicPatientsData } = useQuery(["getAllClinicPatients"], () =>
    clinicsApi.getClinicPatients(user?.role_id).then((res) =>
      res.data.content.map((patient) => ({
        patientName: patient.fullname,
        phoneNumber: patient.phoneNumber,
      }))
    )
  );

  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Patients");

  const columns = useMemo(
    () => [
      {
        title: t("Patient"),
        dataIndex: "patientName",
        key: "patientName",
        render: (name: string) => (
          <div className=" text-colorPrimaryBase">{name}</div>
        ),
        filterIcon: () => <SearchIcon size="xs" />,
        onFilter: (value: string, record: PatientsDataType) =>
          record.patientName.toLowerCase().includes(value.toLowerCase()),
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
              placeholder={tDesktop("FindPatientByName")}
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
      },
      {
        title: t("PhoneNumber"),
        dataIndex: "phoneNumber",
        key: "phoneNumber",
      },
      {
        title: t("Action"),
        key: "action",
        render: () => (
          <AntButton type="link" onClick={() => setOpen(true)}>
            {t("Look")}
          </AntButton>
        ),
      },
    ],
    [t, tDesktop]
  );

  return (
    <>
      <div className="w-full px-6">
        <div className="my-4">
          <span className="text-secondaryText">{t("Main")} /</span>{" "}
          {t("Patients")}
        </div>
        <div className="text-Bold32">
          {t("AmountOffPatients", { amount: clinicPatientsData?.length ?? 0 })}
        </div>
        <div className="mt-8 flex">
          <Button className="!h-10 rounded-lg px-4 py-0">
            {t("PlusAddPatient")}
          </Button>
          <Button
            className="ml-4 !h-10 rounded-lg px-4 py-0"
            variant="outline"
            outlineDanger
          >
            {t("Delete")}
          </Button>
        </div>
        <DefaultTable
          columns={columns as ColumnsType<TableColumnModels>}
          locale={{
            emptyText: tDesktop("NoPatientsYet"),
          }}
          className="mt-6"
          dataSource={clinicPatientsData}
          pagination={{ pageSize: 8 }}
        />
      </div>
      <DesktopPatientNewDrawer onClose={() => setOpen(false)} open={open} />
    </>
  );
}

DesktopPatientsPage.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout hideSidebar={false}>{page}</DesktopLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}
