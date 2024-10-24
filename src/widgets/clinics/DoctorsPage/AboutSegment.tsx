import type { FC } from "react";
import { useMemo } from "react";

import { ArrowRightOutlined } from "@ant-design/icons";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

import type { AboutSegmentProps } from "@/entities/clinics";
import type { ListType } from "@/shared/components";
import {
  ArrowRightIcon,
  Avatar,
  FilePdfIcon,
  InteractiveList,
  Island,
  List,
  SaunetIcon,
  StarIcon,
} from "@/shared/components";
import { mapKey } from "@/shared/config";

import { EducationBlock } from "./EducationBlock";

const placemarkOptions = {
  iconLayout: "default#image",
  iconImageHref: "/customerPin.png",
  iconImageSize: [100, 80],
  iconImageOffset: [-50, -40],
};

export const AboutSegment: FC<AboutSegmentProps> = ({
  studyDegrees,
  clinicInfo = {
    title: "Clinic Information",
    address: "Address",
    locationPoint: {
      x: 0,
      y: 0,
    },
  },
}) => {
  const mapConfig = useMemo(
    () => ({
      center: [
        clinicInfo?.locationPoint?.y ?? 0,
        clinicInfo?.locationPoint?.x ?? 0,
      ],
      controls: [],
      zoom: 12,
    }),
    [clinicInfo?.locationPoint?.x, clinicInfo?.locationPoint?.y]
  );

  const doctorsCertificates = studyDegrees?.doctor_certificate.map(
    (certificate) => ({
      title: certificate?.name ?? "Сертификат о прохождении курсов",
      description: certificate?.year_ended ?? "2024",
      endIcon: <FilePdfIcon size="md" />,
      id: certificate?.certificate_url,
    })
  );

  return (
    <>
      <EducationBlock educations={studyDegrees?.doctor_study_degree} />
      <Island className="mt-2">
        <p className="mb-3 text-Bold20">Сертификаты</p>
        <InteractiveList
          list={doctorsCertificates}
          onClick={() => {
            console.log("open certificate URL in new tab");
          }}
          maxItems={5}
        />
      </Island>

      {clinicInfo && (
        <Island className="mt-2">
          <div className="mb-3 flex items-center justify-between">
            <p className="!mb-0 text-Bold20">Медицинское учереждение</p>
            <div
              className="flex cursor-pointer rounded-3xl bg-gray-2 px-4 py-2 text-Bold16"
              // onClick={() => setIsOpen(true)}
            >
              <ArrowRightOutlined />
            </div>
          </div>

          {/* <List
            items={[
              {
                title: clinicInfo?.title ?? "",
                description: clinicInfo?.address ?? "",
                icon: <SaunetIcon size="lg" />,
                id: "OneClinic",
              },
            ]}
          /> */}
          <div key="2" className="flex items-center justify-between py-3">
            <div className="flex items-center">
              <Avatar
                isSquare
                className="mr-3 bg-brand-light"
                icon={<SaunetIcon size="lg" />}
                src={studyDegrees?.doctor_clinic[0]?.icon_url}
              />
              <div>
                <p className="mb-1 text-Regular16">{studyDegrees?.doctor_clinic[0]?.name}</p>
                <div className="flex items-center">
                  <StarIcon size="xs" />
                  <p className="mb-0 ml-1 text-Semibold12">{studyDegrees?.doctor_clinic[0]?.rating}</p>
                  <p className="mb-0 ml-2 text-Regular12 text-secondaryText">
                  {studyDegrees?.doctor_clinic[0]?.review_count} отзыва
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1 text-Regular16">{studyDegrees?.doctor_clinic[0]?.working_hours[0]?.start_time} - {studyDegrees?.doctor_clinic[0]?.working_hours[0]?.end_time}</p>
              <div className="flex items-center">
                <p className="mb-0 ml-2 text-Regular12 text-secondaryText">
                  Пн, Вт, Ср, Чт, Пт
                </p>
              </div>
            </div>
          </div>

          {clinicInfo?.locationPoint && (
            <YMaps query={{ load: "package.full", apikey: mapKey }}>
              <Map state={mapConfig} width="100%" height="200px">
                <Placemark
                  options={placemarkOptions}
                  geometry={[
                    studyDegrees?.doctor_clinic[0]?.latitude,
                    studyDegrees?.doctor_clinic[0]?.longitude,
                    // clinicInfo.locationPoint.y,
                    // clinicInfo.locationPoint.x,
                  ]}
                />
              </Map>
            </YMaps>
          )}
        </Island>
      )}
    </>
  );
};
