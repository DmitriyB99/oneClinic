import type { FC } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "react-query";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type { AppointmentChooseDirectionProps } from "@/entities/appointments";
import { treatmentApi } from "@/shared/api/treatment";
import {
  ArrowLeftIcon,
  Button,
  DividerSaunet,
  Island,
  Navbar,
  RadioSaunet,
  Toggle,
} from "@/shared/components";
// import { ConfirmationCloseDialog } from "@/widgets/confirmationClose";

export const AppointmentChooseDirection: FC<AppointmentChooseDirectionProps> =
  ({ userProfileId, handleGoNext, handleBack, handleClose }) => {
    const t = useTranslations("Common");
    const [shouldDisplayTreatments, setShouldDisplayTreatments] =
      useState(false);

    // const modalRef = useRef<HTMLDivElement | null>(null);

    // // Добавляем обработчик клика вне модального окна
    // useEffect(() => {
    //   const handleClickOutside = (event: MouseEvent) => {
    //     if (
    //       modalRef.current &&
    //       !modalRef.current.contains(event.target as Node)
    //     ) {
    //       handleClose(); // Закрываем модальное окно
    //     }
    //   };

    //   document.addEventListener("mousedown", handleClickOutside);

    //   return () => {
    //     document.removeEventListener("mousedown", handleClickOutside);
    //   };
    // }, [handleClose]);

    const {
      data: treatmentList = [{ id: "1", created: "24.2024 12:22" }],
      mutate: getAllTreatments,
    } = useMutation(["createConsultationSlot"], () =>
      treatmentApi
        ?.getAllTreatments(
          {
            page: 0,
            size: 999,
            sort: "modified,desc",
          },
          {
            userProfileId,
            category: null,
            doctorFullname: null,
            reservedFullname: null,
            isUsed: false,
            created: null,
          }
        )
        .then((res) => res.data.content)
    );

    const handleToggleClick = useCallback(
      (checked: boolean) => {
        setShouldDisplayTreatments(checked);
        getAllTreatments();
      },
      [getAllTreatments]
    );

    // TODO: remove hard code
    const renderedTreatmentList = useMemo(() => {
      if (!shouldDisplayTreatments || !treatmentList) return null;
      if (treatmentList.length === 0)
        return <p className="mt-4 text-Bold16">{t("YouHaveNoDirections")}</p>;

      return (
        <>
          <div className="py-4 text-Bold20">
            {t("SelectDirectionForAppointment")}
          </div>
          {treatmentList?.map((treatment) => (
            <div key={treatment?.id}>
              <div className="flex h-16 items-center justify-between px-4">
                <div className="flex items-center">
                  <RadioSaunet />
                  <div className="flex flex-col">
                    <div className="text-Regular12 text-secondaryText">
                      {dayjs(treatment?.created).format("D MMMM HH:mm")}
                    </div>
                    <div className="text-Regular16">
                      {t("Therapist")} {"->"} {t("Otolaryngologist")}
                    </div>
                    <div className="text-Regular12 text-secondaryText">
                      от Савченко В.И., Saunet Clinic
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      );
    }, [shouldDisplayTreatments, t, treatmentList]);

    return (
      <Island className="h-fit" 
      // ref={modal}
      >
        <Navbar
          title={t("AreYouInDirectionQuestion")}
          leftButtonOnClick={handleBack}
          buttonIcon={<ArrowLeftIcon />}
        />
        <div className="flex h-16 items-center justify-between">
          <div className="text-Regular16">{t("RecordingByDirection")}</div>
          <Toggle onChange={handleToggleClick} />
        </div>
        <DividerSaunet className="m-0" />

        {renderedTreatmentList}

        <div className="w-full py-4">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              handleGoNext?.();
            }}
          >
            {t("Next")}
          </Button>
        </div>
        {/* <ConfirmationCloseDialog
          isOpen={isOpenConfirmationDialog}
          setIsOpen={setIsOpenConfirmationDialog}
          onConfirmClose={handleClose}
        /> */}
      </Island>
    );
  };
