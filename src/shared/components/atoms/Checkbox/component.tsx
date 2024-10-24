import type { PropsWithChildren } from "react";
import { forwardRef } from "react";

import type { CheckboxProps } from "antd";
import { Checkbox as AntdCheckbox, ConfigProvider } from "antd";
import clsx from "clsx";

import { colors } from "@/shared/config";

export const Checkbox = forwardRef<
  HTMLInputElement,
  CheckboxProps &
    PropsWithChildren & {
      bottomText?: string;
      desktop?: boolean;
      isError?: boolean;
      loginDesktop?: boolean;
    }
>(
  (
    {
      children,
      className,
      bottomText,
      isError,
      desktop,
      loginDesktop,
      ...rest
    },
    ref
  ) => (
    <ConfigProvider
      theme={{
        components: {
          Checkbox: {
            colorPrimary: colors?.brand?.primary,
            colorPrimaryHover: colors?.brand?.primary,
          },
        },
      }}
    >
      <AntdCheckbox
        ref={ref}
        {...rest}
        className={clsx(className, {
          "[&>*:nth-child(2)]:ml-1 [&>*:nth-child(2)]:mt-[3px] ms-0": desktop,
          "items-start [&_.ant-checkbox-checked]:!h-5 [&_.ant-checkbox-checked]:!w-5 [&_.ant-checkbox-inner]:!h-5 [&_.ant-checkbox-inner]:!w-5":
            !loginDesktop,
        })}
      >
        {children}
      </AntdCheckbox>
      {bottomText && (
        <div
          className={clsx("ml-4 mt-1 text-Regular12", {
            "text-red": isError,
            "text-secondaryText": !isError,
          })}
        >
          {bottomText}
        </div>
      )}
    </ConfigProvider>
  )
);

Checkbox.displayName = "checkbox";
