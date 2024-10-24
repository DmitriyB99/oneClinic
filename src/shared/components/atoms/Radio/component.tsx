import type { FC } from "react";

import type { RadioProps } from "antd";
import { ConfigProvider } from "antd";
import { Radio } from "antd";
import clsx from "clsx";

import { colors } from "@/shared/config";

export const RadioSaunet: FC<RadioProps> = ({
  children,
  className,
  ...rest
}) => (
  <ConfigProvider
    theme={{
      components: {
        Radio: {
          colorPrimary: colors?.brand.primary,
          colorBorder: colors?.gray["2"],
          wireframe: true,
        },
      },
    }}
  >
    <Radio
      className={clsx(
        "text-Regular16 [&_.ant-radio-inner]:!h-5 [&_.ant-radio-inner]:!w-5 [&_.ant-radio-inner{.ant-radio-checked}]:!border-gray-2 [&_.ant-radio]:!w-5",
        className
      )}
      {...rest}
    >
      <span className="text-Regular14">{children}</span>
    </Radio>
  </ConfigProvider>
);
