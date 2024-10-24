import type { FC } from "react";
import { useCallback } from "react";

import { SplideSlide } from "@splidejs/react-splide";
import clsx from "clsx";

import type { CarouselSlideProps } from "./props";

export const CarouselSlide: FC<CarouselSlideProps> = ({
  children,
  isPromo = true,
  isNew,
  src,
  onClick,
}) => {
  const renderElement = useCallback(
    () => (
      <div
        className={clsx("relative overflow-hidden p-3", {
          "mr-3 !h-26 !w-35 rounded-cardCarousel bg-gray-1": isPromo,
          "!w-[119px] !h-[138px] !mr-3 !rounded-bigCardCarousel bg-cardCarousel !shadow-cardCarousel":
            !isPromo,
        })}
      >
        <img alt="imageCarousel" src={src} className="absolute right-0 top-0" />
        <div
          className={clsx("absolute top-3", {
            "text-Semibold12": isPromo,
            "text-Regular14": !isPromo,
          })}
        >
          {children}
        </div>
      </div>
    ),
    [children, isPromo, src]
  );

  return (
    <SplideSlide className="ml-4 !w-37" onClick={onClick}>
      {isNew ? (
        <div className="h-28 w-37 !rounded-bigCardCarousel bg-transparent p-[2px]">
          {renderElement()}
        </div>
      ) : (
        <div className="h-28 w-37 p-1">{renderElement()}</div>
      )}
    </SplideSlide>
  );
};
