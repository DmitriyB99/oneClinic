import type dayjs from "dayjs";

import type { BookDatesModel } from "@/shared/components";

export interface DateFullCellRenderProps {
  bookDates?: BookDatesModel[];
  date: dayjs.Dayjs;
  selectedDate: dayjs.Dayjs;
}
