import type { FC } from "react";
import { useMemo } from "react";
import { useQuery } from "react-query";

import { Spin } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { medicalCardApi } from "@/shared/api/medicalCard";
import { DataEntry, Island } from "@/shared/components";
import { dateWithYearFormat } from "@/shared/config";

export const PatientMedicalCardPage: FC = () => {
  const t = useTranslations("Common");
  const router = useRouter();
  const patientMedicalCardId = useMemo(
    () => String(router?.query?.id),
    [router.query]
  );

  const {
    data: patient,
    isLoading: isPatientDataLoading,
    isError: isPatientDataError,
  } = useQuery(["medicalCard"], () =>
    medicalCardApi.getMedicalCard(patientMedicalCardId).then((res) => res.data)
  );

  const renderedAllergies = useMemo(() => {
    const allergiesRecord = (patient?.allergies ?? {}) as Record<
      string,
      string
    >;

    const allergies = Object.keys(allergiesRecord);
    if (allergies.length === 0) {
      return <div className="text-Regular16">{t("No")}</div>;
    }

    return allergies.map((key, index) => (
      <DataEntry
        key={key}
        bottomText={allergiesRecord?.[key] ?? "-"}
        topText={key}
        isDivided={index !== allergies.length - 1}
      />
    ));
  }, [patient?.allergies, t]);

  const renderedDrugsIntolerance = useMemo(() => {
    const drugsIntolerance = patient?.drugsIntolerance ?? [];
    if (drugsIntolerance.length === 0) {
      return <div className="text-Regular16">{t("No")}</div>;
    }

    return drugsIntolerance.map((key, index) => (
      <DataEntry
        key={key}
        isDivided={index !== drugsIntolerance.length - 1}
        bottomText={key}
      />
    ));
  }, [patient?.drugsIntolerance, t]);

  const renderedInfections = useMemo(() => {
    const infections = (patient?.infectionsToDate ?? {}) as Record<
      string,
      string
    >;
    const infectionsKeys = Object.keys(infections);
    if (infectionsKeys.length === 0) {
      return <div className="text-Regular16">{t("No")}</div>;
    }

    return infectionsKeys
      .filter((key) => infections?.[key])
      .map((key, index) => (
        <DataEntry
          key={key}
          bottomText={key}
          topText={dayjs(infections[key]).format(dateWithYearFormat)}
          isDivided={index !== infectionsKeys.length - 1}
        />
      ));
  }, [patient?.infectionsToDate, t]);

  const renderedVaccines = useMemo(() => {
    const vaccines = (patient?.vaccinesToDate ?? {}) as Record<string, string>;
    const vaccinesKeys = Object.keys(vaccines);
    if (vaccinesKeys.length === 0) {
      return <div className="text-Regular16">{t("No")}</div>;
    }

    return vaccinesKeys
      .filter((key) => vaccines?.[key])
      .map((key, index) => (
        <DataEntry
          key={key}
          bottomText={key}
          topText={dayjs(vaccines[key]).format(dateWithYearFormat)}
          isDivided={index !== vaccinesKeys.length - 1}
        />
      ));
  }, [patient?.vaccinesToDate, t]);

  if (isPatientDataLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isPatientDataError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        {t("ErrorHasOccurred")}
      </div>
    );
  }

  return (
    <>
      <Island className="mb-2 p-2">
        <div className="mb-4 text-Bold20">{t("Data")}</div>
        <DataEntry
          bottomText={`${patient?.name ?? ""} ${patient?.surname ?? ""} ${
            patient?.patronymic
          }`}
          topText={t("FullName")}
          isDivided
        />
        <DataEntry
          bottomText={dayjs(patient?.dateOfBirth).format(dateWithYearFormat)}
          topText={t("DateOfBirth")}
          isDivided
        />
        <DataEntry
          bottomText={patient?.phoneNumber ?? "-"}
          topText={t("PhoneNumber")}
          isDivided
        />
        <DataEntry
          bottomText={`${patient?.height ?? "-"} см, ${
            patient?.weight ?? "-"
          } кг`}
          topText={t("HeightAndWeight")}
        />
      </Island>
      <Island className="mb-2">
        <div className="mb-4 text-Bold20">{t("Allergy")}</div>
        {renderedAllergies}
      </Island>
      <Island className="mb-2">
        <div className="mb-4 text-Bold20">{t("DrugIntolerance")}</div>
        {renderedDrugsIntolerance}
      </Island>
      <Island className="mb-2">
        <div className="mb-4 text-Bold20">{t("Vaccines")}</div>
        {renderedVaccines}
      </Island>
      <Island className="mb-2">
        <div className="mb-4 text-Bold20">{t("Infections")}</div>
        {renderedInfections}
      </Island>
    </>
  );
};
