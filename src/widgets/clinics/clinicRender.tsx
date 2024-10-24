import type { Dispatch, FC, SetStateAction } from "react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";

import { SplideSlide } from "@splidejs/react-splide";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import type { GetClinicsQueryParams } from "@/entities/clinics";
import {
  ClinicsFilterDialog,
  defaultFilter,
} from "@/entities/clinics/ui/ClinicsFilterDialog";
import { clinicsApi } from "@/shared/api/clinics";
import { patientClinicsApi, type ClinicsFilter } from "@/shared/api/patientContent/clinics";
import {
  Avatar,
  Button,
  Carousel,
  Chips,
  FilterIcon,
  Island,
  OnlineIcon,
  StarIcon,
} from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";
import { convertStringToAvatarLabel } from "@/shared/utils";
import { ClinicWidget } from "@/widgets/clinics/clinicWidget";

export const ClinicRender: FC<{
  handleShowOnMap: (latitude: number, longitude: number) => void;
  setPointsOnMap: Dispatch<SetStateAction<Array<[number, number, string]>>>;
}> = ({ setPointsOnMap, handleShowOnMap }) => {
  const [filters, setFilters] = useState<ClinicsFilter>(defaultFilter);

  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.Clinics");
  // const [filters, setFilters] = useState<string[]>([]);
  const { userCoordinates } = useContext(UserContext);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState<boolean>(false);
  const [isClinicDialogOpen, setIsClinicDialogOpen] = useState<boolean>(false);

  // const queryParamsByFilters = useMemo(() => {
  //   const params: GetClinicsQueryParams = {};
  //   if (filters.includes("Рейтинг")) {
  //     params["sort"] = "rating,desc";
  //   }
  //   if (filters.includes("Рядом со мной")) {
  //     params["latitude"] = userCoordinates?.[0];
  //     params["longitude"] = userCoordinates?.[1];
  //   }
  //   if (filters.includes("График")) {
  //     params["sort"] = "schedule"; // TODO: not sure what to put here
  //   }
  //   return params;
  // }, [filters, userCoordinates]);

  const { data: clinicsData } = useQuery(
    ["getClinics", filters],
    () =>
      patientClinicsApi
        .getClinics(filters)
        ?.then((res) => res?.data)
  );

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // useEffect(() => {
  //   setPointsOnMap(
  //     clinicsData?.map((clinic) => [
  //       clinic?.locationPoint?.latitude,
  //       clinic?.locationPoint?.longitude,
  //       clinic?.id,
  //     ]) ?? []
  //   );
  // }, [clinicsData, setPointsOnMap]);

  const router = useRouter();
  // if (router.query.clinicId) {
  //   return (
  //     <ClinicWidget
  //       handleShowOnMap={handleShowOnMap}
  //       onBack={() => router.back()}
  //     />
  //   );
  // }
  return (
    <>
      <Island className="!px-4 !pt-8">
        <div className="flex justify-between">
          <p className="mb-0 text-Bold24">{t("Clinics")}</p>
          <Button
            iconButton
            icon={<FilterIcon />}
            variant="tertiary"
            size="s"
            onClick={() => setIsFilterDialogOpen(true)}
            className="z-50"
          />
        </div>

        <Chips
          onChange={(value) => setFilters(value as string[])}
          chipLabels={["Рядом со мной", "Открыто сейчас", "Круглосуточно"]}
          type="multiselect"
          className="mb-0"
        />
      </Island>

      {clinicsData && clinicsData.length !== 0 ? (
        clinicsData.map((clinic) => (
          <Island
            key={clinic.id}
            className="mx-4 my-3 !p-0 !pr-4 !pt-4"
            onClick={
              () => {
                setIsClinicDialogOpen(true);
                router.push({
                  pathname: "map",
                  query: { widget: "clinics", clinicId: clinic?.id },
                })}
            }
          >
            <div className="flex pl-4">
              <Avatar
                src={clinic?.icon_url}
                text={convertStringToAvatarLabel(clinic?.name)}
                size="clinicAva"
              />
              <div className="ml-4 w-full">
                <p className="mb-0 text-Bold16">{clinic?.name}</p>
                <p className="mb-1 text-Regular12">{`ул. ${clinic?.street} ${clinic?.build_number}`}</p>
                <div className="mb-2 flex items-center">
                  <StarIcon size="xs" />
                  <p className="mb-0 ml-1 text-Semibold12">
                    {clinic?.rating?.toFixed(1) ?? "0"}
                  </p>
                  <p className="mb-0 ml-2 text-Regular12 text-secondaryText">
                    {t("AmountOffReviews", { amount: clinic?.reviews_count })}
                  </p>
                </div>
                <div className="mb-3 flex items-center">
                  <OnlineIcon size="xs" />
                  <p className="mb-0 ml-1 text-Regular12">
                    {clinic?.work_period?.start_time && `Сегодня c ${clinic?.work_period?.start_time} до ${clinic?.work_period?.end_time}`}
                  </p>
                </div>
                {/* <Button block size="s">
                {t("Register")}
              </Button> */}
              </div>
            </div>
            {/* <Chips
            chipLabels={clinic?.tags ?? []}
            type="suggest"
            className="my-4 ml-4"
          /> */}
            <Island className="m-0 !p-0">
              <Carousel
                customSlides
                items={clinic?.services.map((service) => (
                  <SplideSlide key={service.id} className="mb-4 ml-4 !w-[166px] p-0">
                    <Island isCard>
                      <p className="mb-1 text-Regular16">
                        {service.name}
                      </p>
                      <p className="mb-0 text-Regular12">{service.price} ₸</p>
                    </Island>
                  </SplideSlide>
                ))}
              />
            </Island>
          </Island>
        ))
      ) : (
        <div>По данному фильтру нет клиник</div>
      )}
      <ClinicsFilterDialog
        isOpen={isFilterDialogOpen}
        setIsOpen={setIsFilterDialogOpen}
        onFiltersChange={handleFiltersChange}
      />

      <ClinicWidget
        handleShowOnMap={handleShowOnMap}
        isOpen={isClinicDialogOpen}
        setIsOpen={setIsClinicDialogOpen}
      />
    </>
  );
};
