import type { FC } from "react";
import { useContext, useMemo } from "react";
import { useQuery } from "react-query";

import { ArrowRightOutlined } from "@ant-design/icons";
import { SplideSlide } from "@splidejs/react-splide";
import { useTranslations } from "next-intl";

import { clinicsApi } from "@/shared/api/clinics";
import { patientClinicsApi } from "@/shared/api/patientContent/clinics";
import {
  Avatar,
  Carousel,
  Island,
  SaunetIcon,
  StarIcon,
} from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";

// Функция для генерации фейковых данных
const generateFakeClinics = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    clinicId: `clinic-${index + 1}`,
    name: `Клиника ${index + 1}`,
    rating: Math.random() * 5,
  }));

export const CityClinics: FC<{
  handleExpandClick: (clinicId?: string) => void;
}> = ({ handleExpandClick }) => {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.Clinics");
  const { userCity } = useContext(UserContext);

  const { data: clinicsData } = useQuery(["getClinics"], () =>
    patientClinicsApi.getPopularCityClinics().then((res) => res.data)
  );

  const clinicsCount = useMemo(
    () => clinicsData?.length ?? 0,
    [clinicsData?.length]
  );

  return (
    <Island className="mt-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-0 text-Bold20">
            {tMob("ClinicsInCity", { city: userCity })}
          </p>
          {clinicsCount === 0 && (
            <p className="mb-0 mt-2 text-Regular14 text-gray-secondary">
              {tMob("ThereNoClinicsInThisCityYet")}
            </p>
          )}
        </div>
        <div
          className="flex cursor-pointer rounded-3xl bg-gray-2 px-3 py-1 text-Medium12"
          onClick={() => handleExpandClick()}
          onKeyDown={() => handleExpandClick()}
        >
          <span className="mr-1">{clinicsCount === 0 ? t("Map") : `Все`}</span>
          <ArrowRightOutlined />
        </div>
      </div>
      <Carousel
        customSlides
        items={
          clinicsData?.map((clinic) => (
            <SplideSlide key={clinic.id} className="mb-4 mr-3 mt-6 !w-[150px]">
              <Island
                isCard
                className="flex items-center"
                onClick={() => {
                  handleExpandClick(clinic.id);
                }}
              >
                <Avatar
                  size="xs"
                  isSquare
                  icon={<SaunetIcon size="avatar" />}
                  src={clinic?.icon_url || null}
                />
                <div className="ml-2">
                  <p className="mb-1 text-Semibold12">{clinic.name}</p>
                  <div className="flex items-center">
                    <StarIcon size="xs" />
                    <p className="mb-0 ml-1 text-Semibold12">
                      {clinic.rating.toFixed(1)}
                    </p>
                  </div>
                </div>
              </Island>
            </SplideSlide>
          )) ?? []
        }
      />
    </Island>
  );
};
