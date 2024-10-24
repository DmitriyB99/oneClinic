import type { ReactElement } from "react";

import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { DoctorIdComponent } from "@/entities/admin";
import { DesktopLayout } from "@/shared/layout";

const DoctorIdPage = () => {
  const { query } = useRouter();

  if (query.doctorId) {
    return <DoctorIdComponent id={query.doctorId as string} />;
  } else {
    return <p>wrongId</p>;
  }
};

DoctorIdPage.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout hideSidebar>{page}</DesktopLayout>;
};

export default DoctorIdPage;

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
