import type { ReactElement } from "react";
import { Suspense } from "react";

import type { GetServerSidePropsContext } from "next";

import { DesktopAuthPage } from "@/shared/pages/auth";

export default function DesktopLogin() {
  return (
    <Suspense fallback="loading">
      <DesktopAuthPage />
    </Suspense>
  );
}

DesktopLogin.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}
