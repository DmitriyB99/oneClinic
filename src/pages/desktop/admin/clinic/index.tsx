import type { ReactElement } from "react";

import type { GetServerSidePropsContext } from "next";

import { DesktopLayout } from "@/shared/layout";
import { AdminClinicComponent } from "@/widgets/Desktop";

const AdminClinic = () => <AdminClinicComponent />;

AdminClinic.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout>{page}</DesktopLayout>;
};

export default AdminClinic;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../../messages/${locale}.json`))
        .default,
    },
  };
}
