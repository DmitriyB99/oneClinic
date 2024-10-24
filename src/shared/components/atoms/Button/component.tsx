import type { FC } from "react";

import { Button as AntdButton } from "antd";
import clsx from "clsx";

import type { SaunetButtonProps } from "./props";

const classes: { [key: string]: string } = {
  primary:
    "bg-brand-primary text-white border-none hover:active:bg-pressedButton-primary hover:active:border-none",
  secondary:
    "bg-transparent border-brand-primary border-2 hover:active:!border-brand-primary hover:active:bg-pressedButton-secondary",
  tertiary:
    "bg-transparent border-none hover:active:bg-pressedButton-tertiary !shadow-none",
  tinted:
    "bg-brand-superLight border-none hover:active:bg-pressedButton-tinted",
  outline: "bg-transparent border hover:active:!bg-transparent",
};

export const Button: FC<SaunetButtonProps> = (props) => {
  const {
    size = "m",
    variant = "primary",
    square,
    transparent,
    danger,
    iconButton,
    outlineDanger,
    style,
    ...rest
  } = props;
  return (
    <AntdButton
      {...rest}
      style={style}
      className={clsx(
        "px-3 text-Medium16 shadow-none hover:!text-gray-3 hover:active:!text-brand-light",
        classes[variant],
        {
          "h-8 rounded-xl": size === "s",
          "h-14 rounded-2xl": size === "m",
          "w-8 rounded-bigCardCarousel": size === "s" && square,
          "w-14 p-4 rounded-bigCardCarousel": size === "m" && square,
          "h-11 rounded-xl": size === "desktopS",
          "bg-toolbarButton": transparent,
          "!bg-red": danger,
          "hover:active:!bg-pressedButton-tinted": danger,
          "!w-9 !h-9 flex justify-center items-center": iconButton,
          "border-red text-red": outlineDanger,
          "hover:!text-pressedButton-outlineDanger hover:!border-pressedButton-outlineDanger hover:active:!text-red":
            outlineDanger,
        },
        props.className
      )}
    />
  );
};
