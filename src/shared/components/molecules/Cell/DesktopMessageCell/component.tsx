import type { FC } from "react";

import clsx from "clsx";

import { Avatar, IconPlaceholder } from "@/shared/components";

import type { DesktopMessageCellProps } from "./props";

export const DesktopMessageCell: FC<DesktopMessageCellProps> = ({
  messageTime,
  onClick,
  subheading,
  name,
  numberOfMessages,
  mainIcon,
  mainImage,
  isOnline,
}) => (
  <div onClick={onClick} className="flex cursor-pointer flex-row">
    <Avatar
      icon={mainIcon ?? <IconPlaceholder color="gray-icon" size="xl" />}
      src={mainImage}
      isOnline={isOnline}
      size="l"
    />
    <div className="ml-2 flex w-full flex-col gap-3 py-1">
      <span className="flex flex-row items-center justify-between">
        <p className="m-0 p-0 text-Medium16">{name}</p>
        <p className="m-0 p-0 text-Regular10">{messageTime}</p>
      </span>
      <span className="flex flex-row items-center justify-between">
        <p className="m-0 p-0 text-Regular12">{subheading}</p>
        <div
          className={clsx(
            "flex h-4 w-4 items-center justify-center rounded-2xl text-Bold12 text-white",
            { "bg-red": numberOfMessages }
          )}
        >
          {numberOfMessages}
        </div>
      </span>
    </div>
  </div>
);
