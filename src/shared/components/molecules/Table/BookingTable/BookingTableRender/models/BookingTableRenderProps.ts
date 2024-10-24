import type { Dispatch, SetStateAction } from "react";

import type { BookingData } from "shared/components";
export interface BookingTableRenderProps {
  data?: BookingData[];
}
export interface OtherCellsWindowProps {
  data?: BookingData[];
  setOpenPopover: Dispatch<SetStateAction<boolean>>;
  isClinic: boolean;
}
