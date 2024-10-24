import type { FC } from "react";
import { useCallback, useContext, useMemo, useState } from "react";
import { useMutation } from "react-query";

import { Modal, notification } from "antd";
import type { IconType } from "antd/es/notification/interface";
import router from "next/router";
import { useTranslations } from "next-intl";

import { superAdminApis } from "@/shared/api";
import { clinicsApi } from "@/shared/api/clinics";
import { ClinicDoctorStatus } from "@/shared/api/dtos";
import { Button, ArrowLeftIcon } from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";

import type {
  DecisionObjectMapModel,
  DecisionTypes,
  TopBarProps,
} from "./props";

export const FormTopbar: FC<TopBarProps> = ({
  title,
  isClinic,
  id,
  status,
  refetch,
}) => {
  const [openModel, setOpenModal] = useState<DecisionTypes>();
  const { user } = useContext(UserContext);
  const [api, contextHolder] = notification.useNotification();
  const tDesktop = useTranslations("Desktop.Admin");
  const t = useTranslations("Common");

  const decisionObjectMap: DecisionObjectMapModel = useMemo(
    () => ({
      accept: {
        status: "NEW",
        title: isClinic
          ? tDesktop("AreYouSureAcceptClinicApplication")
          : tDesktop("AreYouSureAcceptDoctorApplication"),
      },
      decline: {
        status: "BANNED",
        title: isClinic
          ? tDesktop("AreYouSureRejectClinicApplication")
          : tDesktop("AreYouSureRejectDoctorApplication"),
      },
      activate: {
        status: "ACTIVE",
        title: tDesktop("AreYouSureActivateAccount"),
      },
      deactivate: {
        status: "DISABLED",
        title: tDesktop("AreYouSureDeactivateAccount"),
      },
    }),
    [tDesktop, isClinic]
  );

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

  const { mutate: conclusionClinic, isLoading } = useMutation(
    ["changedClinicsConclusion"],
    (status: string) => superAdminApis.putClinicStatus(id, status),
    {
      onSuccess: () => {
        openNotification(tDesktop("ClinicStatusSuccesChanged"), "success");
        setOpenModal(undefined);
        refetch?.();
      },
      onError() {
        openNotification(tDesktop("StatusChangeError"), "error");
      },
    }
  );

  const { mutate: conclusionDoctor, isLoading: isLoadingDoctor } = useMutation(
    ["changedDoctorConclusion"],
    (status: string) => superAdminApis.putDoctorStatus(id, status),
    {
      onSuccess: () => {
        openNotification(tDesktop("DoctorStatusSuccesChanged"), "success");
        setOpenModal(undefined);
        refetch?.();
      },
      onError() {
        openNotification(tDesktop("StatusChangeError"), "error");
      },
    }
  );

  const {
    mutate: conclusionDoctorByManager,
    isLoading: isLoadingManagerDoctor,
  } = useMutation(
    ["changedDoctorStatusbyManager"],
    (status: string) => clinicsApi.updateClinicDoctorStatus(id, status),
    {
      onSuccess: () => {
        openNotification(tDesktop("DoctorStatusSuccesChanged"), "success");
        setOpenModal(undefined);
        refetch?.();
      },
      onError() {
        openNotification(tDesktop("StatusChangeError"), "error");
      },
    }
  );

  const handleCancel = () => {
    setOpenModal(undefined);
  };

  const handleConclusion = useCallback(async () => {
    const openModelKey = openModel as DecisionTypes;
    if (isClinic) {
      await conclusionClinic(decisionObjectMap[openModelKey].status);
    } else {
      if (user?.role === "clinic") {
        await conclusionDoctorByManager(decisionObjectMap[openModelKey].status);
      } else {
        await conclusionDoctor(decisionObjectMap[openModelKey].status);
      }
    }
  }, [
    conclusionClinic,
    conclusionDoctor,
    conclusionDoctorByManager,
    isClinic,
    openModel,
    user,
    decisionObjectMap,
  ]);

  const renderTitle = useMemo(
    () => decisionObjectMap[openModel as DecisionTypes]?.title,
    [decisionObjectMap, openModel]
  );

  return (
    <>
      {contextHolder}
      <Modal
        title={renderTitle}
        open={Boolean(openModel)}
        confirmLoading={isLoading || isLoadingDoctor || isLoadingManagerDoctor}
        onOk={handleConclusion}
        onCancel={handleCancel}
      />
      <div className="relative flex w-full items-center gap-5">
        <Button
          onClick={() => router.back()}
          className="flex !h-10 !w-10 items-center justify-center !rounded-xl bg-white !p-0"
        >
          <ArrowLeftIcon />
        </Button>
        <p className="m-0 p-0 text-Semibold16">{title}</p>
        <div className="absolute right-0 flex gap-4">
          {(status === ClinicDoctorStatus.NOT_ACTIVE ||
            status === ClinicDoctorStatus.NEW_DISABLED) && (
            <>
              <Button
                className="!h-8 !rounded-md !text-Regular14"
                onClick={() => setOpenModal("accept")}
              >
                {t("AcceptApplication")}
              </Button>
              <Button
                className="!h-8 !rounded-md !bg-white !text-Regular14"
                variant="outline"
                onClick={() => setOpenModal("decline")}
              >
                {t("Reject")}
              </Button>
            </>
          )}
          {status === ClinicDoctorStatus.ACTIVE && (
            <Button
              className="!h-8 !rounded-md bg-white !text-Regular14"
              onClick={() => setOpenModal("deactivate")}
              variant="outline"
            >
              {tDesktop("Deactivate")}
            </Button>
          )}
          {status === ClinicDoctorStatus.DISABLED && (
            <Button
              className="!h-8 !rounded-md !text-Regular14"
              onClick={() => setOpenModal("activate")}
            >
              {tDesktop("Activate")}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
