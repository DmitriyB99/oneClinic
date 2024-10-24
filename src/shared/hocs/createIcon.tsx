import type { SVGProps, FC, ReactSVGElement } from "react";
import { memo } from "react";

import clsx from "clsx";

import { createPrefixer } from "@/shared/hooks";

export type IconProps = {
  className?: string;
  color:
    | "black"
    | "brand-primary"
    | "gray-icon"
    | "gray-desktopIcon"
    | "brand-light"
    | "brand-secondary"
    | "brand-icon"
    | "dark"
    | "blue"
    | "gray-0"
    | "gray-1"
    | "gray-2"
    | "gray-3"
    | "gray-4"
    | "gray-8"
    | "neutralStatus"
    | "red"
    | "positiveStatus"
    | "white"
    | "iconDisabled"
    | ""
    | "colorPrimaryBase";
  height?: number;
  rotate: 0 | 45 | 90 | 180 | -45 | -90;
  size:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "xxl"
    | "avatar"
    | "l"
    | "mainIcon"
    | "placeholderIcon"
    | "desktopXs";
  width?: number;
};

const ICON_SIZES: Record<IconProps["size"], { height: number; width: number }> =
  {
    xxl: { width: 190, height: 190 },
    placeholderIcon: { width: 100, height: 100 },
    xl: { width: 62, height: 62 },
    lg: { width: 46, height: 46 },
    mainIcon: { width: 46, height: 46 },
    l: { width: 32, height: 32 },
    avatar: { width: 30, height: 30 },
    md: { width: 24, height: 24 },
    sm: { width: 16, height: 16 },
    xs: { width: 12, height: 12 },
    desktopXs: { width: 20, height: 20 },
  };

const colorMapper = createPrefixer<IconProps["color"]>("text");
const rotationMapper = createPrefixer<IconProps["rotate"]>("rotate");

export function createIcon(
  RawIcon: FC<SVGProps<ReactSVGElement>>,
  defaultProps?: Partial<IconProps>
) {
  // eslint-disable-next-line react/display-name
  return memo((props: Partial<IconProps>) => {
    const actualProps = { ...defaultProps, ...props };
    const size = ICON_SIZES[actualProps.size ?? "md"];
    const rotation = actualProps.rotate ?? 0;

    return (
      <RawIcon
        width={actualProps.width ?? size.width}
        height={actualProps.height ?? size.height}
        className={clsx(
          colorMapper(actualProps.color ?? "black"),
          Boolean(rotation) && rotationMapper(rotation),
          actualProps.className
        )}
      />
    );
  });
}
