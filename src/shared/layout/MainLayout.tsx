import type { FC, ReactElement } from "react";
import { useContext, useEffect, useMemo } from "react";

import { Spin } from "antd";
import { useRouter } from "next/navigation";

import { UserContext } from "@/shared/contexts/userContext";
import { getAuthToken, useMediaQuery } from "@/shared/utils";

import { MobileTabBar, PageTransition } from "../components";

export const MainLayout: FC<{ children: ReactElement; hideToolbar?: boolean }> =
  ({ children, hideToolbar }) => {
    const { user } = useContext(UserContext);
    const isMobile = useMediaQuery();
    const router = useRouter();

    const token = useMemo(() => getAuthToken(), []);
    useEffect(() => {
      if (!token) {
        if (isMobile) {
          router.push("/login");
        } else {
          router.push("/desktop/login");
        }
      }
    }, [token, router, isMobile]);

    if (!user) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <Spin size="large" />
        </div>
      );
    }

    return (
      <PageTransition>
        {hideToolbar ? (
          children
        ) : (
          <div className="flex h-full flex-col overflow-y-auto bg-gray-0 pb-[71px]">
            {children}
            <MobileTabBar />
          </div>
        )}
      </PageTransition>
    );
  };
