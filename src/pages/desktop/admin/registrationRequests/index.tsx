import { useCallback, useMemo, useState } from "react";
import type { ReactElement } from "react";
import { useQuery } from "react-query";

import { Button as AntButton, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import type { GetServerSidePropsContext } from "next";
import { useTranslations } from "next-intl";

import { DesktopRegRequestInfoDrawer } from "@/entities/desktopDrawer";
import { superAdminApis } from "@/shared/api";
import type {
  RegistrationRequestsDataType,
  TableColumnModels,
} from "@/shared/components";
import {
  Button,
  CheckCircleOutlinedIcon,
  CloseCircleOutlinedIcon,
  DefaultTable,
  InputSearch,
  MinusCircleOutlinedIcon,
  SearchIcon,
  TabsSaunet,
} from "@/shared/components";
import { DesktopLayout } from "@/shared/layout";
import type { RegistrationRequestModel } from "@/shared/pages/registrationRequest";

enum Status {
  Accepted = "Accepted",
  Rejected = "Rejected",
  Review = "Review",
}

export default function RegistrationRequestsPage() {
  const [open, setOpen] = useState(false);
  const [requestView, setRequestView] = useState<RegistrationRequestModel>();
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Admin");
  const [tabValue, setTabValue] = useState("clinics");

  const tabItems = useMemo(
    () => [
      {
        key: "doctors",
        label: t("Doctors"),
      },
      {
        key: "clinics",
        label: t("Clinics"),
      },
    ],
    [t]
  );

  const tagStatusDataMap: Record<Status, (string | JSX.Element)[]> = useMemo(
    () => ({
      [Status.Accepted]: [
        "success",
        t("Accepted"),
        <CheckCircleOutlinedIcon size="xs" key="check" />,
      ],
      [Status.Rejected]: [
        "error",
        t("Rejected2"),
        <CloseCircleOutlinedIcon size="xs" key="close" />,
      ],
      [Status.Review]: [
        "default",
        t("UnderСonsideration"),
        <MinusCircleOutlinedIcon size="xs" key="minus" />,
      ],
    }),
    [t]
  );

  const getTagStatus = useCallback(
    (status: Status) =>
      tagStatusDataMap[status] || ["default", t("UnderСonsideration")],
    [tagStatusDataMap, t]
  );

  const { data: clinicsReqData } = useQuery(
    ["getAllRegistrationRequests"],
    () =>
      superAdminApis.getNewClinics().then((res) =>
        res.data.content.map(({ name, phoneNumber }) => ({
          // TODO: fix hardcode after Bizhan change responce
          request: "364124",
          name: name,
          phoneNumber: phoneNumber ?? "",
          status: "NEW_DISABLED",
        }))
      )
  );

  const { data: doctorsReqData } = useQuery(["getAwaitsDoctors"], () =>
    superAdminApis.getAwaitsDoctors().then((res) =>
      res.data.content.map((doctor) => ({
        // TODO: fix hardcode after Bizhan change responce
        request: "364124",
        name: doctor.fullName ?? "",
        phoneNumber: doctor.phoneNumber ?? "",
        status: "NEW_DISABLED",
      }))
    )
  );

  const columns = useMemo(
    () => [
      {
        title: tDesktop("RequestNumber"),
        dataIndex: "request",
        key: "request",
        filterIcon: () => <SearchIcon size="xs" />,
        onFilter: (value: string, record: RegistrationRequestsDataType) =>
          record.request.toLowerCase().includes(value.toLowerCase()),
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
              placeholder={tDesktop("FindRequestByNumber")}
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
      },
      {
        title: tabValue === "doctors" ? t("Doctor") : t("Clinic"),
        dataIndex: "name",
        key: "name",
        filterIcon: () => <SearchIcon size="xs" />,
        onFilter: (value: string, record: RegistrationRequestsDataType) =>
          record.name.toLowerCase().includes(value.toLowerCase()),
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
              placeholder={tDesktop("FindClinicByName")}
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
        title: t("Status"),
        dataIndex: "statusLabel",
        key: "statusLabel",
        render: (tag: string, record: RegistrationRequestsDataType) => {
          const tagStatus = getTagStatus(record.status as Status);
          return (
            <Tag
              color={tagStatus[0] as string}
              icon={tagStatus[2]}
              key={tag}
              className="flex w-fit items-center gap-1"
            >
              {tagStatus[1]}
            </Tag>
          );
        },
      },
      {
        title: t("Action"),
        key: "action",
        render: (value: RegistrationRequestModel) => (
          <AntButton
            type="link"
            onClick={() => {
              setRequestView(value);
              setOpen(true);
            }}
          >
            {t("Look")}
          </AntButton>
        ),
      },
    ],
    [getTagStatus, t, tDesktop, tabValue]
  );

  return (
    <>
      <div className="w-full px-6">
        <div className="my-4">
          <span className="text-secondaryText">{t("Main")} /</span>{" "}
          {t("ApplicationsForRegistration")}
        </div>
        <div className="text-Bold32">{t("ApplicationsForRegistration")}</div>
        <TabsSaunet
          className="mt-6 w-full text-Regular14"
          tabBarGutter={32}
          items={tabItems}
          onChange={(value) => setTabValue(value)}
          defaultActiveKey="clinics"
          desktop
        />
        <DefaultTable
          dataSource={tabValue === "doctors" ? doctorsReqData : clinicsReqData}
          columns={columns as ColumnsType<TableColumnModels>}
          locale={{
            emptyText: tDesktop("NoApplicationsForRegistrationYet"),
          }}
        />
      </div>
      <DesktopRegRequestInfoDrawer
        requestView={requestView}
        onClose={() => setOpen(false)}
        open={open}
      />
    </>
  );
}

RegistrationRequestsPage.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout hideSidebar={false}>{page}</DesktopLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../../messages/${locale}.json`))
        .default,
    },
  };
}
