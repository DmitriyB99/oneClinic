import type { ReactElement } from "react";

import type { GetServerSidePropsContext } from "next";

import { DesktopLayout } from "@/shared/layout";
import { DesktopMainPage } from "@/widgets/Desktop";

const DesktopMain = () => <DesktopMainPage />;

DesktopMain.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout hideSidebar={false}>{page}</DesktopLayout>;
};

export default DesktopMain;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}
