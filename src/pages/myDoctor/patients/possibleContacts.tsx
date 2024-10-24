import type { FC } from "react";

import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { AuthDoctorContactList } from "@/entities/login";
import { ArrowLeftIcon, Navbar } from "@/shared/components";

const PossibleContacts: FC = () => {
  const router = useRouter();
  return (
    <div className="h-screen bg-white">
      <Navbar
        title="Возможно, вы знакомы"
        buttonIcon={<ArrowLeftIcon />}
        leftButtonOnClick={() => router.back()}
      />
      <AuthDoctorContactList contacts={[]} />
    </div>
  );
};

export default PossibleContacts;

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../../../messages/${locale}.json`)).default,
    },
  };
}
