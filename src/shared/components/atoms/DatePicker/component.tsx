import type { FC } from "react";

import { DatePicker as AntDatePicker } from "antd";
import clsx from "clsx";

import type { DatePickerProps } from "./props";

export const DatePicker: FC<DatePickerProps> = ({
  isError,
  bottomText,
  ...rest
}) => (
  <div>
    <AntDatePicker status={isError ? "error" : ""} {...rest} />
    {bottomText && (
      <div
        className={clsx("mt-1 text-Regular14", {
          "text-red": isError,
          "text-secondaryText": !isError,
        })}
      >
        {bottomText}
      </div>
    )}
  </div>
);
