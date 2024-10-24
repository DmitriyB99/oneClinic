/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useQuery } from "react-query";

import {
  GeolocationControl,
  Map,
  Placemark,
  YMaps,
  ZoomControl,
} from "@pbe/react-yandex-maps";

import { clinicsApi } from "@/shared/api/clinics";
import { mapKey } from "@/shared/config";

import type {
  Coords,
  AmbulanceOrderMapProps,
} from "../models/AmbulanceOrderMapModel";

const placemarkOptions = {
  iconLayout: "default#image",
  iconImageHref: "/Placemark.svg",
  iconImageSize: [32, 42],
  iconImageOffset: [0, 0],
  draggable: true,
};

const placemarkOptionsDesktop = {
  iconLayout: "default#image",
  iconImageHref: "/Placemark.svg",
  iconImageSize: [12, 22],
  iconImageOffset: [0, 0],
  draggable: true,
};

export const AmbulanceOrderMap: FC<AmbulanceOrderMapProps> = ({
  userCoordinates,
  setAddressData,
  setSelectedMap,
  width = "100vw",
  height = "100vh",
  desktop,
}) => {
  const ymaps = useRef<any>(null);

  const [clinicPointsOnMap, setClinicPointsOnMap] = useState<
    Array<[number, number]>
  >([]);

  const { data: clinicsData } = useQuery(["getClinics"], () =>
    clinicsApi.getClinics()
  );

  useEffect(() => {
    setClinicPointsOnMap(
      clinicsData?.data?.content?.map((clinic) => [
        clinic?.locationPoint?.latitude,
        clinic?.locationPoint?.longitude,
      ]) ?? []
    );
  }, [clinicsData?.data?.content]);

  const mapConfig = useMemo(
    () => ({
      center: userCoordinates,
      zoom: 12,
      controls: [],
    }),
    [userCoordinates]
  );

  const [placemarkCoords, setPlacemarkCoords] =
    useState<Coords>(userCoordinates);

  const handleAddressAutoDetection = useCallback(
    (coords: Coords) => {
      if (!ymaps?.current?.geocode) return;

      ymaps.current.geocode(coords).then((res: any) => {
        const geoObject = res.geoObjects.get(0);
        const addressInfo = res.geoObjects.get(0)?.properties?.getAll();

        if (addressInfo) {
          const { name: streetAddress, boundedBy } = addressInfo;
          const city = geoObject.getLocalities()[0] || geoObject.getAdministrativeAreas()[0] || "";
          const coordsX = (boundedBy[0][0] + boundedBy[1][0]) / 2;
          const coordsY = (boundedBy[0][1] + boundedBy[1][1]) / 2;
          const coords = [
            parseFloat(coordsX.toFixed(6)),
            parseFloat(coordsY.toFixed(6)),
          ];
          console.log('coords')
          console.log(coords)
          setAddressData(streetAddress, coords, "62633ab4-ebeb-47c4-9d51-94340f7f44e2"); // NEWTODO: remove hardcode with cityId
        }
      });
    },
    [setAddressData]
  );

  const handlePlacemarkDragEnd = useCallback(
    (event: any) => {
      const newCoords =
        event?.originalEvent?.target?.geometry?._coordinates || userCoordinates;

      handleAddressAutoDetection(newCoords);
    },
    [handleAddressAutoDetection, userCoordinates]
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const initialPlacemarkCoords: Coords = [
          coords.latitude,
          coords.longitude,
        ];
        setPlacemarkCoords(initialPlacemarkCoords);
        handleAddressAutoDetection(initialPlacemarkCoords);
      });
    }
  }, [handleAddressAutoDetection]);

  const handleMyLocationChange = useCallback(
    (event: any) => {
      const newCoords = event.get("position");
      setPlacemarkCoords(newCoords);
      handleAddressAutoDetection(newCoords);
    },
    [handleAddressAutoDetection]
  );

  return (
    <YMaps query={{ load: "package.full", apikey: mapKey }}>
      <Map
        state={mapConfig}
        width={width}
        height={height}
        onActionBegin={() => setSelectedMap?.(true)}
        onLoad={(event: any) => {
          ymaps.current = event;
        }}
      >
        <ZoomControl
          options={{
            size: "small",
            position: { top: "25vh", right: "2vw" },
          }}
        />
        <GeolocationControl
          onLocationChange={handleMyLocationChange}
          options={{
            position: { top: "40vh", right: "2vw" },
          }}
        />
        <Placemark
          geometry={placemarkCoords}
          options={desktop ? placemarkOptionsDesktop : placemarkOptions}
          onDragEnd={handlePlacemarkDragEnd}
        />
        {clinicPointsOnMap.map((point) => (
          <Placemark
            key={point[0] + point[1]}
            options={{
              iconLayout: "default#image",
              iconImageHref: "/customerPin.png",
              iconImageSize: [100, 80],
              iconImageOffset: [-50, -40],
            }}
            geometry={[point[1], point[0]]}
          />
        ))}
      </Map>
    </YMaps>
  );
};
