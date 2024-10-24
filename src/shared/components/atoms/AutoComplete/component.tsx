import type { FC } from "react";

import { AutoComplete as AntAutoComplete } from "antd";
import type { AutoCompleteProps } from "antd";
import clsx from "clsx";

export const AutoComplete: FC<AutoCompleteProps> = ({ className, ...rest }) => (
  <AntAutoComplete
    {...rest}
    className={clsx("[&_.ant-select-disabled]: cursor-default", className)}
  />
);
