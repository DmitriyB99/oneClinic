import type { FC } from "react";
import { useContext, useEffect, useMemo, useState } from "react";

import { ArrowRightOutlined } from "@ant-design/icons";
import { YMaps, Map, ZoomControl, Placemark } from "@pbe/react-yandex-maps";
import { useRouter } from "next/router";

import type { Clinic } from "@/entities/clinics";
import type { ClinicPhoneNumber, WorkPeriod } from "@/shared/api/clinics";
import { Button, DividerSaunet, Island, LinkSaunet } from "@/shared/components";
import { mapKey } from "@/shared/config";
import { UserContext } from "@/shared/contexts/userContext";
import { AboutClinic } from "@/widgets/clinics/AboutClinic";
import { RatingClinicComponent } from "@/widgets/clinics/Rating";
import { WorkDaysClinic } from "@/widgets/clinics/WorkDays";

export const AboutClinicSegment: FC<
  Partial<Clinic> & {
    handleShowOnMap: (latitude: number, longitude: number) => void;
    phone_number?: ClinicPhoneNumber[];
    workPeriods?: WorkPeriod[];
  }
> = (clinicData) => {
  const {
    phone_number,
    street,
    handleShowOnMap,
    work_periods,
    email,
    rating,
    location,
    id
  } = clinicData ?? {};
  const defaultPhoneNumber = useMemo(
    () =>
      clinicData.phone_number?.find(
        (phoneNumber) => phoneNumber.type === "DEFAULT"
      )?.phoneNumber,
    [clinicData.phone_number]
  );
  const [selectedMap, setSelectedMap] =
    useState<boolean | undefined>(undefined);

  const { userCoordinates, getLocationNative } = useContext(UserContext);
  const [pointsOnMap, setPointsOnMap] = useState<
    Array<[number, number, string]>
  >([]);
  const router = useRouter();

  const [mapConfig, setMapConfig] = useState<{
    center: number[];
    controls: string[];
    zoom: number;
  }>({
    center: userCoordinates,
    zoom: 12,
    controls: [],
  });

  useEffect(() => {
    getLocationNative();
  }, [getLocationNative]);
  return (
    <div>
      <AboutClinic {...clinicData} />
      <WorkDaysClinic workingDays={work_periods ?? []} />
      <Island>
        <p className="mb-3 text-Bold20">Контакты</p>
        <div className="py-3">
          <p className="mb-1 text-Regular12 text-secondaryText">
            Номер телефона
          </p>
          <LinkSaunet href="tel:+7 (591) 595-14-52">
            {phone_number ?? defaultPhoneNumber ?? "+7 (482) 145-48-48"}
          </LinkSaunet>
        </div>
        <DividerSaunet className="m-0" />
        <div className="pt-3">
          <p className="mb-1 text-Regular12 text-secondaryText">Email</p>
          <LinkSaunet href="tel:9494">{email}</LinkSaunet>
        </div>
      </Island>
      <RatingClinicComponent ratingNumber={rating} />
      <Island className="mt-2">
        <div className="mb-4 flex items-center justify-between">
          <p className="mb-0 text-Bold20">Адрес</p>
          <Button
            size="s"
            variant="tinted"
            className="flex items-center rounded-full bg-gray-2 text-Medium12"
            onClick={() => {
              if (location[0] && location[1]) {
                handleShowOnMap?.(location[1], location[0]);
              }
            }}
          >
            Показать на карте
            <ArrowRightOutlined />
          </Button>
        </div>
        <YMaps query={{ load: "package.full", apikey: mapKey }}>
          <Map
            state={mapConfig}
            width="100%"
            // height="100vh"
            onActionBegin={() => setSelectedMap(true)}
          >
            <ZoomControl />
            <Placemark
              options={{
                iconLayout: "default#image",
                iconImageHref: "/pinLocation.svg",
                iconImageSize: [20, 20],
                iconImageOffset: [-10, -10],
                draggable: true,
              }}
              geometry={[mapConfig?.center?.[0], mapConfig?.center?.[1]]}
            />
            {pointsOnMap.map((point) => (
              <Placemark
                key={point[0] + point[1]}
                options={{
                  iconLayout: "default#image",
                  iconImageHref: "/customerPin.png",
                  iconImageSize: [100, 80],
                  iconImageOffset: [-50, -40],
                }}
                geometry={[point[1], point[0]]}
                onClick={() => {
                  router.push({
                    pathname: router.pathname,
                    query: { ...router.query, clinicId: point[2] },
                  });
                }}
              />
            ))}
          </Map>
        </YMaps>

        <div className="mt-3">
          <p className="mb-0 text-Regular16">{street}</p>
          <p className="mb-1 text-Regular12 text-secondaryText">
            1.7 км от вас
          </p>
        </div>
      </Island>
    </div>
  );
};
