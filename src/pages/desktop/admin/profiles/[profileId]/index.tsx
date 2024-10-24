import type { ReactElement } from "react";

import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { ProfileIdComponent } from "@/entities/admin";
import { DesktopLayout } from "@/shared/layout";

const ProfileIdPage = () => {
  const { query } = useRouter();

  if (query.profileId) {
    return <ProfileIdComponent />;
  } else {
    return <p>wrongId</p>;
  }
};

ProfileIdPage.getLayout = function getLayout(page: ReactElement) {
  return <DesktopLayout hideSidebar>{page}</DesktopLayout>;
};

export default ProfileIdPage;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../../../messages/${locale}.json`))
        .default,
    },
  };
}

export const getStaticPaths = () => ({
  paths: [],
  fallback: true,
});
