import type { FC } from "react";

import clsx from "clsx";

import { Avatar, IconPlaceholder } from "@/shared/components";

import type { MessageCellProps } from "./props";

export const MessageCell: FC<MessageCellProps> = ({
  title,
  subheading,
  numberOfMessages,
  messageTime,
  mainIcon,
  mainImage,
  onClick,
  isOnline,
  isGPT,
}) => (
  <div
    className={clsx("flex w-full items-center bg-white p-4", {
      "cursor-pointer": onClick,
    })}
    onClick={onClick}
  >
    <div className="mr-3 flex items-center">
      <Avatar
        isGPT={isGPT}
        icon={mainIcon ?? <IconPlaceholder color="gray-icon" size="lg" />}
        src={mainImage}
        isOnline={isOnline}
        className={clsx("", { "!bg-lightRed": isGPT })}
      />
    </div>
    <div className="flex w-full justify-between">
      <div>
        <div className="mb-1 text-Medium16"> {title}</div>
        <div className="text-Regular12 text-secondaryText">{subheading}</div>
      </div>
      <div className="flex flex-col items-end">
        <div className="mb-1 text-Regular12 leading-3.5 text-secondaryText">
          {messageTime}
        </div>
        <div
          className={clsx(
            "flex h-6 w-6 items-center justify-center rounded-2xl text-Bold12 text-white",
            { "bg-red": numberOfMessages }
          )}
        >
          {numberOfMessages}
        </div>
      </div>
    </div>
  </div>
);
