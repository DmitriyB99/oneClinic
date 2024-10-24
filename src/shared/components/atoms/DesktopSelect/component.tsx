import type { FC } from "react";

import { Select as AntSelect, ConfigProvider } from "antd";
import clsx from "clsx";

import type { DesktopSelectProps } from "./props";

export const DesktopSelect: FC<DesktopSelectProps> = ({
  className,
  ...rest
}) => (
  <ConfigProvider
    theme={{
      components: {
        Select: {
          colorBgContainer: "#1E232A",
          controlHeight: 48,
          colorBorder: "#2D3440",
          colorText: "rgba(245, 249, 255, 0.9)",
          colorBgBase: "#1E232A",
          controlItemBgActive: "#1E232A",
        },
      },
    }}
  >
    <AntSelect
      className={clsx("bg-surfaceLight", className)}
      dropdownStyle={{ backgroundColor: "#1E232A" }}
      {...rest}
    />
  </ConfigProvider>
);
