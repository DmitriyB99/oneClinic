import type { FC, ReactElement } from "react";
import { cloneElement, useCallback, useContext } from "react";

import clsx from "clsx";

import type { DesktopNavLinkProps } from "@/entities/desktopMain";
import { DesktopArrowUpIcon } from "@/shared/components";
import { UserContext } from "@/shared/contexts/userContext";

export const DesktopNavLink: FC<DesktopNavLinkProps> = ({
  onClick,
  isActive,
  icon,
  title,
  subLinks,
  permission,
}) => {
  const { user } = useContext(UserContext);

  const cloneIcon = useCallback(
    (icon: ReactElement, isActive?: boolean) =>
      cloneElement(icon, {
        size: "sm",
        color: isActive ? "colorPrimaryBase" : "gray-desktopIcon",
      }),
    []
  );

  if (permission?.indexOf(user?.role as string) === -1) {
    return null;
  }

  return (
    <>
      <div
        onClick={onClick}
        className={clsx(
          "mb-1 flex h-10 w-full flex-row items-center rounded-lg",
          {
            "bg-white hover:opacity-50": !isActive,
            "bg-colorPrimaryBg": isActive,
            "cursor-pointer": !subLinks,
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
          <div className="ml-auto pr-4">
            {subLinks && (
              <DesktopArrowUpIcon width={16} rotate={isActive ? 0 : 180} />
            )}
          </div>
        </div>
      </div>
      {isActive &&
        subLinks?.map((el) => (
          <div
            key={el.title}
            className="flex h-10 w-full cursor-pointer flex-row items-center bg-gray-5"
          >
            <p className="m-0 pl-[51px] text-Regular14">{el.title}</p>
          </div>
        ))}
    </>
  );
};
