import type { FC } from "react";

import type { InputProps } from "antd";
import { Input as InputAntd } from "antd";
import clsx from "clsx";

import { DesktopSearchIcon } from "@/shared/components";

export const DesktopInputSearch: FC<InputProps> = ({ className, ...rest }) => (
  <InputAntd
    prefix={<DesktopSearchIcon size="sm" />}
    placeholder="Search"
    className={clsx(
      "w-60 rounded-xl placeholder:text-secondaryText",
      className
    )}
    {...rest}
  />
);
