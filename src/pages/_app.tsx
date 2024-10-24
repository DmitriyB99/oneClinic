import "@/styles/globals.css";
import type { ReactElement, ReactNode } from "react";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import { ConfigProvider } from "antd";
import antdLocale from "antd/locale/ru_RU";
import dayjs from "dayjs";
import { AnimatePresence } from "framer-motion";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
// eslint-disable-next-line import/order
import Head from "next/head";

import "dayjs/locale/ru";
dayjs.locale("ru");

import { notFound } from "next/navigation";
import { useRouter } from "next/router";
import { NextIntlClientProvider } from "next-intl";

import { colors, Languages } from "@/shared/config";
import { UserContextProvider } from "@/shared/contexts/userContext";
import { MainLayout } from "@/shared/layout";

export type NextPageWithLayout<P = NonNullable<unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const locales = Languages.map((loc) => loc.value);

export default function App({
  Component,
  pageProps: { messages, ...pageProps },
}: AppPropsWithLayout) {
  const router = useRouter();
  const { locale } = useRouter();

  if (!locales.includes(locale as never)) notFound();
  const pageKey = router.asPath;

  const getLayout =
    Component.getLayout ??
    ((page) => <MainLayout key={pageKey}>{page}</MainLayout>);
  return (
    <Suspense fallback="loading">
      <ConfigProvider
        locale={antdLocale}
        theme={{
          token: {
            colorPrimary: colors?.brand?.primary,
          },
        }}
      >
        <Head>
          <title>OneClinic</title>
          <meta name="description" content="OneClinic app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          onError={(err) => {
            if (err.code === "MISSING_MESSAGE") {
              console.warn("[Missing translation]", err.originalMessage);
              return;
            }
            throw err;
          }}
        >
          <QueryClientProvider client={queryClient}>
            <UserContextProvider>
              <div className="relative h-full bg-gray-0">
                <AnimatePresence initial={false} mode="popLayout">
                  {getLayout(<Component {...pageProps} />)}
                </AnimatePresence>
              </div>
            </UserContextProvider>
          </QueryClientProvider>
        </NextIntlClientProvider>
      </ConfigProvider>
    </Suspense>
  );
}
