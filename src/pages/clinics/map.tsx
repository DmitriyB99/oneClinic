import type { ReactElement } from "react";
import { useCallback, useContext, useEffect, useState } from "react";

import { YMaps, Map, ZoomControl, Placemark } from "@pbe/react-yandex-maps";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { ArrowLeftIcon, Button, MobileDialog } from "@/shared/components";
import { mapKey } from "@/shared/config";
import { UserContext } from "@/shared/contexts/userContext";
import { MainLayout } from "@/shared/layout";
import { ClinicRender } from "@/widgets/clinics/clinicRender";
import { DoctorRender } from "@/widgets/clinics/DoctorsPage/doctorsRender";

export default function MapSelected() {
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

  const handleShowOnMap = useCallback(
    (latitude: number, longitude: number) => {
      setMapConfig({ ...mapConfig, center: [latitude, longitude] });
    },
    [mapConfig]
  );

  const renderChildren = useCallback(() => {
    if (router.query.widget === "doctors") {
      return <DoctorRender />;
    }
    return (
      <ClinicRender
        setPointsOnMap={setPointsOnMap}
        handleShowOnMap={handleShowOnMap}
      />
    );
  }, [handleShowOnMap, router.query.widget]);

  return (
    <div className="relative flex h-screen flex-col overflow-y-hidden bg-gray-2">
      <div className="h-full overflow-y-hidden">
        <Button
          size="s"
          variant="tinted"
          className="absolute left-4 top-2 z-50 bg-gray-2"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon />
        </Button>
        <YMaps query={{ load: "package.full", apikey: mapKey }}>
          <Map
            state={mapConfig}
            width="100vw"
            height="100vh"
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
      </div>

      <MobileDialog hide={selectedMap} onHideChange={setSelectedMap}>
        {renderChildren()}
      </MobileDialog>
    </div>
  );
}

MapSelected.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
