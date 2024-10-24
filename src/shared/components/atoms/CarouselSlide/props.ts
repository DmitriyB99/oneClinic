import type { ReactNode } from "react";

export interface CarouselSlideProps {
  children: ReactNode;
  isNew?: boolean;
  isPromo?: boolean;
  onClick?: () => void;
  src?: string;
}
