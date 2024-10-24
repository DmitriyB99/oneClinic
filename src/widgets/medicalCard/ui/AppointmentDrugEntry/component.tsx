import type { FC } from "react";

import {
  CapsuleIcon,
  ClockFilledIcon,
  DividerSaunet,
} from "@/shared/components";

import type { DrugEntryProps } from "./props";

export const DrugEntry: FC<DrugEntryProps> = ({
  drugName,
  isDivided = false,
  totalTime,
  frequency,
}) => (
  <>
    <div className={"mt-6 flex justify-start"}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-1">
        <CapsuleIcon size="sm" />
      </div>
      <div className="ml-3 flex flex-col justify-start">
        <div className="mb-1 text-Regular16 text-dark">{drugName}</div>
        <div className="mb-1 text-Regular12 text-secondaryText">
          {frequency}
        </div>
        <div className="flex items-center text-Regular12 text-dark">
          <ClockFilledIcon size="xs" className="mr-2" />
          <div>{totalTime}</div>
        </div>
      </div>
    </div>
    {isDivided && <DividerSaunet className="my-3" />}
  </>
);
