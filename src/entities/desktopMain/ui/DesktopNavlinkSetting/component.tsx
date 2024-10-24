import type { FC, ReactElement } from "react";
import { cloneElement, useCallback, useContext } from "react";

import clsx from "clsx";

import type { DesktopNavLinkProps } from "@/entities/desktopMain";
import { UserContext } from "@/shared/contexts/userContext";

export const DesktopNavLinkSetting: FC<DesktopNavLinkProps> = ({
  onClick,
  isActive,
  icon,
  title,
  permission,
}) => {
  const cloneIcon = useCallback(
    (icon: ReactElement, isActive?: boolean) =>
      cloneElement(icon, {
        size: "sm",
        color: isActive ? "colorPrimaryBase" : "gray-desktopIcon",
      }),
    []
  );

  const { user } = useContext(UserContext);

  if (permission?.indexOf(user?.role as string) === -1) {
    return null;
  }

  return (
    <>
      <div
        onClick={onClick}
        className={clsx(
          "mb-1 flex h-10 w-full cursor-pointer flex-row items-center rounded-lg",
          {
            "bg-white hover:opacity-50": !isActive,
            "bg-colorPrimaryBg": isActive,
          }
        )}
      >
        <div className="ml-6 flex w-full items-center gap-2 text-Regular14">
          {icon && cloneIcon(icon, isActive)}
          <p
            className={clsx("m-0", {
              "text-colorPrimaryBase": isActive,
            })}
          >
            {title}
          </p>
        </div>
      </div>
    </>
  );
};
