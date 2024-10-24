import type { FC, ReactElement } from "react";
import { cloneElement, useContext, useMemo, useState } from "react";

import clsx from "clsx";
import { useRouter as useRouterPath } from "next/dist/client/router";
import { useRouter } from "next/navigation";

import {
  Badge,
  DividerSaunet,
  Button,
  HomeHeartIcon,
  QrCode,
  ChatIcon,
  UserCircleIcon,
  CalendarOutlinedIcon,
} from "@/shared/components";
import { CallContext } from "@/shared/contexts/callContext";
import { UserContext } from "@/shared/contexts/userContext";
import type { IconProps } from "@/shared/hocs";
import { ComingSoonDialog } from "@/widgets/comingSoon";

interface MobileTabBarProps {
  items?: {
    badge?: number | string;
    icon: ReactElement<IconProps>;
    isActive?: boolean;
    onClick?: () => void;
    title: string;
  }[];
}

export const handleQrTrigger = () => {
  if (window) {
    window.AndroidInterface?.openQR?.();
  }
  if (window?.webkit) {
    window.webkit?.messageHandlers?.jsMessageHandler?.postMessage?.("openQR");
  }
};

export const MobileTabBar: FC<MobileTabBarProps> = ({ items: itemsProps }) => {
  const router = useRouter();
  const { totalNewMessages } = useContext(CallContext);
  const { pathname } = useRouterPath();
  const { user } = useContext(UserContext);
  const [isComingSoonDialogOpen, setIsComingSoonDialogOpen] =
    useState<boolean>(false);

  const [main, myProfile] = useMemo(() => {
    if (user?.role === "doctor") {
      return ["/mainDoctor", "/myDoctor/profile"];
    } else {
      return ["/main", "/my/profile"];
    }
  }, [user?.role]);

  const items = useMemo(
    () => [
      {
        title: "Главная",
        isActive: pathname === main,
        onClick: () => router.push(main),
        icon: <HomeHeartIcon />,
      },
      user?.role === "doctor"
        ? {
            title: "Записи",
            icon: <CalendarOutlinedIcon />,
            isActive: pathname === "/myDoctor/appointments",
            onClick: () => router.push("/myDoctor/appointments"),
          }
        : {
            title: "QR",
            icon: <QrCode />,
            //  onClick: handleQrTrigger
            onClick: () => router.push("/oneQr"),
          },
      user?.role === "doctor"
        ? {
            title: "Мой QR",
            icon: <QrCode />,
            isActive: pathname === "/myDoctor/myQr",
            onClick: () => console.log(123),
          }
        : null,
      {
        title: "Сообщения",
        isActive: pathname === "/chat",
        onClick: () => router.push("/chat"),
        badge: totalNewMessages ? totalNewMessages.toString() : undefined,
        icon: <ChatIcon />,
      },
      {
        title: "Профиль",
        icon: <UserCircleIcon />,
        isActive:
          pathname === "/myDoctor/profile" || pathname === "/my/profile",
        onClick: () => router.push(myProfile),
      },
    ],
    [main, myProfile, pathname, router, totalNewMessages, user?.role]
  );

  const cloneIcon = (icon: ReactElement, isActive?: boolean) =>
    cloneElement(icon, {
      size: "md",
      className: "mx-auto mb-1",
      color: isActive ? "brand-primary" : "gray-icon",
    });

  return (
    <div className="fixed bottom-0 w-full">
      <DividerSaunet className="my-0" />
      <div className="flex justify-around bg-white px-3 py-2">
        {(itemsProps ?? items)
          .filter((item) => item !== null)
          .map((item) => (
            <Button
              key={item.title}
              variant="tertiary"
              className="flex h-auto w-23 flex-col justify-center border-none !p-0"
              onClick={item.onClick}
            >
              {item.badge !== undefined ? (
                <Badge text={item.badge} className="mx-auto" type="red">
                  {cloneIcon(item.icon, item.isActive)}
                </Badge>
              ) : (
                cloneIcon(item.icon, item.isActive)
              )}
              <div
                className={clsx("mx-auto w-fit rounded-xl px-2 py-1", {
                  "bg-brand-primary text-white": item.isActive,
                })}
              >
                <p
                  className={clsx("m-0", {
                    "text-Semibold11": item.isActive,
                    "text-Regular11": !item.isActive,
                  })}
                >
                  {item.title}
                </p>
              </div>
            </Button>
          ))}
      </div>
      <ComingSoonDialog
        open={isComingSoonDialogOpen}
        setIsOpen={setIsComingSoonDialogOpen}
      />
    </div>
  );
};
