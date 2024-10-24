import type { FC } from "react";

import type { DrawerProps } from "antd";
import { Drawer as AntDrawer } from "antd";

export const Drawer: FC<DrawerProps> = ({ ...rest }) => (
  <AntDrawer width={518} {...rest} />
);
