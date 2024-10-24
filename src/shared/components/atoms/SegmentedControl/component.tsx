import type { FC } from "react";

import { ConfigProvider, Segmented } from "antd";
import clsx from "clsx";

import { colors } from "@/shared/config";

import type { SegmentedControlSaunetProps } from "./props";

export const SegmentedControl: FC<SegmentedControlSaunetProps> = ({
  size,
  className,
  ...rest
}) => (
  <ConfigProvider
    theme={{
      components: {
        Segmented: {
          colorBgElevated: colors?.brand?.primary,
          colorText: colors?.white,
        },
      },
    }}
  >
    {/*@ts-ignore*/}
    <Segmented
      block
      {...rest}
      className={clsx(
        "rounded-xl bg-gray-1 p-1 text-Medium14 text-dark [&_.ant-segmented-item]:!rounded-xl",
        {
          "h-10 [&_.ant-segmented-item-label]:!leading-9": size === "m",
          "h-12 [&_.ant-segmented-item-label]:!leading-10": size === "l",
        },
        className
      )}
    />
  </ConfigProvider>
);
