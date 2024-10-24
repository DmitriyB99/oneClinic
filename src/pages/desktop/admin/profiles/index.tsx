import type { ReactElement } from "react";

import type { GetServerSidePropsContext } from "next";

import { DesktopLayout } from "@/shared/layout";
import { AdminProfileComponent } from "@/widgets/Desktop/admin";

const AdminProfiles = () => <AdminProfileComponent />;

AdminProfiles.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout>{page}</DesktopLayout>;
};

export default AdminProfiles;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../../messages/${locale}.json`))
        .default,
    },
  };
}
