import type { FC, MouseEvent } from "react";
import { useCallback } from "react";

import clsx from "clsx";

import { Avatar, Button } from "@/shared/components";

import type { NavbarProps } from "./props";

export const Navbar: FC<NavbarProps> = ({
  buttonIcon,
  rightIcon,
  description,
  className,
  title,
  leftButtonOnClick,
  rightIconOnClick,
  avatar,
  leftButtonClassName,
}) => {
  const leftIconClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      leftButtonOnClick?.();
    },
    [leftButtonOnClick]
  );

  return (
    <div
      className={clsx(
        "relative flex min-h-12 w-full items-center justify-center bg-white px-4 py-2 text-left",
        className
      )}
    >
      {buttonIcon && (
        <Button
          size="s"
          variant="tinted"
          className={clsx("absolute left-4 bg-gray-2", leftButtonClassName)}
          onClick={(event) => {
            event.stopPropagation();
            leftIconClick?.(event);
          }}
        >
          {buttonIcon}
        </Button>
      )}

      <div className="flex items-center">
        {avatar && <Avatar src={avatar} size="s" className="mr-3" />}
        <div>
          <div className="text-center text-Bold16">{title}</div>
          {description && (
            <div className="text-center text-Medium12 text-secondaryText">
              {description}
            </div>
          )}
        </div>
      </div>

      <Button
        variant="tertiary"
        className="absolute right-4"
        onClick={(event) => {
          event.stopPropagation();
          rightIconOnClick?.();
        }}
      >
        {rightIcon}
      </Button>
    </div>
  );
};
