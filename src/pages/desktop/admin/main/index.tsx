import type { ReactElement } from "react";

import type { GetServerSidePropsContext } from "next";

import { DesktopLayout } from "@/shared/layout";

const AdminMain = () => <>Hello</>;

AdminMain.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout>{page}</DesktopLayout>;
};

export default AdminMain;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../../messages/${locale}.json`))
        .default,
    },
  };
}
