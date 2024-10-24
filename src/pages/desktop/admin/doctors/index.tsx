import type { ReactElement } from "react";

import type { GetServerSidePropsContext } from "next";

import { DesktopLayout } from "@/shared/layout";
import { AdminDoctorProfilesComponent } from "@/widgets/Desktop/admin";

const AdminDoctorProfiles = () => <AdminDoctorProfilesComponent />;

AdminDoctorProfiles.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout>{page}</DesktopLayout>;
};

export default AdminDoctorProfiles;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../../messages/${locale}.json`))
        .default,
    },
  };
}
