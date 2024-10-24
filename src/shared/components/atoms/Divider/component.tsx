import type { FC } from "react";

import type { DividerProps } from "antd";
import { Divider } from "antd";

export const DividerSaunet: FC<DividerProps> = ({ ...rest }) => (
  <Divider className="my-4 border-gray-1" {...rest} />
);
