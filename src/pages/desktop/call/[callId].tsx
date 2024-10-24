import type { ReactElement } from "react";

import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { DesktopLayout } from "@/shared/layout";
import { DesktopVideoCallComponent } from "@/widgets/Desktop";

const DesktopCallPage = () => {
  const { query } = useRouter();

  if (query.callId) {
    return (
      <DesktopVideoCallComponent callId={(query.callId as string) ?? ""} />
    );
  }
  return <p>wrong call id</p>;
};

DesktopCallPage.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout hideSidebar={true}>{page}</DesktopLayout>;
};

export default DesktopCallPage;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}

export const getStaticPaths = () => ({
  paths: [],
  fallback: true,
});
