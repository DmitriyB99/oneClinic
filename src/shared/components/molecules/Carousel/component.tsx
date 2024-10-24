/* eslint-disable import/extensions */
import type { FC, ReactElement } from "react";
import { useEffect, useRef } from "react";

import type { SplideProps } from "@splidejs/react-splide";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import clsx from "clsx";

export const Carousel: FC<
  SplideProps & {
    activeIndex?: number;
    customSlides?: boolean;
    free?: boolean;
    fullHeight?: boolean;
    items: ReactElement[];
  }
> = ({
  items,
  activeIndex,
  free = true,
  options,
  fullHeight,
  customSlides,
  className,
  ...rest
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const carousel = useRef<any>(null);
  useEffect(() => {
    carousel?.current?.go(activeIndex);
  }, [activeIndex]);
  return (
    <Splide
      ref={carousel}
      options={{
        arrows: false,
        pagination: false,
        drag: free ? "free" : false,
        autoHeight: true,
        ...options,
      }}
      className={clsx(className, { "[&>div]:h-full h-full": fullHeight })}
      {...rest}
    >
      {customSlides
        ? items.map((_element) => _element)
        : items.map((_element) => (
            <SplideSlide
              key={_element.key}
              className={clsx({ "!w-auto": free })}
            >
              {_element}
            </SplideSlide>
          ))}
    </Splide>
  );
};
