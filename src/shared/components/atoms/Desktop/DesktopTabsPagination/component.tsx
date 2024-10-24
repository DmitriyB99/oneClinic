import type { FC } from "react";

import clsx from "clsx";

import type { TabsPaginationProps } from "./props";

export const DesktopTabsPagination: FC<TabsPaginationProps> = ({
  activeIndex,
  items,
}) => (
  <>
    <div className="flex w-full gap-2">
      {items.map((_element, index) => (
        <div
          key={index}
          className={clsx(
            "h-[3px] w-4 bg-lightDark transition-all duration-500",
            {
              "!bg-brand-dark w-6": index === activeIndex,
            }
          )}
        />
      ))}
    </div>
    {items.map(
      (_element, index) =>
        index === activeIndex && (
          <div key={index} className="relative h-full w-full">
            {_element}
          </div>
        )
    )}
  </>
);
