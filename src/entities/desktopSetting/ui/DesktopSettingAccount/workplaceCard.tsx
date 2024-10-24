import type { FC } from "react";

import type { WorkplaceCardProps } from "@/entities/desktopSetting";
import { TrashIcon } from "@/shared/components";

export const WorkplaceCard: FC<WorkplaceCardProps> = ({
  address,
  worktime,
  title,
  trashClick,
  onClick,
}) => (
  <div
    className="mt-4 flex cursor-pointer justify-between rounded-lg bg-gray-bgCard px-4 py-3 hover:brightness-90"
    onClick={onClick}
  >
    <div>
      <div className="text-Regular12 text-secondaryText">{worktime}</div>
      <div className="mt-1 text-Regular16">{title}</div>
      <div className="mt-1 text-Regular12 text-secondaryText">{address}</div>
    </div>
    <div className="flex items-center gap-4">
      {/* TODO: Add this after DeadLine */}
      {/* <EditIcon color="gray-icon" className="cursor-pointer hover:text-black" /> */}
      <div onClick={trashClick}>
        <TrashIcon
          color="gray-icon"
          className="cursor-pointer hover:text-black"
        />
      </div>
    </div>
  </div>
);
