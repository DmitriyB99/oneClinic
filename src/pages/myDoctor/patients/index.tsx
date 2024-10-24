import type { ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";

import type { TabsProps } from "antd";
import { Divider, Input } from "antd";
import dayjs from "dayjs";
import { debounce } from "lodash";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { doctorPatientsApi } from "@/shared/api/doctor/patients";
import type { ListType } from "@/shared/components";
import {
  ArrowLeftIcon,
  Avatar,
  Button,
  Dialog,
  FilterIcon,
  InteractiveList,
  Island,
  Navbar,
  RadioSaunet,
  SearchIcon,
  TabsSaunet,
} from "@/shared/components";
import { MainLayout } from "@/shared/layout";
import { convertStringToAvatarLabel } from "@/shared/utils";
import { highlightText } from "@/shared/utils/higlightText";

const tabItems: TabsProps["items"] = [
  {
    key: "fullName",
    label: `ФИО`,
  },
];

const MyDoctorPatients = () => {
  const t = useTranslations("Common");
  const router = useRouter();
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [isSortDialogOpen, setIsSortDialogOpen] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [totalPatientCount, setTotalPatientCount] = useState<number>(0);
  const [filteredPatients, setFilteredPatients] = useState<ListType[]>([]);
  const [pendingSortOrder, setPendingSortOrder] = useState<string | null>(null);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchString(value), 300),
    []
  );

  const { data: patients } = useQuery(
    ["getDoctorPatients", searchString, pendingSortOrder],
    () =>
      doctorPatientsApi
        .getPatients({
          page: 1,
          size: 999,
          sort: pendingSortOrder,
          search: searchString,
        })
        .then((res) => {
          setTotalPatientCount(res?.data?.total_count);
          const patientsData = res.data.result.map((patient) => {
            const date = dayjs(patient.appointment_date);
            const wasOrWillBe = date.isAfter(dayjs()) ? "Будет" : "Был";
            const properFormat =
              date.year() === dayjs().year() ? "DD MMMM" : "DD MMMM YYYY";
            const highlightedName = searchString
              ? highlightText(
                  `${patient.name} ${patient.surname}`,
                  searchString
                )
              : `${patient.name} ${patient.surname}`;

            return {
              id: patient.id,
              title: highlightedName,
              startIcon: (
                <Avatar
                  size="avatar"
                  src={patient?.photo_url}
                  text={convertStringToAvatarLabel(
                    `${patient.name} ${patient.surname}`
                  )}
                />
              ),
              description: `${wasOrWillBe} на приеме ${date.format(
                properFormat
              )}`,
            };
          });
          setFilteredPatients(patientsData);
          return patientsData;
        })
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  };

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
  };

  useEffect(
    () => () => {
      debouncedSearch.cancel();
    },
    [debouncedSearch]
  );

  return (
    <>
      <Island className="!p-0">
        <Navbar
          title={t("MyPatients")}
          description={`${totalPatientCount} человек`}
          leftButtonOnClick={() => router.back()}
          buttonIcon={<ArrowLeftIcon />}
          rightIcon={<FilterIcon />}
          rightIconOnClick={() => setIsSortDialogOpen(true)}
        />
        <div className="flex w-full items-center justify-between">
          <div className="mx-4 my-2 flex w-full items-center justify-between rounded-xl bg-gray-2 px-4 py-2">
            <SearchIcon className="mr-3 text-gray-icon" />
            <Input
              className="border-0 bg-gray-2 hover:border-0 focus:border-0"
              placeholder={isSearchMode ? "" : "Поиск по пациентам"}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchMode(true)}
            />
          </div>
          {isSearchMode && (
            <Button
              variant="tertiary"
              className="pl-0 pr-4 text-Regular14 text-blue"
              onClick={() => setIsSearchMode(false)}
            >
              {t("Abolish")}
            </Button>
          )}
        </div>

        {isSearchMode && (
          <div className="ml-4">
            <TabsSaunet items={tabItems} tabBarGutter={24} />
          </div>
        )}
      </Island>

      <Island className="mt-2">
        <InteractiveList
          list={filteredPatients ?? []}
          onClick={(id) => {
            router.push(`/myDoctor/patients/${id}`);
          }}
        />
      </Island>

      <Dialog isOpen={isSortDialogOpen} setIsOpen={setIsSortDialogOpen}>
        <Island className="w-full !p-0">
          <div className="flex items-center justify-between">
            <Button
              size="s"
              variant="tertiary"
              className="text-Regular14"
              onClick={() => {
                setIsSortDialogOpen(false);
              }}
            >
              Закрыть
            </Button>
            <div className="text-Bold16">Даты посещения</div>
            <div className="w-15" />
          </div>

          <div className="mt-4 flex items-center gap-0 px-2 py-4">
            <RadioSaunet
              className="mr-0"
              checked={sortOrder === "desc"}
              onChange={() => handleSortChange("desc")}
            />
            <div>По убыванию</div>
          </div>
          <Divider className="m-0 px-4" />

          <div className="mb-4 flex items-center gap-0 px-2 py-4">
            <RadioSaunet
              className="mr-0"
              checked={sortOrder === "asc"}
              onChange={() => handleSortChange("asc")}
            />
            <div>По возрастанию</div>
          </div>
          <div className="flex justify-between">
            <Button
              size="m"
              variant="secondary"
              className="mr-2 w-full text-Medium16"
              onClick={() => {
                setSortOrder("desc");
              }}
            >
              Сбросить
            </Button>
            <Button
              size="m"
              variant="primary"
              className="ml-2 w-full text-Medium16"
              onClick={() => {
                setPendingSortOrder(sortOrder);
                setIsSortDialogOpen(false);
              }}
            >
              Применить
            </Button>
          </div>
        </Island>
      </Dialog>
    </>
  );
};

MyDoctorPatients.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};

export default MyDoctorPatients;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}
