import type { FC } from "react";
import { useMemo } from "react";

import { Spin } from "antd";
import clsx from "clsx";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import {
  Avatar,
  Button,
  CheckPinkIcon,
  CloseIcon,
  ClosePinkIcon,
  DividerSaunet,
  Island,
  WaitingPinkIcon,
} from "@/shared/components";
import { dateFormat, timeFormat } from "@/shared/config";
import { CONSULTATION_STATUS } from "@/shared/constants";
import { getAddressString } from "@/shared/utils";

import type { BookingInfoProps } from "../model/BookingInfoProps";
import { DoctorConsultationTypeEnum } from "@/widgets/auth";

export const BookingInfo: FC<BookingInfoProps> = ({
  isDoctor,
  consultationData,
  isConsultationLoading,
  isConsultationError,
  shouldDisplayMainButtons,
  onRescheduleClick,
  onCancelClick,
  AdditionalButton,
  DescriptionElement,
}) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.Booking");
  const router = useRouter();

  const parseConsultationType = useMemo(() => {
    if (isDoctor) {
      if (consultationData?.status === "CANCELED") {
        return "Запись отменена";
      }

      switch (consultationData?.consultation_type) {
        case DoctorConsultationTypeEnum.OFFLINE:
          return "Клиент записан на прием в клинике";
        case DoctorConsultationTypeEnum.CUSTOM:
          return "Клиент записан на прием в клинике";
        case DoctorConsultationTypeEnum.AWAY:
          return "Клиент вызвал вас к себе на консультацию";
        default:
          return "Клиент записан на онлайн-консультацию";
      }
    }

    switch (
      consultationData?.doctor_service_type ||
      consultationData?.clinic_service_type
    ) {
      case "OFFLINE":
        return "Вы записаны на прием";
      case "ANALYSIS":
        return "Вы записаны на сдачу анализов";
      case "AWAY":
        return "Ожидайте консультацию врача на дому";
      default:
        return tMob("YouHaveAppointmentForOnlineConsultation");
    }
  }, [
    consultationData?.doctor_service_type,
    consultationData?.clinic_service_type,
    consultationData?.consultation_type,
    isDoctor,
    tMob,
  ]);

  const consultationAddress = useMemo(() => {
    if (!consultationData?.address) {
      return "-";
    }

    const { build_number, street, floor, apartment } = consultationData.address;

    return `ул. ${street} ${build_number}${floor ? `, ${floor} этаж` : ""}${
      apartment ? `, кв. ${apartment}` : ""
    }`;
  }, [consultationData?.address]);

  if (isConsultationLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isConsultationError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        {t("ErrorHasOccurred")}
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Island>
        <Button
          size="s"
          variant="tinted"
          className={clsx("mb-2 bg-gray-2")}
          onClick={() => router.back()}
        >
          <CloseIcon />
        </Button>
        <div className="flex w-full flex-col items-center justify-center text-center">
          <Avatar
            className="flex items-center justify-center"
            size="clinicAva"
            style={{ backgroundColor: "#F5F5F5" }}
            src={
              consultationData?.status === "CANCELED" ? (
                <ClosePinkIcon />
              ) : (
                <CheckPinkIcon size="l" />
              )
            }
            //
            // src={<WaitingPinkIcon width={24} height={36}/>}
          />
          <div>
            <p className="mb-3  p-2 text-center text-Bold24">
              {parseConsultationType}
            </p>
            {consultationData?.from_time && (
              <p className="mb-0 text-center text-Bold14">
                {dayjs(consultationData?.from_time).format(dateFormat)} в{" "}
                {dayjs(consultationData?.from_time).format(timeFormat)}
              </p>
            )}

            {/* {DescriptionElement} */}
          </div>
        </div>
      </Island>
      <Island className="my-2">
        <p className="mb-6 text-Bold20">{t("AboutAppointment2")}</p>
        <div className="py-0">
          {isDoctor ? (
            <>
              <p className="mb-1 text-Regular12 text-secondaryText">
                {t("Patient")}
              </p>
              <p className="mb-1 cursor-pointer text-Regular16">
                {consultationData?.patient?.name} {consultationData?.patient?.surname}
              </p>
            </>
          ) : consultationData?.clinic_service_type !== "ANALYSIS" ? (
            <>
              <p className="mb-1 text-Regular12 text-secondaryText">
                {t("Doctor")}
              </p>
              <p
                className="mb-1 cursor-pointer text-Regular16 text-blue"
                onClick={() =>
                  router.push({
                    pathname: "/clinics/map",
                    query: {
                      widget: "doctors",
                      doctorId: consultationData?.doctor?.id,
                    },
                  })
                }
              >
                {`${consultationData?.doctor?.first_name} ${consultationData?.doctor?.last_name}`}
              </p>
            </>
          ) : null}
          <DividerSaunet className="my-3" />
        </div>
        {consultationData?.clinic && (
          <div className="py-0">
            <p className="mb-1 text-Regular12 text-secondaryText">
              {t("Clinic")}
            </p>
            <p
              className="mb-1 cursor-pointer text-Regular16 text-blue"
              onClick={() =>
                router.push({
                  pathname: "/clinics/map",
                  query: {
                    widget: "clinics",
                    clinicId: consultationData?.clinic?.id,
                  },
                })
              }
            >
              {consultationData?.clinic?.name}
            </p>
            <DividerSaunet className="my-3" />
          </div>
        )}
        <div className="py-0">
          <p className="mb-1 text-Regular12 text-secondaryText">
            {t("Address")}
          </p>
          <p className="mb-0 text-Regular16">{consultationAddress}</p>
          <DividerSaunet className="my-3" />
        </div>
        <div className="py-0">
          <p className="mb-1 text-Regular12 text-secondaryText">
            {t("CostOfServices")}
          </p>
          <p className="mb-1 text-Regular16">{consultationData?.price} ₸</p>
        </div>
      </Island>
      {consultationData?.treatment_direction && (
        <Island className="mb-2">
          <h3 className="mb-3 text-Bold20 text-dark">{t("Direction")}</h3>
          <div className="mt-3">
            <div className="text-Regular12 text-secondaryText">
              {dayjs(consultationData?.treatment_direction?.created).format(
                dateFormat
              )}{" "}
              в{" "}
              {dayjs(consultationData?.treatment_direction?.created).format(
                timeFormat
              )}
            </div>
            <div className="mt-1 text-Regular16">
              {`${consultationData?.treatment_direction?.from_specialities[0]} → ${consultationData?.treatment_direction?.to_speciality}`}
            </div>
            <div className="mt-1 text-Regular12 text-secondaryText">
              {`от ${consultationData?.treatment_direction?.from_doctor}, ${consultationData?.treatment_direction?.from_clinic}`}
            </div>
          </div>
        </Island>
      )}
      {shouldDisplayMainButtons &&
      consultationData?.status !== CONSULTATION_STATUS.CANCELED ? (
        <Island className="mt-auto rounded-none">
          {AdditionalButton}
          <Button
            className="my-4"
            variant="secondary"
            block
            onClick={onRescheduleClick}
          >
            {t("TransferAppointment")}
          </Button>

          <Button
            variant="tertiary"
            className="text-red"
            block
            onClick={onCancelClick}
          >
            {t("CancelEntry")}
          </Button>
        </Island>
      ) : (
        <Island className="mt-auto rounded-none">
          <Button block onClick={() => router.push("/main")}>
            {t("GoBackToMainPage")}
          </Button>
        </Island>
      )}
    </div>
  );
};
