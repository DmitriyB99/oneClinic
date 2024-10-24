import type { FC } from "react";
import { useMemo } from "react";

import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";
import { useTranslations } from "next-intl";

import { ClinicDoctorStatus } from "@/shared/api/dtos";

import type { StatusTagProps } from "./props";

export const StatusTag: FC<StatusTagProps> = ({ status }) => {
  const t = useTranslations("Common");

  const statusTags = useMemo(
    () => ({
      [ClinicDoctorStatus.ACTIVE]: {
        label: t("Active"),
        color: "success",
        icon: <CheckCircleOutlined />,
      },
      [ClinicDoctorStatus.NEW]: {
        label: t("Active"),
        color: "success",
        icon: <CheckCircleOutlined />,
      },
      [ClinicDoctorStatus.NOT_ACTIVE]: {
        label: t("UnderConsideration"),
        color: "processing",
        icon: <SyncOutlined />,
      },
      [ClinicDoctorStatus.NEW_DISABLED]: {
        label: t("UnderConsideration"),
        color: "processing",
        icon: <SyncOutlined />,
      },
      [ClinicDoctorStatus.BANNED]: {
        label: t("Rejected"),
        color: "error",
        icon: <CloseCircleOutlined />,
      },
      [ClinicDoctorStatus.STOPPED]: {
        label: t("Deactivated"),
        color: "default",
        icon: <MinusCircleOutlined />,
      },
      [ClinicDoctorStatus.DELETED]: {
        label: t("Deleted"),
        color: "error",
        icon: <MinusCircleOutlined />,
      },
      [ClinicDoctorStatus.DISABLED]: {
        label: t("Deactivated"),
        color: "default",
        icon: <MinusCircleOutlined />,
      },
    }),
    [t]
  );

  return (
    <Tag icon={statusTags[status].icon} color={statusTags[status].color}>
      {statusTags[status].label}
    </Tag>
  );
};
