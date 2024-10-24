import type { Dispatch, FC, SetStateAction } from "react";
import { useCallback, useMemo, useState } from "react";

import { useTranslations } from "next-intl";

import {
  CheckIcon,
  MedicalClipboardIcon,
  MedicalAidKitIcon,
  VideoCameraFilledIcon,
  Island,
  RadioSaunet,
} from "@/shared/components";
import { CONSULTATION_TYPE } from "@/shared/constants";
import type { DoctorServicePriceModel } from "@/widgets/auth";

interface ConsultationsSegmentProps {
  servicePrices: DoctorServicePriceModel[];
  setActiveConsultationType?: Dispatch<SetStateAction<string>>;
  setActivePrice?: Dispatch<SetStateAction<string>>;
  isReadonly?: boolean;
}

export const ConsultationsSegment: FC<ConsultationsSegmentProps> = ({
  servicePrices,
  setActivePrice,
  setActiveConsultationType,
  isReadonly = false,
}) => {
  console.log("servicePrices");
  console.log(servicePrices);
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.Clinics");
  const [consultationType, setConsultationType] = useState<number>(0);
  const [
    onlineFirstPrice,
    ,
    offlineFirstPrice,
    offlineSecondPrice,
    awayFirstPrice,
    awaySecondPrice,
  ] = useMemo(() => {
    const onlineService = servicePrices?.services?.find(
      (servicePrice) =>
        servicePrice?.consultation_type === CONSULTATION_TYPE.ONLINE
    );
    const offlineService = servicePrices?.services?.find(
      (servicePrice) =>
        servicePrice?.consultation_type === CONSULTATION_TYPE.OFFLINE
    );
    const awayService = servicePrices?.services?.find(
      (servicePrice) =>
        servicePrice?.consultation_type === CONSULTATION_TYPE.AWAY
    );

    return [
      onlineService?.first_price,
      onlineService?.second_price,
      offlineService?.first_price,
      offlineService?.second_price,
      awayService?.first_price,
      awayService?.second_price,
    ];
  }, [servicePrices]);

  const setOnlineConsultation = useCallback(() => {
    setActivePrice?.(onlineFirstPrice ?? "");
    setActiveConsultationType?.("online");
    setConsultationType(0);
  }, [onlineFirstPrice, setActiveConsultationType, setActivePrice]);

  const setOfflineConsultation = useCallback(() => {
    setActivePrice?.(offlineFirstPrice ?? "");
    setActiveConsultationType?.("hospital");
    setConsultationType(1);
  }, [offlineFirstPrice, setActiveConsultationType, setActivePrice]);

  const setHomeConsultation = useCallback(() => {
    setActivePrice?.(awayFirstPrice ?? "");
    setActiveConsultationType?.("home");
    setConsultationType(2);
  }, [awayFirstPrice, setActiveConsultationType, setActivePrice]);

  return (
    <Island className="mt-2">
      <div className="mb-4 text-Bold20 text-dark">{t("ChooseService")}</div>
      {onlineFirstPrice && (
        <Island
          className="mb-3 rounded-xl shadow-card"
          onClick={isReadonly ? undefined : setOnlineConsultation}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-0">
              {!isReadonly && (
                <RadioSaunet
                  className="mr-0"
                  checked={consultationType === 0}
                  onChange={setOnlineConsultation}
                />
              )}
              <div>{t("OnlineConsultation2")}</div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-ultraLight">
              <VideoCameraFilledIcon size="md" color="brand-primary" />
            </div>
          </div>
          <div className="mb-2 flex items-center">
            <CheckIcon size="sm" />
            <div className="ml-3 text-Regular14 text-gray-secondary">
              {tMob("ServiceTime", { price: onlineFirstPrice })}
            </div>
          </div>
          <div className="flex items-center">
            <CheckIcon size="sm" />
            <div className="ml-3 text-Regular14 text-gray-secondary">
              {tMob("VideoconferenceWithPeople", { count: 5 })}
            </div>
          </div>
        </Island>
      )}
      {offlineFirstPrice && (
        <Island
          className="mb-3 rounded-xl shadow-card"
          onClick={isReadonly ? undefined : setOfflineConsultation}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-0">
              {!isReadonly && (
                <RadioSaunet
                  className="mr-0"
                  checked={consultationType === 1}
                  onChange={setOfflineConsultation}
                />
              )}
              <div>{t("ClinicAdmission")}</div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-ultraLight">
              <MedicalClipboardIcon size="md" color="brand-primary" />
            </div>
          </div>

          <div className="mb-2 flex items-center">
            <CheckIcon size="sm" />
            <div className="ml-3 text-Regular14 text-gray-secondary">
              {tMob("FirstPrice", { price: offlineFirstPrice })}
            </div>
          </div>
          {offlineSecondPrice && (
            <div className="flex items-center">
              <CheckIcon size="sm" />
              <div className="ml-3 text-Regular14 text-gray-secondary">
                {tMob("SecondPrice", { price: offlineSecondPrice })}
              </div>
            </div>
          )}
        </Island>
      )}
      {awayFirstPrice && (
        <Island
          className="rounded-xl shadow-card"
          onClick={isReadonly ? undefined : setHomeConsultation}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-0">
              {!isReadonly && (
                <RadioSaunet
                  className="mr-0"
                  checked={consultationType === 2}
                  onChange={setHomeConsultation}
                />
              )}
              <div>{t("HouseCall2")}</div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-ultraLight">
              <MedicalAidKitIcon size="md" color="brand-primary" />
            </div>
          </div>
          <div className="mb-2 flex items-center">
            <CheckIcon size="sm" />
            <div className="ml-3 text-Regular14 text-gray-secondary">
              {tMob("FirstPrice", { price: awayFirstPrice })}
            </div>
          </div>
          {awaySecondPrice && (
            <div className="flex items-center">
              <CheckIcon size="sm" />
              <div className="ml-3 text-Regular14 text-gray-secondary">
                {tMob("SecondPrice", { price: awaySecondPrice })}
              </div>
            </div>
          )}
        </Island>
      )}
    </Island>
  );
};
