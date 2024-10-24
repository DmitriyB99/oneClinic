import type { FC } from "react";
import { useState } from "react";

import { Divider } from "antd";
import { useTranslations } from "next-intl";

import { AdminClinicProfileDrawer } from "@/entities/desktopDrawer";
import { EditIcon } from "@/shared/components";

import type { ClinicProfileProps } from "../model";

export const ClinicProfile: FC<ClinicProfileProps> = ({ clinicData }) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Admin");
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-row items-center justify-between">
        <p className="m-0 p-0 text-Bold20">{tDesktop("GeneralInfo")}</p>
        <div onClick={() => setOpen(true)} className="flex flex-row gap-3">
          <EditIcon width={18} height={18} />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <p className="m-0 text-Regular12 text-gray-secondary">
            {t("ClinicBIN")}
          </p>
          <p className="m-0 mt-1 text-Regular16">
            {clinicData?.bin ?? t("Absent")}
          </p>
        </div>
      </div>
      <Divider className="mt-0" />
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <p className="m-0 text-Regular12 text-gray-secondary">
            {t("ClinicName")}
          </p>
          <p className="m-0 mt-1 text-Regular16">
            {clinicData?.name ?? t("Absent")}
          </p>
        </div>
      </div>
      <Divider className="mt-0" />
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <p className="m-0 text-Regular12 text-gray-secondary">
            {tDesktop("ClinicDescription")}
          </p>
          <p className="m-0 mt-1 text-Regular16">
            {clinicData?.description ?? t("Absent")}
          </p>
        </div>
      </div>
      <Divider className="mt-0" />
      <div className="flex flex-row items-center justify-between">
        <p className="m-0 p-0 text-Bold20">{t("Contacts")}</p>
        <div onClick={() => setOpen(true)} className="flex flex-row gap-3">
          <EditIcon width={18} height={18} />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <p className="m-0 text-Regular12 text-gray-secondary">
            {t("PhoneNumber")}
          </p>
          {/* eslint-disable  @typescript-eslint/no-explicit-any */}
          {clinicData?.phoneNumbers.map((tel: any, index) => (
            <p key={index} className="m-0 mt-1 text-Regular16">
              {tel.phoneNumber ?? t("Absent")}{" "}
              {tel.type === "WHATSAPP" && "(Whatsapp)"}
            </p>
          ))}
        </div>
      </div>
      <Divider className="mt-0" />
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <p className="m-0 text-Regular12 text-gray-secondary">{t("Email")}</p>
          <p className="m-0 mt-1 text-Regular16">
            {clinicData?.email ?? t("Absent")}
          </p>
        </div>
      </div>
      <Divider className="mt-0" />
      <div className="flex flex-row items-center justify-between">
        <p className="m-0 p-0 text-Bold20">{t("Address")}</p>
        <div onClick={() => setOpen(true)} className="flex flex-row gap-3">
          <EditIcon width={18} height={18} />
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <p className="m-0 text-Regular12 text-gray-secondary">
            Cр, Пт: 10:00 - 18:00{" "}
          </p>
          <p className="m-0 mt-1 text-Regular16">
            {clinicData?.name ?? t("Absent")}
          </p>
          <p className="m-0 text-Regular12 text-gray-secondary">
            {clinicData?.street}, {clinicData?.buildNumber}
          </p>
        </div>
      </div>
      <Divider className="mt-0" />
      <AdminClinicProfileDrawer onClose={() => setOpen(false)} open={open} />
    </div>
  );
};
