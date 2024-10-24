import type { ReactElement } from "react";
import { useContext } from "react";

import type { GetServerSidePropsContext } from "next";

import { UserContext } from "@/shared/contexts/userContext";
import { DesktopLayout } from "@/shared/layout";
import {
  DesktopFillClinicProfile,
  DesktopFillDoctorProfile,
} from "@/widgets/auth";

export default function DesktopProfileFinishPage() {
  const { user } = useContext(UserContext);
  if (user?.role === "clinic") {
    return <DesktopFillClinicProfile />;
  }
  return <DesktopFillDoctorProfile />;
}

DesktopProfileFinishPage.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout hideSidebar>{page}</DesktopLayout>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}
