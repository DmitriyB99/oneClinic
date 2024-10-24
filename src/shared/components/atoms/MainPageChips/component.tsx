import type { FC } from "react";

import clsx from "clsx";
import { useRouter } from "next/router";

import type { MainPageChipsProps } from "./props";

export const MainPageChip: FC<MainPageChipsProps> = ({
  icon,
  bottomText,
  className,
  redirectTo,
  onClick,
}) => {
  const router = useRouter();
  return (
    <div
      className={clsx(
        "flex w-[68px] cursor-pointer flex-col items-center",
        className
      )}
      onClick={() => {
        if (redirectTo) {
          router.push(`${redirectTo}`);
        }
        onClick?.();
      }}
    >
      <div
        className={clsx(
          "mb-2 flex h-12 w-12 items-center justify-center rounded-3xl"
        )}
      >
        {icon}
      </div>
      <div className="w-full overflow-hidden text-ellipsis text-center text-Regular14">
        {bottomText}
      </div>
    </div>
  );
};
