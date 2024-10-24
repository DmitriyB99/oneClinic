import type { FC } from "react";
import { useMemo } from "react";

import {
  ArrowLeftOutlined,
  CreditCardOutlined,
  LoadingOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";

import type { CheckInformationDialogProps } from "@/entities/appointments";
import { Button, DividerSaunet, Island } from "@/shared/components";

export const AppointmentCheckInformation: FC<CheckInformationDialogProps> = ({
  handleBack,
  handleGoToNextPage,
  appointmentInformation,
  isLoading,
  isMedicalTest,
  submitButtonText,
}) => {
  const t = useTranslations("Common");
  const [timeLabel, formatLabel] = useMemo(() => {
    switch (appointmentInformation?.format) {
      case "hospital":
        return ["Время и место приема", "В больнице"];
      case "online":
        return ["Время приема", "Онлайн"];
      case "home":
        return ["Время", "На дом"];
      default:
        return ["", ""];
    }
  }, [appointmentInformation?.format]);

  return (
    <Island className="!px-0 !pt-4">
      <div className="relative flex items-center justify-between">
        <div
          className="flex cursor-pointer rounded-2xl bg-gray-2 px-5 py-2 text-Bold20"
          onClick={handleBack}
        >
          <ArrowLeftOutlined />
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2 text-Bold16">
          {t("CheckData")}</div>
      </div>
      <div className="flex flex-col items-start justify-start">
        <div className="mt-5 text-Regular12 text-secondaryText">
          {t("MedicalInstitution")}
        </div>
        <div className="mt-1 text-Regular16">
          {appointmentInformation?.medicalFacility}
        </div>
        <DividerSaunet className="mb-0 mt-3" />
        {appointmentInformation?.doctor && (
          <>
            <div className="mt-3 text-Regular12 text-secondaryText">
              {t("Doctor")}
            </div>
            <div className="mt-1 text-Regular16">
              {appointmentInformation?.doctor}
            </div>
            <DividerSaunet className="mb-0 mt-3" />
          </>
        )}

        <div className="mt-3 text-Regular12 text-secondaryText">
          {t("ReceptionFormat")}
        </div>
        <div className="mt-1 text-Regular16">{formatLabel}</div>
        <DividerSaunet className="mb-0 mt-3" />

        {appointmentInformation?.address && (
          <>
            <div className="mt-3 text-Regular12 text-secondaryText">
              {t("Address")}
            </div>
            <div className="mt-1 text-Regular16">
              {appointmentInformation?.address}
            </div>
            <DividerSaunet className="mb-0 mt-3" />
          </>
        )}
        {appointmentInformation?.medicalTestType && (
          <>
            <div className="mt-3 text-Regular12 text-secondaryText">
              {t("TypeOfAnalysis")}
            </div>
            <div className="mt-1 text-Regular16">
              {appointmentInformation?.medicalTestType}
            </div>
            <DividerSaunet className="mb-0 mt-3" />
          </>
        )}
        <div className="mt-3 text-Regular12 text-secondaryText">
          {timeLabel}
        </div>
        <div className="mt-1 text-Regular16">
          {appointmentInformation?.date}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-start">
        {appointmentInformation?.paymentMethod === "cash" && (
          <WalletOutlined className="ml-2 mr-5 text-Bold20" />
        
        )}
        {/* {appointmentInformation?.paymentMethod === "card" && (  NEWTODO: uncomment after back */}
          <CreditCardOutlined className="ml-2 mr-5 text-Bold20" />
        {/*  )} */}
        <Button
          variant="primary"
          className="w-full"
          onClick={handleGoToNextPage}
        >
          {isLoading ? (
            <div className="flex w-full justify-center">
              <LoadingOutlined className="text-Bold24" />
            </div>
          ) : (
            <div className="flex w-full items-center justify-between px-4">
              <div className="text-Medium16">
                {submitButtonText ? (
                  submitButtonText
                ) : (
                  <>
                    {t("ToSignUpFor", {
                      isMedicalTest: isMedicalTest
                        ? t("AnalysisSmall")
                        : t("AppointmentSmall"),
                    })}
                  </>
                )}
              </div>
              <div className="text-Regular16">
                {appointmentInformation?.cost} ₸
              </div>
            </div>
          )}
        </Button>
      </div>
    </Island>
  );
};
