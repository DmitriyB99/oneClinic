import type { ReactElement } from "react";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";

import { ArrowRightOutlined } from "@ant-design/icons";
import { Input } from "antd";
import clsx from "clsx";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { medicalTestBookingApi } from "@/shared/api/medicalTestBooking";
import type { ListType } from "@/shared/components";
import {
  ArrowLeftIcon,
  Island,
  Navbar,
  InteractiveList,
  Microscope,
  Button,
  SearchIcon,
} from "@/shared/components";
import { GrayInputSearch } from "@/shared/components/molecules/input/GrayInputSearch";
import { CityClinics } from "@/widgets/clinics/CityClinics";
import { MedicalTestsListDialog } from "@/widgets/medicalTest/MedicalTestListDialog";
export const medicalTests: ListType[] = [
  {
    title: "25-OH Витамин D",
    id: 1,
  },
  {
    title: "Общий клинический анализ крови",
    id: 2,
  },
  {
    title: "Витамин В12",
    id: 3,
  },
  {
    title: "Общий белок крови",
    id: 4,
  },
  {
    title: "Тиреотропный гормон ТТГ",
    id: 5,
  },
  {
    title: "Анализ кала",
    id: 6,
  },
  {
    title: "Анализ мочи",
    id: 7,
  },
];

export default function MedicalTestPage() {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.MedicalTest");
  const router = useRouter();
  const [isPopularTestsOpen, setIsPopularTestsOpen] = useState<boolean>(false);
  const [isMyMedicalTestsOpen, setIsMyMedicalTestsOpen] =
    useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const handlePopularMedicalTestClick = useCallback(() => {
    router.push({ pathname: "clinics/map", query: { widget: "doctors" } });
  }, [router]);

  const handleClinicClick = useCallback(
    (clinicId?: string) => {
      router.push({
        pathname: "clinics/map",
        query: { widget: "clinics", ...(!!clinicId && { clinicId: clinicId }) },
      });
    },
    [router]
  );
  const handleMedicalTestClick = useCallback(
    (id?: string | number) => {
      if (id === "0") {
        router.push({ pathname: "clinics/map", query: { widget: "clinics" } });
      } else {
        router.push({ pathname: `medicalCard/analysis/${id}` });
      }
    },
    [router]
  );

  const { data: myMedicalTestResults } = useQuery(
    ["myMedicalTestResults"],
    () => medicalTestBookingApi?.getMyBookings(0)
  );

  const myMedicalTestResultsList = useMemo(
    () =>
      (myMedicalTestResults?.data?.content ?? []).map(
        (myMedicalTestResult) => ({
          title: myMedicalTestResult?.name,
          description: myMedicalTestResult?.analysisTypeName,
          id: myMedicalTestResult?.bookingMedicalTestSlotId,
          endIcon: (
            <div
              className={clsx(
                "h-6 rounded-3xl bg-lightPositive px-2 py-1 text-Regular12 text-positiveStatus"
              )}
            >
              {t("Ready")}
            </div>
          ),
        })
      ),
    [myMedicalTestResults?.data?.content, t]
  );

  return (
    <div>
      <Navbar
        title={t("Analyzes")}
        leftButtonOnClick={() => router.back()}
        buttonIcon={<ArrowLeftIcon />}
        className="px-4"
      />
      <div className="w-full rounded-b-3xl bg-white px-4 pb-4 pt-3">
        <GrayInputSearch
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          placeholder="Поиск по анализам"
          searchType="analysis"
        />
        <div className="mt-7 flex items-center justify-between">
          <div className="text-Bold20">{tMob("MyAnalysis")}</div>
          {myMedicalTestResults?.data?.content &&
          myMedicalTestResults?.data?.content?.length > 0 ? (
            <Button
              variant="tertiary"
              className="h-8 !p-0"
              onClick={() => {
                setIsMyMedicalTestsOpen(true);
              }}
            >
              <div className="flex cursor-pointer rounded-3xl bg-gray-2 px-3 py-1 text-Medium12">
                <span className="mr-1">
                  {t("All")} {myMedicalTestResults?.data?.content?.length}
                </span>
                <ArrowRightOutlined />
              </div>
            </Button>
          ) : (
            <div />
          )}
        </div>
        <InteractiveList
          list={
            (myMedicalTestResults?.data?.content?.length ?? 0) > 0
              ? myMedicalTestResultsList
              : [
                  {
                    title: tMob("PassFirstAnalysis"),
                    description: "Найдите клинику и запишитесь на прием",
                    id: "0",
                    startIcon: (
                      <div className="rounded-xl bg-lightPositive p-2">
                        <Microscope />
                      </div>
                    ),
                  },
                ]
          }
          onClick={handleMedicalTestClick}
          maxItems={3}
        />
      </div>
      <CityClinics handleExpandClick={handleClinicClick} />

      <Island className="mt-2 !p-4">
        <div className="flex items-center justify-between">
          <p className="mb-0 text-Bold20">{t("PopularAnalysis")} </p>
          <Button
            variant="tertiary"
            className="h-8 !p-0"
            onClick={() => {
              setIsPopularTestsOpen(true);
            }}
          >
            <div className="flex cursor-pointer rounded-3xl bg-gray-2 px-3 py-1 text-Medium12">
              <span className="mr-1">{t("All")} </span>
              <ArrowRightOutlined />
            </div>
          </Button>
        </div>
        <InteractiveList
          list={medicalTests}
          onClick={handlePopularMedicalTestClick}
          maxItems={3}
        />
      </Island>
      <MedicalTestsListDialog
        title={t("PopularAnalysis")}
        handleMedicalTestClick={handlePopularMedicalTestClick}
        isOpen={isPopularTestsOpen}
        medicalTests={medicalTests}
        setIsOpen={setIsPopularTestsOpen}
      />
      <MedicalTestsListDialog
        handleMedicalTestClick={handleMedicalTestClick}
        isOpen={isMyMedicalTestsOpen}
        medicalTests={myMedicalTestResultsList}
        setIsOpen={setIsMyMedicalTestsOpen}
        title={tMob("MyAnalysis")}
      />
    </div>
  );
}

MedicalTestPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
