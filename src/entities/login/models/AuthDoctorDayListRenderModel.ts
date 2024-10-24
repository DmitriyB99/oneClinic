import type { Dispatch, SetStateAction } from "react";

import type { DaysListType } from "@/entities/login";

export interface AuthDoctorDayListRenderModel {
  endTime: string;
  id: number;
  isChecked: boolean;
  setDaysList: Dispatch<SetStateAction<DaysListType[]>>;
  startTime: string;
}
