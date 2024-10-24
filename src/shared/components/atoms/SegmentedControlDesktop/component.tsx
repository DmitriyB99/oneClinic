import type { FC } from "react";
import { useMemo } from "react";

import { ConfigProvider, Segmented } from "antd";
import clsx from "clsx";

import type { SegmentedControlSaunetProps } from "./props";

export const SegmentedControlDesktop: FC<SegmentedControlSaunetProps> = ({
  isDefault,
  className,
  activeStyle,
  ...rest
}) => {
  const customTheme = useMemo(
    () =>
      isDefault
        ? {}
        : {
            components: {
              Segmented: activeStyle,
            },
          },
    [isDefault, activeStyle]
  );

  return (
    <ConfigProvider theme={customTheme}>
      {/*@ts-ignore*/}
      <Segmented
        className={clsx("bg-white text-Medium14 text-dark", className)}
        {...rest}
      />
    </ConfigProvider>
  );
};
