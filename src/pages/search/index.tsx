import type { ReactElement } from "react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";

import type { TabsProps } from "antd";
import { debounce } from "lodash";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
// import { useTranslations } from "next-intl";

import { patientSearchApi } from "@/shared/api/patientContent/searchBy";
import { DividerSaunet, Island, TabsSaunet } from "@/shared/components";
import { GrayInputSearch } from "@/shared/components/molecules/input/GrayInputSearch";
import { MainLayout } from "@/shared/layout";
import { highlightText } from "@/shared/utils/higlightText";

type Tab = "specializations" | "clinics" | "doctors";

const tabItems: TabsProps["items"] = [
  { key: "specializations", label: "Специализации" },
  { key: "clinics", label: "Клиники" },
  { key: "doctors", label: "Врачи" },
];

export default function SearchPage() {
  // const t = useTranslations("Common");
  const router = useRouter();
  const { searchType } = router.query;
  const placeholder = "Поиск";
  const [searchValue, setSearchValue] = useState<string>("");
  const [currentActiveTab, setCurrentActiveTab] =
    useState<Tab>("specializations");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>("");

  const debouncedSetSearchValue = useCallback(
    debounce((value: string) => {
      setDebouncedSearchValue(value);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSetSearchValue(searchValue);
  }, [searchValue, debouncedSetSearchValue]);

  const { data: searchResult } = useQuery(
    ["getSearchResult", debouncedSearchValue],
    () =>
      (searchType === "onlineConsultations"
        ? patientSearchApi.getOnlineSearchResult(debouncedSearchValue)
        : searchType === "analysis"
        ? patientSearchApi.getAnalysisSearchResult(debouncedSearchValue)
        : patientSearchApi.getSearchResult(debouncedSearchValue)
      ).then((res) => res.data),
    { enabled: !!debouncedSearchValue }
  );

  return (
    <div>
      <div className="flex w-full items-center justify-between rounded-b-3xl bg-white p-4">
        <div className="flex-1">
          <GrayInputSearch
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            placeholder={placeholder}
            searchType={searchType as string}
          />
        </div>
        <div className="ml-4 text-Regular16" onClick={() => router.back()}>
          Отмена
        </div>
      </div>

      {!searchResult?.specialities.length &&
      !searchResult?.doctors.length &&
      !searchResult?.doctors.length ? (
        <div className="mt-64 flex flex-col items-center justify-center text-center">
          <div className="mb-3 text-Bold24">Ничего не найдено</div>
          <div className="mt-3 text-secondaryText">
            Попробуйте изменить запрос и повторить попытку
          </div>
        </div>
      ) : (
        <>
          <TabsSaunet
            className="ml-4 bg-gray-2"
            items={tabItems}
            defaultActiveKey={currentActiveTab}
            onTabClick={(tab) => setCurrentActiveTab(tab as Tab)}
            tabBarGutter={16}
          />
          {currentActiveTab === "specializations" && (
            <Island className="flex grow flex-col !rounded-t-none">
              <div className="grow overflow-auto">
                {searchResult?.specialities.length ? (
                  searchResult?.specialities
                    .filter((specialization) =>
                      specialization.name
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                    )
                    .map((specialization) => (
                      <Fragment key={specialization.id}>
                        <div
                          className="flex h-16 items-center justify-start"
                          onClick={() =>
                            router.push(
                              `/doctors?speciality=${specialization.id}`
                            )
                          }
                        >
                          <div className="flex items-center justify-start">
                            <div className="mb-1 text-Regular16">
                              {highlightText(specialization.name, searchValue)}
                            </div>
                          </div>
                        </div>
                        <DividerSaunet className="m-0" />
                      </Fragment>
                    ))
                ) : (
                  <div>Ничего не найдено</div>
                )}
              </div>
            </Island>
          )}

          {currentActiveTab === "clinics" && (
            <Island className="flex grow flex-col !rounded-t-none">
              <div className="grow overflow-auto">
                {searchResult.clinics.length ? (
                  searchResult?.clinics
                    .filter((clinic) =>
                      clinic.name
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                    )
                    .map((clinic) => (
                      <Fragment key={clinic.id}>
                        <div
                          className="flex h-16 items-center justify-start"
                          onClick={() =>
                            router.push(
                              `/clinics/map?widget=clinics&clinicId=${clinic.id}`
                            )
                          }
                        >
                          <div className="flex items-center justify-start">
                            <div className="mb-1 text-Regular16">
                              {highlightText(clinic.name, searchValue)}
                            </div>
                          </div>
                        </div>
                        <DividerSaunet className="m-0" />
                      </Fragment>
                    ))
                ) : (
                  <div>Ничего не найдено</div>
                )}
              </div>
            </Island>
          )}

          {currentActiveTab === "doctors" && (
            <Island className="flex grow flex-col !rounded-t-none">
              <div className="grow overflow-auto">
                {searchResult?.doctors.length ? (
                  searchResult?.doctors
                    .filter(
                      (doctor) =>
                        doctor.first_name
                          .toLowerCase()
                          .includes(searchValue.toLowerCase()) ||
                        doctor.last_name
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                    )
                    .map((doctor) => (
                      <Fragment key={doctor.id}>
                        <div
                          className="flex h-16 items-center justify-start"
                          onClick={() => router.push(`/doctor/${doctor.id}`)}
                        >
                          <div className="flex">
                            <div className="flex flex-col justify-start">
                              <div className="text-secondaryText mb-1">
                                {doctor?.specialities?.[0]?.name}
                              </div>
                              <div className="mb-1 text-Regular16">
                                {highlightText(
                                  `${doctor.first_name} ${doctor.last_name}`,
                                  searchValue
                                )}
                              </div>
                              <div className="text-secondaryText">психолог</div>
                            </div>
                          </div>
                        </div>
                        <DividerSaunet className="m-0" />
                      </Fragment>
                    ))
                ) : (
                  <div>Ничего не найдено</div>
                )}
              </div>
            </Island>
          )}
        </>
      )}
    </div>
  );
}

SearchPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
