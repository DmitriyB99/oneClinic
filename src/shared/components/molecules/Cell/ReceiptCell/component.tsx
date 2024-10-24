import type { FC } from "react";

import { ClockFilledIcon, IconPlaceholder } from "@/shared/components";

import type { ReceiptCellProps } from "./props";

export const ReceiptCell: FC<ReceiptCellProps> = ({
  title,
  caption,
  mainIcon,
  receiptDays = "Days",
}) => (
  <div className="flex h-16 w-full justify-start bg-white">
    <div className="flex items-center">
      <div className="mx-3 flex h-8 w-8 items-center justify-center rounded-md bg-gray-1">
        {mainIcon ?? <IconPlaceholder color="gray-icon" />}
      </div>
      <div className="flex flex-col">
        <div className="text-Regular16">{title}</div>
        <div className="text-Regular12 text-secondaryText">{caption}</div>
        <div className="flex items-center">
          <ClockFilledIcon size="xs" />
          <span className="ml-2 text-Regular12 text-dark">{receiptDays}</span>
        </div>
      </div>
    </div>
  </div>
);
