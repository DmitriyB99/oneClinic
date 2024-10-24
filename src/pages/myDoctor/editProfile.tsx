import type { FC } from "react";
import { useCallback, useState, useMemo } from "react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";

import type { TabsProps } from "antd";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import type { DoctorProfile } from "@/entities/clinics";
import { AuthDoctorWorkExperience } from "@/entities/login";
import { doctorsApi } from "@/shared/api";
import { clinicsApi } from "@/shared/api/clinics";
import { ArrowLeftIcon, Island, Navbar, TabsSaunet } from "@/shared/components";
import type { DoctorDataFillModel } from "@/widgets/auth";
import {
  AboutMyself,
  ProfileDecoration,
  DoctorEducation,
  DoctorServices,
} from "@/widgets/doctorProfile";

const tabItems: TabsProps["items"] = [
  {
    key: "decoration",
    label: "Оформление",
  },
  {
    key: "about",
    label: "О себе",
  },
  {
    key: "experience",
    label: "Опыт работы",
  },
  {
    key: "services",
    label: "Услуги",
  },
  {
    key: "education",
    label: "Образование",
  },
];

export interface EditDoctorProfileForm
  extends Pick<
    DoctorProfile,
    | "firstName"
    | "lastName"
    | "fatherName"
    | "workExperience"
    | "clinics"
    | "studyDegrees"
    | "certificates"
    | "description"
    | "birthDate"
    | "phoneNumber"
    | "servicePrices"
    | "iin"
    | "specialityCodes"
  > {
  backgroundPhotoUrl?: string;
  doctorProfileId?: string;
}

const EditDoctorProfile: FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("decoration");

  const { data: myProfileData } = useQuery(["getMyProfile"], () =>
    doctorsApi.getMyDoctorProfile().then((res) => {
      reset({ ...res.data });
      return res.data;
    })
  );

  const { data: clinicsData } = useQuery(["getAllClinics"], () =>
    clinicsApi.getClinics().then((data) => data?.data?.content ?? [])
  );

  const { mutate: updateMyDoctorProfile } = useMutation(
    ["updateMyDoctorProfile"],
    (data: EditDoctorProfileForm) => doctorsApi.updateDoctorProfile(data),
    {
      onSettled: () => {
        router.push("/myDoctor/profile");
      },
    }
  );

  const { control, reset, setValue, getValues, watch } =
    useForm<EditDoctorProfileForm>();

  const servicePrices = watch("servicePrices");

  const purgeUnnecessaryData = useCallback(
    (data: DoctorProfile): EditDoctorProfileForm => ({
      firstName: data.firstName,
      lastName: data.lastName,
      fatherName: data.fatherName,
      iin: data.iin,
      workExperience: data.workExperience,
      clinics: data.clinics,
      studyDegrees: data.studyDegrees,
      certificates: data.certificates,
      description: data.description,
      birthDate: data.birthDate,
      doctorProfileId: data.id,
      phoneNumber: data.phoneNumber,
      servicePrices: data.servicePrices,
    }),
    []
  );

  const doctorServicePrices = useMemo(() => {
    const prices = servicePrices ?? [];
    const online = prices.find((price) => price.consultationType === "ONLINE");
    const clinic = prices.find((price) => price.consultationType === "OFFLINE");
    const home = prices.find((price) => price.consultationType === "AWAY");

    return {
      online: [online?.firstPrice ?? "", online?.secondPrice ?? ""],
      clinic: [clinic?.firstPrice ?? "", clinic?.secondPrice ?? ""],
      home: [home?.firstPrice ?? "", home?.secondPrice ?? ""],
    };
  }, [servicePrices]);

  return (
    <div className="h-screen">
      <Island className="!p-0">
        <Navbar
          title="Редактирование профиля"
          leftButtonOnClick={() => router.back()}
          buttonIcon={<ArrowLeftIcon />}
          rightIcon={<div>Готово</div>}
          rightIconOnClick={() => {
            updateMyDoctorProfile(purgeUnnecessaryData(getValues()));
          }}
          className="px-4"
        />
        <TabsSaunet
          items={tabItems}
          centered
          defaultValue={activeTab}
          onTabClick={(tab) => setActiveTab(tab)}
        />
      </Island>
      {activeTab === "decoration" && (
        <ProfileDecoration
          control={control}
          doctorProfileId={myProfileData?.id ?? ""}
          fullName={`${myProfileData?.lastName ?? ""} ${
            myProfileData?.firstName ?? ""
          } ${myProfileData?.fatherName ?? ""}`}
          photoUrl={myProfileData?.photoUrl}
        />
      )}
      {activeTab === "about" && <AboutMyself control={control} />}
      {activeTab === "experience" && (
        <AuthDoctorWorkExperience
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          back={() => {}}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          next={() => {}}
          control={control as unknown as Control<DoctorDataFillModel>}
          setValue={setValue as unknown as UseFormSetValue<DoctorDataFillModel>}
          specialityCodes={myProfileData?.specialityCodes}
          isUsedInAuth={false}
          clinics={myProfileData?.clinics}
          clinicsData={clinicsData}
        />
      )}
      {activeTab === "services" && (
        <DoctorServices
          initialServicePrices={servicePrices ?? []}
          setValue={setValue}
          initialOnlinePrice={doctorServicePrices.online}
          initialClinicPrice={doctorServicePrices.clinic}
          initialHomePrice={doctorServicePrices.home}
        />
      )}
      {activeTab === "education" && (
        <DoctorEducation
          setValue={setValue}
          doctorId={myProfileData?.id ?? ""}
          studyDegrees={myProfileData?.studyDegrees}
          certificates={myProfileData?.certificates}
        />
      )}
    </div>
  );
};

export default EditDoctorProfile;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
