import type { FC } from "react";
import { useState, useCallback } from "react";

import { Button as AntButton } from "antd";
import { useTranslations } from "next-intl";

import { UploadExtraFiles } from "@/entities/desktopFillProfile";
import {
  Button,
  DatePicker,
  DesktopInputText,
  PlusIcon,
} from "@/shared/components";
import { hasNotEmptyValues } from "@/shared/utils";
import type {
  CertificateModel,
  DoctorDataFillModel,
  RegistrationStepModel,
} from "@/widgets/auth/models";

export const Step5FillDoctorProfile: FC<
  RegistrationStepModel<DoctorDataFillModel>
> = ({ next, setValue }) => {
  const [certificateList, setCertificateList] = useState<CertificateModel[]>([
    { id: 1, name: "", certificateUrl: "" },
  ]);

  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.FillProfile");

  const addCertificate = useCallback(
    () =>
      setCertificateList((prev) => [
        ...prev,
        { id: certificateList.length + 1, name: "", certificateUrl: "" },
      ]),
    [certificateList]
  );

  const handleCertificateChange = useCallback(
    (id: number, key: string, value: string | unknown) => {
      setCertificateList((prev) =>
        prev.map((certificate) =>
          certificate.id === id ? { ...certificate, [key]: value } : certificate
        )
      );
    },
    []
  );

  const handleNextClick = useCallback(() => {
    const allCertificate = hasNotEmptyValues<CertificateModel>(certificateList);
    const certificateForm = allCertificate.map(
      ({ name, yearEarned, certificateUrl }) => ({
        name,
        yearEarned,
        certificateUrl,
      })
    );
    setValue?.("certificates", certificateForm);
    next?.();
  }, [next, setValue, certificateList]);

  return (
    <>
      {certificateList.map((certificate) => (
        <div key={certificate.id}>
          <div className="mt-6 text-Bold20">{t("Certificate")}</div>
          <DesktopInputText
            wrapperClassName="text-Regular16 mt-5"
            placeholder={tDesktop("CertificateName")}
            innerClassName="pl-3"
            label="certificate"
            name="certificate"
            showAsterisk={false}
            desktopDrawer
            onChange={(event) =>
              handleCertificateChange(
                certificate.id ?? 0,
                "name",
                event.target.value
              )
            }
          />
          <DatePicker
            placeholder={t("ReceiveYear")}
            className="mt-5 w-full"
            size="large"
            picker="year"
            onChange={(__, year) =>
              handleCertificateChange(certificate.id ?? 0, "yearEarned", year)
            }
          />
          <UploadExtraFiles
            title={tDesktop("AttachCertificateCopyPDF")}
            setExtraFileUrl={(url) =>
              handleCertificateChange(
                certificate.id ?? 0,
                "certificateUrl",
                url
              )
            }
          />
        </div>
      ))}
      <AntButton
        className="mt-5 flex h-fit items-center gap-1 rounded-2xl bg-brand-light px-3 py-2 text-Regular14"
        onClick={addCertificate}
      >
        {t("AddMoreCertificate")} <PlusIcon size="xs" color="" />
      </AntButton>
      <Button
        className="mt-11 !h-10 w-full rounded-lg"
        onClick={handleNextClick}
      >
        {t("Next")}
      </Button>
      <Button
        variant="tinted"
        className="mb-20 mt-4 !h-10 w-full rounded-lg bg-white"
        onClick={next}
      >
        {t("Skip")}
      </Button>
    </>
  );
};
