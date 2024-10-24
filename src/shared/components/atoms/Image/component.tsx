import type { FC } from "react";

import { Image as AntImage } from "antd";
import clsx from "clsx";

import type { ImageProps } from "./props";

export const Image: FC<ImageProps> = ({ wrapperClassName, ...rest }) => (
  <div
    className={clsx(
      "w-fit rounded-md border border-solid border-gray-7 p-2",
      wrapperClassName
    )}
  >
    <AntImage {...rest} />
  </div>
);
