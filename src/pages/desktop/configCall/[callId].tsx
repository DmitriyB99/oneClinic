import type { ReactElement } from "react";

import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { DesktopLayout } from "@/shared/layout";
import { DesktopVideoCallConfigComponent } from "@/widgets/Desktop";

const DesktopVideocallPage = () => {
  const { query } = useRouter();

  if (query.callId) {
    return (
      <DesktopVideoCallConfigComponent
        callId={(query.callId as string) ?? ""}
        isOffer={!!query.isOffer}
      />
    );
  }
  return <p>wrong call id</p>;
};

DesktopVideocallPage.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout hideSidebar={true}>{page}</DesktopLayout>;
};

export default DesktopVideocallPage;

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
