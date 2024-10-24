import type { FC, ReactElement } from "react";
import { useContext, useEffect, useMemo } from "react";

import { Spin } from "antd";
import { useRouter } from "next/navigation";

import { UserContext } from "@/shared/contexts/userContext";
import { getAuthToken, useMediaQuery } from "@/shared/utils";
import { DesktopNavbar, DesktopSidebar } from "@/widgets/Desktop";

export const DesktopLayout: FC<{
  children: ReactElement;
  hideSidebar?: boolean;
}> = ({ children, hideSidebar }) => {
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
    <div className="flex h-screen flex-col overflow-auto pt-16">
      <DesktopNavbar />
      <div className="flex h-full flex-row">
        {!hideSidebar ? (
          <>
            <DesktopSidebar />
            <div className="ml-[264px] w-full">{children}</div>
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
