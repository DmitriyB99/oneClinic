import type { FC } from "react";

import clsx from "clsx";

import { Carousel } from "@/shared/components";

import type { TabsPaginationProps } from "./props";

export const TabsPagination: FC<TabsPaginationProps> = ({
  activeIndex,
  items,
}) => (
  <>
    {/* <div className="absolute bottom-80 flex w-full justify-center">
      {items.map((_element, index) => (
        <div
          key={index}
          className={clsx(
            "ml-2 h-2 w-3 rounded-[13px] bg-white transition-all duration-500 pb-2 z-10",
            {
              "text-white w-6": index === activeIndex,
            }
          )}
        />
      ))}
    </div> */}
    <Carousel activeIndex={activeIndex} items={items} free={false} />
  </>
);
