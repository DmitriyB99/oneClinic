import type { FC } from "react";

import { Tabs } from "antd";
import clsx from "clsx";

import type { TabsProps } from "./props";

export const TabsSaunet: FC<TabsProps> = ({
  desktop,
  className,
  tabBarGutter = 12,
  ...rest
}) => (
  <Tabs
    {...rest}
    tabBarGutter={tabBarGutter}
    className={clsx(className, {
      "[&_.ant-tabs-ink-bar]:!h-2 [&_.ant-tabs-ink-bar]:!rounded-t-lg [&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-tab-btn]:!text-dark":
        !desktop,
    })}
  />
);
