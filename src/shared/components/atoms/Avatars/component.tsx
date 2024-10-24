import type { FC } from "react";
import { useMemo } from "react";

import { Avatar as AntdAvatar } from "antd";
import clsx from "clsx";

import type { AvatarProps } from "./props";

const sizes: { [key: string]: number } = {
  xs: 32,
  s: 36,
  m: 48,
  avatar: 40,
  l: 64,
  lg: 84,
  clinicAva: 100,
  xl: 192,
};

export const Avatar: FC<AvatarProps> = ({
  size = "m",
  icon,
  isOnline = false,
  isSquare = false,
  src,
  text,
  style,
  className,
  bottomRightIcon,
}) => {
  const sizeAvatar = useMemo(() => {
    if (typeof size === "number") {
      return size;
    }
    return sizes[size];
  }, [size]);

  return (
    <div className="relative max-w-fit h-fit">
      <AntdAvatar
        size={sizeAvatar}
        icon={icon}
        src={src}
        shape={isSquare ? "square" : "circle"}
        style={style}
        className={clsx(className, { "!rounded-xl": isSquare })}
      >
        {!!text && text}
      </AntdAvatar>
      {bottomRightIcon && (
        <div className="absolute bottom-0 right-0 border-2 border-white">
          {bottomRightIcon}
        </div>
      )}
      {isOnline && (
        <div
          className={clsx(
            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 bg-positiveStatus",
            {
              "h-4": size === "l",
              "w-4": size === "l",
            }
          )}
        />
      )}
    </div>
  );
};
