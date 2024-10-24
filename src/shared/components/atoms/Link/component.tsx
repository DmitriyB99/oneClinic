import type { FC } from "react";

import clsx from "clsx";
import Link from "next/link";

import type { LinkSaunetProps } from "./props";

export const LinkSaunet: FC<LinkSaunetProps> = ({
  children,
  size = "m",
  ...rest
}) => (
  <Link
    className={clsx("text-blue no-underline", {
      "text-Regular16": size === "l",
      "text-Regular14": size === "m",
      "text-Regular12": size === "s",
    })}
    {...rest}
  >
    {children}
  </Link>
);
