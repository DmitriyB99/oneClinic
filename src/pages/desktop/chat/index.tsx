import type { ReactElement } from "react";

import type { GetServerSidePropsContext } from "next";

import { DesktopLayout } from "@/shared/layout";
import { DesktopPageComponent } from "@/widgets/Desktop";

const ChatPage = () => <DesktopPageComponent />;

ChatPage.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout hideSidebar={false}>{page}</DesktopLayout>;
};

export default ChatPage;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}
