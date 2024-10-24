import { useCallback, useState } from "react";
import { useQuery } from "react-query";

import { RightOutlined } from "@ant-design/icons";
import { CloseOutlined } from "@ant-design/icons";
import { Avatar, Input } from "antd";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { SpecialistDialog } from "@/entities/clinics";
import { PopularDoctors } from "@/entities/doctor";
import { dictionaryApi } from "@/shared/api/dictionary";
import {
  ArrowLeftIcon,
  DefaultCell,
  Island,
  Navbar,
  InteractiveList,
  Facemask,
  ListType,
  SearchIcon,
} from "@/shared/components";
import { GrayInputSearch } from "@/shared/components/molecules/input/GrayInputSearch";

export default function ClinicsPage() {
  const t = useTranslations("Common");
  const tMob = useTranslations("Mobile.Clinics");
  const router = useRouter();

  const handleSpecialtyClick = useCallback(
    (doctorSpeciality: number | string) => {
      router.push({
        pathname: "doctors",
        query: { speciality: doctorSpeciality },
      });
    },
    [router]
  );

  const [searchValue, setSearchValue] = useState<string>("");

  const { data: specialities } = useQuery(["getSpecialities"], () =>
    dictionaryApi.getSpecialities().then((response) =>
      response.data.result.map(
        (speciality: { id: string; name: string; image_url?: string }) => ({
          id: speciality.id,
          title: speciality.name ?? "No name",
          startIcon: (
            <Avatar
              shape="square"
              size={64}
              style={{ borderRadius: "12px" }}
              src={speciality?.image_url}
            />
          ),
        })
      )
    )
  );

  return (
    <div>
      <Navbar
        title={t("OnlineConsultations")}
        leftButtonOnClick={() => router.back()}
        buttonIcon={<ArrowLeftIcon />}
        className="px-4"
      />
      <div className="w-full rounded-b-3xl bg-white px-4 pb-4 pt-3">
        <GrayInputSearch
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          placeholder="Врачи, специализации"
          searchType="onlineConsultations"
        />
        <Island
          isCard
          className="mb-1 mt-6 !p-0"
          onClick={() => router.push({ pathname: "dutyDoctors" })}
        >
          <DefaultCell
            title={tMob("DontKnowWhatKindOfDoctorYouNeed")}
            subheading={tMob("ConsultDoctorOnDuty")}
            leftElement={<Facemask color="brand-icon" size="mainIcon" />}
            rightElement={<RightOutlined />}
            className="!bg-transparent py-3"
            hideMainIcon
          />
        </Island>
      </div>
      {/* <PopularDoctors isOnlineConsultation /> */}
      <Island className="mt-2 !p-4">
        <div className="flex items-center justify-between">
          <p className="mb-0 text-Bold20">{t("Specializations")}</p>
          <SpecialistDialog
            list={specialities ?? []}
            onSpecialityClick={handleSpecialtyClick}
          />
        </div>
        <InteractiveList
          list={specialities ?? []}
          onClick={handleSpecialtyClick}
          maxItems={3}
        />
      </Island>
    </div>
  );
}

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
