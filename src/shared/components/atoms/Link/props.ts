import type { PropsWithChildren } from "react";

import type { LinkProps } from "next/link";

type LinkSizes = "s" | "m" | "l";

export interface LinkSaunetProps extends LinkProps, PropsWithChildren {
  size?: LinkSizes;
}
