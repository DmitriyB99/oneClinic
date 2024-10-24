import type { FC } from "react";

import clsx from "clsx";

import { Checkbox, IconPlaceholder } from "@/shared/components";

import type { DefaultCellProps } from "./props";

export const DefaultCell: FC<DefaultCellProps> = ({
  subheading,
  title,
  caption,
  mainIcon,
  onCheckboxChange,
  rightElement,
  leftElement,
  className,
  onClick,
  hideMainIcon = false,
  checked,
  captionClasses,
}) => (
  <div
    className={clsx("flex h-16 w-full justify-between bg-white", className)}
    onClick={onClick}
  >
    <div className="flex h-full items-center">
      {onCheckboxChange && (
        <Checkbox
          className="ml-4"
          checked={checked}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onChange={onCheckboxChange}
        />
      )}
      {!hideMainIcon && (
        <div className="mx-3 flex h-8 w-8 items-center justify-center rounded-md bg-gray-1">
          {mainIcon ?? <IconPlaceholder color="gray-icon" />}
        </div>
      )}
      {leftElement && (
        <div className="mx-3 flex h-8 w-8 items-center justify-center">
          {leftElement}
        </div>
      )}
      <div className="flex h-full flex-col justify-between">
        <div className="text-Regular12 text-secondaryText">{subheading}</div>
        <div className="text-Regular16">{title}</div>
        <div
          className={clsx("text-Regular12 text-secondaryText", captionClasses)}
        >
          {caption}
        </div>
      </div>
    </div>
    <div className="mr-3.5 flex items-center justify-center">
      {rightElement ?? <IconPlaceholder color="gray-icon" />}
    </div>
  </div>
);
