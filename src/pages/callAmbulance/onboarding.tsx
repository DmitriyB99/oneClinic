import type { ReactElement } from "react";

import type { GetServerSidePropsContext } from "next";

import { AmbulanceOnboarding as AmbulanceOnboardingComponent } from "@/features/ambulance/onboarding/ui";
import { MainLayout } from "@/shared/layout";

const AmbulanceOnboarding = () => <AmbulanceOnboardingComponent />;

AmbulanceOnboarding.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout hideToolbar>{page}</MainLayout>;
};

export default AmbulanceOnboarding;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
