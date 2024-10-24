// import type { FC } from "react";
import { useMemo, useState } from "react";

import clsx from "clsx";
import { useTranslations } from "next-intl";

import {
  Avatar,
  Button,
  Chips,
  DividerSaunet,
  Island,
  StarIcon,
  VideoCameraFilledIcon,
} from "@/shared/components";
import { LikeButton } from "@/shared/components/molecules/FavouriteButton";
import { formatMoney } from "@/shared/config";
import { useFavourite } from "@/shared/hooks/useFavourite";
import { convertStringToAvatarLabel } from "@/shared/utils";
import { DoctorConsultationTypeEnum } from "@/widgets/auth";

// import type { DoctorInfoCardProps } from "../model/DoctorInfoCardProps";

export const DoctorInfoCard =
  // : FC<DoctorInfoCardProps>
  ({
    onRegisterAppointment,
    onCardClick,
    className,
    isOnlineConsultation,
    ...doctor
  }) => {
    const t = useTranslations("Common");
    const priceList = useMemo(() => {
      const onlinePrice = doctor?.consultation_prices?.find(
        (service) =>
          service.consultation_type === DoctorConsultationTypeEnum.ONLINE
      )?.price;
      const offlinePrice = doctor?.consultation_prices?.find(
        (service) =>
          service.consultation_type === DoctorConsultationTypeEnum.OFFLINE
      )?.price;
      const awayPrice = doctor?.consultation_prices?.find(
        (service) =>
          service.consultation_type === DoctorConsultationTypeEnum.AWAY
      )?.price;

      return {
        onlinePrice,
        offlinePrice,
        awayPrice,
      };
    }, [doctor?.consultation_prices]);

    const [isFavourite, setIsFavourite] = useState(doctor.is_favourite);
    const { handleLikeToggle } = useFavourite("Doctor");
    const onToggleFavourite = () => {
      handleLikeToggle(doctor.id, isFavourite, (updatedState) => {
        setIsFavourite(updatedState);
      });
    };

    const doctorsChips = [
      `Стаж ${doctor?.work_experience} лет`,
      // ...doctor?.specialities,
    ];

    return (
      <Island key={doctor?.id} className={clsx("mx-4 my-3", className)}>
        <div className="flex">
          <div onClick={onCardClick}>
            <Avatar
              src={doctor?.photo_url}
              size="clinicAva"
              text={convertStringToAvatarLabel(
                `${doctor?.first_name} ${doctor.last_name} ${doctor.father_name}`
              )}
              isOnline
            />
          </div>

          <div className="ml-4 w-full">
            <div className="flex items-center justify-between">
              <p className="mb-0 text-Regular16" onClick={onCardClick}>
                {`${doctor?.full_name}`}{" "}
              </p>
              <LikeButton
                initialLiked={doctor.is_favourite}
                onToggle={onToggleFavourite}
              />
            </div>

            <p className="mb-1 text-Regular12 text-secondaryText">
              {/* {doctor?.specialities} */}
            </p>
            <div className="mb-3 flex items-center">
              <StarIcon size="xs" />
              <p className="mb-0 ml-1 text-Semibold12">{doctor?.rating ?? 0}</p>
              <p className="mb-0 ml-2 text-Regular12 text-secondaryText">
                {t("AmountOffReviews", { amount: doctor?.review_count ?? 0 })}
              </p>
            </div>
            <Button size="s" onClick={onRegisterAppointment}>
              {isOnlineConsultation ? (
                <div className="flex items-center justify-between">
                  <div className="mr-1 flex items-center">
                    <VideoCameraFilledIcon color="white" width={12} />
                  </div>
                  <p className="m-0 text-Medium12">{t("ContactDoctor")}</p>
                </div>
              ) : (
                t("Register")
              )}
            </Button>
          </div>
        </div>
        <Chips chipLabels={doctorsChips} type="suggest" className="!my-4" />
        <div className="flex items-center justify-start">
          {doctor?.clinic?.[0]?.icon_url && (
            <Avatar
              size="avatar"
              isSquare
              src={doctor?.clinic?.[0]?.icon_url}
            />
          )}
          <div className="ml-3 flex flex-col">
            {doctor?.clinic?.[0]?.name && (
              <div className="mb-1 text-Regular16">
                {doctor?.clinic[0]?.name}
              </div>
            )}
            {doctor?.clinic?.[0]?.address && (
              <div className="text-Regular12 text-secondaryText">
                {doctor?.clinic[0]?.address}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          {priceList.awayPrice && (
            <>
              <div>
                <p className="mb-0 text-Semibold12">{t("HouseCall")}</p>
                <p className="mb-0 text-Regular12">
                  {formatMoney(priceList.awayPrice)} ₸
                </p>
              </div>
              <DividerSaunet type="vertical" className="m-0 h-inherit" />
            </>
          )}
          {priceList?.offlinePrice && (
            <>
              <div>
                <p className="mb-0 text-Semibold12">{t("InHospital")}</p>
                <p className="mb-0 text-Regular12">
                  {formatMoney(priceList.offlinePrice)} ₸
                </p>
              </div>
              <DividerSaunet type="vertical" className="m-0 h-inherit" />
            </>
          )}
          {priceList?.onlinePrice && (
            <div>
              <p className="mb-0 text-Semibold12">{t("VirtualAppointment")}</p>
              <p className="mb-0 text-Regular12">
                {formatMoney(priceList.onlinePrice)} ₸
              </p>
            </div>
          )}
        </div>
      </Island>
    );
  };
