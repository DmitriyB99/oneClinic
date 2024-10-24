import type { FC } from "react";
import { useMemo } from "react";

import { IconPlaceholder, Island } from "@/shared/components";

const videoCount = 0;

export const VideosSegment: FC = () => {
  const isEmpty = useMemo(() => (videoCount as number) === 0, []);
  return (
    <Island className="mt-2">
      {isEmpty ? (
        <div className="my-3">
          <div className="mb-6 flex justify-center">
            <IconPlaceholder size="placeholderIcon" color="gray-1" />
          </div>
          <div className="mb-3 text-center text-Bold20 text-secondaryText">
            Загрузите свое первое видео
          </div>
          <div className="text-center text-Regular16 text-secondaryText">
            Поделитесь своим опытом или дайте полезный совет
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {Array.from(Array(videoCount).keys()).map((el) => (
            <div key={el}>
              <img
                src="https://picsum.photos/200/300"
                alt="image"
                className="w-full rounded-3xl"
              />
            </div>
          ))}
        </div>
      )}
    </Island>
  );
};
