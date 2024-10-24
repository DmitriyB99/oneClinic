import type { FC } from "react";

import { Popover as AntPopover } from "antd";

import type { PopoverProps } from "./props";

export const Popover: FC<PopoverProps> = ({ ...rest }) => (
  <AntPopover {...rest} />
);
