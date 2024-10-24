import type { ReactElement } from "react";

import type { GetServerSidePropsContext } from "next";

import { DesktopLayout } from "@/shared/layout";
import { AdminDictionaryComponent } from "@/widgets/Desktop";

const AdminDictionary = () => <AdminDictionaryComponent />;

AdminDictionary.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout>{page}</DesktopLayout>;
};

export default AdminDictionary;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../../messages/${locale}.json`))
        .default,
    },
  };
}
