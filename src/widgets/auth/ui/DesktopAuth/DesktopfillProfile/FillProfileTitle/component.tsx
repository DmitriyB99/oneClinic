import type { FC } from "react";

import { ArrowLeftIcon, Button } from "@/shared/components";
import type { DesktopFillProfileTitleModel } from "@/widgets/auth/models";

export const DesktopFillProfileTitle: FC<DesktopFillProfileTitleModel> = ({
  labelCount,
  titleText,
  children,
  back,
}) => (
  <div className="mt-24 w-[508px]">
    <div className="flex gap-4">
      {back && (
        <Button
          variant="tertiary"
          className="!h-10 bg-white !p-2"
          onClick={back}
        >
          <ArrowLeftIcon />
        </Button>
      )}
      <div className="text-Bold32 text-gray-icon">{labelCount}</div>
    </div>
    <div className="mt-4 text-Bold32">{titleText}</div>
    {children}
  </div>
);
