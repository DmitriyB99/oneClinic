import type { FC } from "react";
import { useState } from "react";

import { CloseOutlined } from "@ant-design/icons";
import { useTranslations } from "next-intl";

import type { DoctorCertificateBlockModel } from "@/entities/login";
import { doctorsApi } from "@/shared/api/doctors";
import { InputFile, InputText } from "@/shared/components";

export const DoctorCertificateBlock: FC<DoctorCertificateBlockModel> = ({
  id,
  setCertificates,
  doctorId,
}) => {
  const tMob = useTranslations("Mobile.Login");
  const t = useTranslations("Common");

  const [certificate, setCertificate] = useState<File | null>();
  const [certificateName, setCertificateName] = useState<string>("");
  const [certificateYear, setCertificateYear] = useState<string>("");

  return (
    <>
      <InputText
        label={t("Name")}
        name="certificateName"
        value={certificateName}
        onChange={(event) => {
          setCertificateName(event.target.value);
        }}
        onBlur={(event) => {
          setCertificates((prev) => {
            const newBlocks = [...prev];
            newBlocks[id].name = event?.target?.value;
            return newBlocks;
          });
        }}
        showAsterisk={false}
      />
      <InputText
        label={t("ReceiveYear")}
        name="yearReceived"
        value={certificateYear}
        onChange={(event) => {
          setCertificateYear(event.target.value);
        }}
        onBlur={(event) => {
          setCertificates((prev) => {
            const newBlocks = [...prev];
            newBlocks[id].yearEarned = parseInt(event?.target?.value ?? "");
            return newBlocks;
          });
        }}
        showAsterisk={false}
        wrapperClassName="my-6"
      />
      <InputFile
        onChange={async (files) => {
          const response = await doctorsApi.uploadExtraFiles(
            doctorId,
            files[0]
          );
          setCertificates((prev) => {
            const newBlocks = [...prev];
            newBlocks[id].certificateUrl = response.data.fullPath;
            return newBlocks;
          });
          setCertificate(files[0]);
        }}
        accept=".pdf,.doc,.docx"
        label={certificate?.name ?? tMob("AddCopyOfCertificate")}
        name="diplomaCopy"
        showAsterisk={false}
        icon={
          certificate ? (
            <CloseOutlined
              className="cursor-pointer"
              onClick={() => {
                setCertificate(null);
              }}
            />
          ) : undefined
        }
        bottomText={tMob(
          "AfterCheckingDocumentYouWillHaveCertifiedSpecialistMarkInYourProfile"
        )}
      />
    </>
  );
};
