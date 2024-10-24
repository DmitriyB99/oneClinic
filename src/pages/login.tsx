import type { ReactElement } from "react";
import { useContext, useEffect } from "react";

import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/navigation";

import { UserContext } from "@/shared/contexts/userContext";
import { AuthPage } from "@/shared/pages/auth";
import { getAuthToken, useMediaQuery } from "@/shared/utils";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const isMobile = useMediaQuery();

  useEffect(() => {
    const token = getAuthToken();
    if (token && user) {
      if (!isMobile) {
        router.push(user?.role === "doctor" ? "/mainDoctor" : "/main");
      } else if (!isMobile) {
        router.push(
          user?.role === "doctor" ? "/desktop/mainDoctor" : "/desktop/main"
        );
      }
    } else {
      if (!isMobile) {
        router.push("/desktop/login");
      } else {
        router.push("/login");
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, user, user?.role]);

  return <AuthPage />;
}

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <div className="bg-white">{page}</div>;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
}
