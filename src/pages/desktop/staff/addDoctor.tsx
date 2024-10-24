import type { ReactElement } from "react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import { authApi } from "@/shared/api";
import { DesktopLayout } from "@/shared/layout";
import type {
  ClinicDoctorDataFillModel,
  Step3FillClinicProfileSetValue,
} from "@/widgets/auth";
import {
  DesktopFillProfileTitle,
  Step2ClinicFillDoctorProfile,
  Step3FillClinicProfile,
  Step3FillDoctorProfile,
} from "@/widgets/auth";

export default function DesktopAddDoctorPage() {
  const [step, setStep] = useState(0);
  const {
    control: DoctorDataFillControl,
    setValue,
    handleSubmit,
  } = useForm<ClinicDoctorDataFillModel>();

  const router = useRouter();
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.Staff");

  const { mutate: createNewDoctorByClinic } = useMutation(
    ["createNewDoctorByClinic"],
    (data: ClinicDoctorDataFillModel) => authApi.createDoctorByClinic(data),
    {
      onSuccess: () => {
        router.push({
          pathname: "/desktop/staff",
          query: {
            doctor: "true",
          },
        });
      },
    }
  );

  const onSubmit = useCallback(
    (data: ClinicDoctorDataFillModel) => {
      createNewDoctorByClinic(data);
    },
    [createNewDoctorByClinic]
  );

  return (
    <div className="flex w-full justify-center">
      {step === 0 && (
        <DesktopFillProfileTitle
          labelCount="1/3"
          titleText={tDesktop("FillDoctorProfile")}
        >
          <Step2ClinicFillDoctorProfile
            next={() => setStep(1)}
            control={DoctorDataFillControl}
            setValue={setValue}
          />
        </DesktopFillProfileTitle>
      )}
      {step === 1 && (
        <DesktopFillProfileTitle
          labelCount="2/3"
          titleText={t("Schedule")}
          back={() => setStep(0)}
        >
          <Step3FillClinicProfile
            next={() => setStep(2)}
            setValue={setValue as Step3FillClinicProfileSetValue}
          />
        </DesktopFillProfileTitle>
      )}
      {step === 2 && (
        <DesktopFillProfileTitle
          labelCount="3/3"
          titleText={t("Services")}
          back={() => setStep(1)}
        >
          <Step3FillDoctorProfile
            next={handleSubmit(onSubmit)}
            setValue={setValue as Step3FillClinicProfileSetValue}
          />
        </DesktopFillProfileTitle>
      )}
    </div>
  );
}

DesktopAddDoctorPage.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout hideSidebar>{page}</DesktopLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}
