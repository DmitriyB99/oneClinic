import type { FC } from "react";
import { useMemo, useContext } from "react";

import {
  ExceptionOutlined,
  DiffOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useRouter as useRouterPath } from "next/dist/client/router";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { DesktopNavLink } from "@/entities/desktopMain";
import {
  Calendar2Icon,
  CategoryIcon,
  ClinicIcon,
  HomeTrendUpIcon,
  Messages3Icon,
  PeopleIcon,
  ProfileAddIcon,
  SettingIcon,
} from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";

export const DesktopSidebar: FC = () => {
  const router = useRouter();
  const { pathname } = useRouterPath();
  const { user } = useContext(UserContext);
  const t = useTranslations("Common");
  const tDesktop = useTranslations("Desktop.DesktopLayout");

  const items = useMemo(
    () => [
      {
        title: t("Main"),
        isActive: pathname == "/desktop/mainDoctor",
        onClick: () => router.push("/desktop/mainDoctor"),
        icon: <CategoryIcon />,
      },
      {
        title: t("Statistics"),
        isActive: pathname === "/desktop/admin/statistics",
        onClick: () => router.push("/desktop/admin/statistics"),
        icon: <HomeTrendUpIcon />,
        permission: "superadmin",
      },
      {
        title: t("Bookings"),
        isActive: pathname == "/desktop/bookings",
        onClick: () => router.push("/desktop/bookings"),
        icon: <Calendar2Icon />,
      },
      {
        title: t("Patients"),
        isActive:
          user?.role === "superadmin"
            ? pathname == "/desktop/admin/profiles"
            : pathname == "/desktop/patients",
        onClick: () =>
          user?.role === "superadmin"
            ? router.push("/desktop/admin/profiles")
            : router.push("/desktop/patients"),
        icon: <PeopleIcon />,
        permission: ["clinic", "superadmin"],
      },
      {
        title: t("Staff"),
        isActive: pathname === "/desktop/staff",
        onClick: () => router.push("/desktop/staff"),
        icon: <ProfileAddIcon />,
        permission: "clinic",
      },
      {
        title: t("Messages"),
        isActive:
          user?.role === "superadmin"
            ? pathname == "desktop/admin/chat"
            : pathname === "/desktop/chat",
        onClick: () =>
          user?.role === "superadmin"
            ? router.push("desktop/admin/chat")
            : router.push("/desktop/chat"),
        icon: <Messages3Icon />,
        permission: ["doctor", "superadmin"],
      },
      {
        title: t("Settings"),
        icon: <SettingIcon />,
        isActive: pathname === "/desktop/settings",
        onClick: () => router.push("/desktop/settings"),
      },
    ],
    [pathname, router, user?.role, t]
  );

  const adminItems = useMemo(
    () => [
      {
        title: t("ApplicationsForRegistration"),
        isActive: pathname === "/desktop/admin/registrationRequests",
        onClick: () => router.push("/desktop/admin/registrationRequests"),
        icon: <ExceptionOutlined className="text-Regular16" />,
      },
      {
        title: tDesktop("Users"),
        isActive: pathname === "/desktop/admin/users",
        onClick: () => router.push("/desktop/admin/users"),
        icon: <UsergroupAddOutlined className="text-Regular16" />,
      },
      {
        title: t("Guide"),
        isActive: pathname === "/desktop/admin/dictionary",
        onClick: () => router.push("/desktop/admin/dictionary"),
        icon: <DiffOutlined className="text-Regular16" />,
      },
      {
        title: t("Doctors"),
        isActive: pathname.includes("desktop/admin/doctors"),
        onClick: () => router.push("/desktop/admin/doctors"),
        icon: <ProfileAddIcon />,
      },
      {
        title: t("Clinics"),
        isActive: pathname === "/desktop/admin/clinic",
        onClick: () => router.push("/desktop/admin/clinic"),
        icon: <ClinicIcon />,
      },
    ],
    [pathname, router, t, tDesktop]
  );

  return (
    <div className="fixed z-50 flex h-screen w-[264px] flex-col bg-white p-1 text-gray-desktopIcon">
      {items?.map((item) => (
        <DesktopNavLink
          isActive={item.isActive}
          onClick={item.onClick}
          icon={item.icon}
          title={item.title}
          key={item.title}
          permission={item.permission}
        />
      ))}
      {user?.role === "superadmin" && (
        <>
          <div className="my-2 ml-6 w-full py-1">
            <span className="text-Regular14 text-gray-4">
              {tDesktop("AdminPanel")}
            </span>
          </div>
          {adminItems?.map((item) => (
            <DesktopNavLink
              isActive={item.isActive}
              onClick={item.onClick}
              icon={item.icon}
              title={item.title}
              key={item.title}
            />
          ))}
        </>
      )}
    </div>
  );
};
