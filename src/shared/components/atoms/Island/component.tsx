import type { FC, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";

import clsx from "clsx";

interface IslandProps {
  children?: ReactNode;
  className?: string;
  description?: string;
  isCard?: boolean;
  onClick?: () => void;
  title?: string;
}

export const Island = forwardRef<HTMLDivElement, IslandProps>(
  (
    { children, isCard, className, title, description, onClick },
    ref: ForwardedRef<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={clsx("rounded-3xl bg-white p-4", className, {
        "rounded-[20px] shadow-card": isCard,
        "cursor-pointer": !!onClick,
      })}
      onClick={onClick}
    >
      {title && <h3 className="mb-2 text-Bold14 text-dark">{title}</h3>}
      {description && (
        <p className="text-Regular12 text-secondaryText">{description}</p>
      )}
      {children}
    </div>
  )
);

Island.displayName = "Island";
