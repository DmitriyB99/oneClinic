import type { FC } from "react";

import { Select as AntSelect } from "antd";
import clsx from "clsx";

import type { SelectProps } from "./props";

export const Select: FC<SelectProps> = ({ isError, bottomText, ...rest }) => (
  <div>
    <AntSelect status={isError ? "error" : ""} {...rest} />
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
