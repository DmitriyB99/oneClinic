import type { ReactElement } from "react";

import type { IconProps } from "@/shared/hocs";

export interface DesktopMainCardProps {
  icon?: ReactElement<IconProps>;
  onClick?: (path?: string) => void;
  path?: string;
  percentage?: string | number;
  status?: boolean;
  title?: string;
  value?: number | string;
}

export interface DesktopMainSubCardProps {
  className?: string;
  doctorName?: string;
  expanded?: boolean;
  isTransaction?: boolean;
  name?: string;
  notifications: string;
  onClick?: () => void;
  time: string | number;
  type?: string;
  amount?: number;
  paymentStatus?: string;
}

export interface DesktopNavLinkProps {
  icon?: ReactElement<IconProps>;
  isActive?: boolean;
  onClick?: () => void;
  subLinks?: Array<SubLinksProps>;
  title?: string;
  permission?: string[] | string;
}

interface SubLinksProps {
  title?: string;
}
