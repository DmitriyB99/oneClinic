import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";

import { Spin, notification } from "antd";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";

import type {
  AppointmentTimeAndFormat,
  RescheduleConsultationSlotModel,
} from "@/entities/appointments";
import { AppointmentChooseTimeFormat } from "@/entities/appointments";
import { appointmentBookingApi } from "@/shared/api/appointmentBooking";
import { bookingInfoApi } from "@/shared/api/bookingInfo";
import {
  Avatar,
  Button,
  CloseIcon,
  Dialog,
  GrayOutlineStarIcon,
} from "@/shared/components";
import { timeFormat } from "@/shared/config";
import { changeTimeFormat, convertStringToAvatarLabel } from "@/shared/utils";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        //@ts-ignore
export const RateAppointmentDialog = ({ isOpen, setIsOpen }) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.Booking");
  const isBookingSlotsLoading = false;
  const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);

  //   const renderedConfirmationDialogContent = useMemo(() => {
  //     if (isBookingSlotsLoading) {
  //       return (
  //         <div className="flex h-full w-full items-center justify-center">
  //           <Spin size="large" />
  //         </div>
  //       );
  //     }

  //     if (!true) {
  //       // NEWTODO: remove ! after test
  //       return (
  //         <div className="flex h-full w-full items-center justify-center">
  //           {t("ErrorHasOccurred")}
  //         </div>
  //       );
  //     }

  //     return (
  //       <>
  //         <div className="mb-4 flex items-center justify-between">
  //           <div className="text-Bold20">
  //             {tMob("YouSureYouWantTransferAppointmentQuestion")}
  //           </div>
  //           <div
  //             className="flex w-1/4 justify-end"
  //             //   onClick={() => setIsConfirmationDialogOpen(false)}
  //             //   onKeyDown={() => setIsConfirmationDialogOpen(false)}
  //           >
  //             <CloseIcon />
  //           </div>
  //         </div>
  //         {/* {transferPenalty > 0 && !isDoctor && (
  //             <p className="text-Regular16">
  //               {tMob("WeWillRefundYouHalfCostOfConsultation", {
  //                 transferPenalty,
  //               })}
  //             </p>
  //           )} */}

  //         <Button
  //           className="my-4"
  //           variant="secondary"
  //           block
  //           onClick={() => {
  //             //   setIsConfirmationDialogOpen(false);
  //             //   setIsRescheduleDialogOpen(true);
  //           }}
  //         >
  //           {t("Confirm")}
  //         </Button>

  //         <Button
  //           variant="tertiary"
  //           block
  //           // onClick={() => setIsConfirmationDialogOpen(false)}
  //         >
  //           {t("Cancel")}
  //         </Button>
  //       </>
  //     );
  //   }, [
  //     isBookingSlotsError,
  //     isBookingSlotsLoading,
  //     isDoctor,
  //     setIsConfirmationDialogOpen,
  //     setIsRescheduleDialogOpen,
  //     t,
  //     tMob,
  //     transferPenalty,
  //   ]);

  return (
    <>
      <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
        <>
          {isBookingSlotsLoading && (
            <div className="flex h-full w-full items-center justify-center">
              <Spin size="large" />
            </div>
          )}
          {/* if (!true) { // NEWTODO: remove ! after test
        return (
          <div className="flex h-full w-full items-center justify-center">
            {t("ErrorHasOccurred")}
          </div>
        );
      } */}
          <div className="mb-4 flex items-center justify-between">
            <div className="text-Bold24">Как вы оцените консультацию?</div>
            <div
              className="flex w-1/4 justify-end"
                onClick={() => setIsOpen(false)}
              //   onKeyDown={() => setIsConfirmationDialogOpen(false)}
            >
              <CloseIcon />
            </div>
          </div>
          <div className="flex">
            <Avatar
              //   src={doctor?.photoUrl}
              size="lg"
              //   text={convertStringToAvatarLabel(doctor?.fullName)}
            />
            <div className="ml-4 w-full">
              <div className="flex justify-between items-center">
                <p className="mb-2 text-Bold20">Сманов Асылбек Еркинович</p>
              </div>

              <p className="mb-1 text-Regular12">
                Люблю помогать людям поддерживать их здоровье в отличном
                состоянии!
              </p>
            </div>
          </div>
          <div className="py-8 flex items-center justify-center">
            <div className="px-2"><GrayOutlineStarIcon width={28} height={27} /></div>
            <div className="px-2"><GrayOutlineStarIcon width={28} height={27} /></div>
            <div className="px-2"><GrayOutlineStarIcon width={28} height={27} /></div>
            <div className="px-2"><GrayOutlineStarIcon width={28} height={27} /></div>
            <div className="px-2"><GrayOutlineStarIcon width={28} height={27} /></div>
            

          </div>
          {/* {transferPenalty > 0 && !isDoctor && (
            <p className="text-Regular16">
              {tMob("WeWillRefundYouHalfCostOfConsultation", {
                transferPenalty,
              })}
            </p>
          )} */}
          <Button
            className="my-4"
            variant="primary"
            block
            onClick={() => {
                setIsOpen(false)
              //   setIsConfirmationDialogOpen(false);
              //   setIsRescheduleDialogOpen(true);
            }}
          >
            {t("IsReady")}
          </Button>
          <Button
            variant="secondary"
            block
            onClick={() => setIsOpen(false)}
            // onClick={() => setIsConfirmationDialogOpen(false)}
          >
            Посмотреть назначение
          </Button>
        </>
      </Dialog>
    </>
  );
};
