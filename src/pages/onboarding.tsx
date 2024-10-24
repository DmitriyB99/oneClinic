import type { ReactElement } from "react";

import type { GetServerSidePropsContext } from "next";

import { PatientOnboarding } from "@/widgets/patientOnboarding";

const PatientOnboardingPage = () => <PatientOnboarding />;

PatientOnboardingPage.getLayout = (page: ReactElement) => page;

export default PatientOnboardingPage;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
}
