import "stories-react/dist/index.css";
import type { ReactElement } from "react";
import { useContext, useEffect, useState } from "react";

import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/navigation";

import { UserContext } from "@/shared/contexts/userContext";
import { useMediaQuery } from "@/shared/utils";
import { LanguagesPage } from "@/widgets/languages";

export default function IndexPage() {
  const router = useRouter();
  const isMobile = useMediaQuery();
  const { user, isLoading, authToken } = useContext(UserContext);
  const [languageSelected, setLanguageSelected] = useState(false);
  const [language, setLanguage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isMobile && languageSelected && language) {
      router.push("/onboarding");
    }
  }, [router, languageSelected, language]);

  useEffect(() => {
    // для демонстрации лого, убрать после бэка
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMobile) {
      const onboardingCompleted =
        localStorage.getItem("isPatientOnboardingCompleted") === "true";
      if (onboardingCompleted) {
        if (user) {
          router.push(user.role === "doctor" ? "/mainDoctor" : "/main");
        } else if ((!user && isLoading === false) || !authToken) {
          router.push("/login");
        }
      }
    } else {
      if (user) {
        router.push(user.role === "doctor" ? "/mainDoctor" : "/main");
      } else if ((!user && isLoading === false) || !authToken) {
        router.push("/desktop/login");
      }
    }
  }, [router, user, isLoading, authToken, isMobile]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <img src="/OneClinicLogo.png" alt="OneClinicLogo" />
      </div>
    );
  }
  if (isMobile) {
    return (
      <LanguagesPage
        onLanguageChange={(lang) => {
          setLanguage(lang);
          setLanguageSelected(true);
        }}
      />
    );
  }
}

IndexPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export async function getStaticProps({ locale }: GetServerSidePropsContext) {
  return {
    props: {
      messages: (await import(`../../messages/${locale}.json`)).default,
    },
  };
}
