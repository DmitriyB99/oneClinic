import type { FC } from "react";

import { Dropdown as AntDropdown } from "antd";

import type { DropdownProps } from "./props";

export const Dropdown: FC<DropdownProps> = ({ ...rest }) => (
  <AntDropdown {...rest} />
);
