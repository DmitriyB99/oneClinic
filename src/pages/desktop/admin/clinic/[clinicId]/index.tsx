import type { ReactElement } from "react";

import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { ClinicIdComponent } from "@/entities/admin";
import { DesktopLayout } from "@/shared/layout";

const ClinicIdPage = () => {
  const { query } = useRouter();

  if (query.clinicId) {
    return <ClinicIdComponent />;
  } else {
    return <p>ID is wrong</p>;
  }
};

ClinicIdPage.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout hideSidebar>{page}</DesktopLayout>;
};

export default ClinicIdPage;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../../../messages/${locale}.json`))
        .default,
    },
  };
}

export const getStaticPaths = () => ({
  paths: [],
  fallback: true,
});
