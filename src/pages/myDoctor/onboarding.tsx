import type { ReactElement } from "react";

import type { GetServerSidePropsContext } from "next";

import { DoctorOnboarding } from "@/widgets/doctorOnboarding";

const DoctorOnboardingPage = () => <DoctorOnboarding />;

DoctorOnboardingPage.getLayout = (page: ReactElement) => page;

export default DoctorOnboardingPage;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../messages/${locale}.json`)).default,
    },
  };
}
