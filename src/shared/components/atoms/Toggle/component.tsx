import type { FC } from "react";

import { ConfigProvider, Switch } from "antd";
import clsx from "clsx";

import { colors } from "@/shared/config";

import type { SwitchProps } from "./props";

export const Toggle: FC<SwitchProps> = ({ desktop, ...rest }) => (
  <ConfigProvider
    theme={{
      components: {
        Switch: {
          colorPrimary: colors?.brand?.primary,
          colorPrimaryHover: colors?.brand?.primary,
        },
      },
    }}
  >
    <Switch
      className={clsx({
        "h-8 w-13 [&_.ant-switch-handle]:!my-0.5 [&_.ant-switch-handle]:!h-6 [&_.ant-switch-handle]:!w-6":
          !desktop,
        "[&_.ant-switch-handle]:!ml-1": desktop,
      })}
      {...rest}
    />
  </ConfigProvider>
);
