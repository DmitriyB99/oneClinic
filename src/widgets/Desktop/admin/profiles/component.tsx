import type { FC, Key } from "react";
import { useState } from "react";
import { useQuery } from "react-query";

import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { superAdminApis } from "@/shared/api/superAdmin";
import { Button, HomeHeartIcon, SearchIcon } from "@/shared/components";
import type { PatientData } from "@/widgets/Desktop";

interface DataType extends PatientData {
  key: Key;
}

export const AdminProfileComponent: FC = () => {
  const [selectedProfiles, setSelectedProfiles] = useState<Key[]>([]);
  const t = useTranslations("Common");

  const router = useRouter();

  const { data: patients, isSuccess } = useQuery(["patientsData"], () =>
    superAdminApis.getPatients().then((res) =>
      res.data.content.map((profile) => ({
        ...profile,
        key: profile.userProfileId,
      }))
    )
  );

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    console.log(newSelectedRowKeys);
    setSelectedProfiles(newSelectedRowKeys);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: t("Patient"),
      dataIndex: "fullname",
      render: (name: string) => <>{name ?? "-"}</>,
    },
    {
      title: t("PhoneNumber"),
      dataIndex: "phoneNumber",
      render: (number: string) => <>{number ?? "-"}</>,
    },
    {
      title: t("Action"),
      dataIndex: "userId",
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      render: (link: string, record: any) => (
        <a
          onClick={() =>
            router.push({
              pathname: `/desktop/admin/profiles/${link}`,
              query: { userProfileId: record.userProfileId },
            })
          }
        >
          {t("Look")}
        </a>
      ),
    },
  ];

  return (
    <div className="w-full px-6">
      <div className="my-4 flex w-full items-center text-Regular12 text-secondaryText">
        <HomeHeartIcon size="sm" color="gray-icon" />
        <span className="m-1">{t("Main")}</span> /
        <span className="m-1">{t("Patients")}</span>
      </div>
      <div className="my-10 flex flex-row items-center justify-between">
        <p className="m-0 text-Bold32">{t("Patients")}</p>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex gap-4">
          <Button
            className="!h-10 !rounded-md !border-borderLight !px-4 !text-Regular16"
            variant="primary"
          >
            {t("PlusAddPatient")}
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
        {isSuccess && (
          <Table
            rowSelection={{
              type: "checkbox",
              ...{ selectedProfiles, onChange: onSelectChange },
            }}
            dataSource={patients}
            columns={columns}
          />
        )}
      </div>
    </div>
  );
};
