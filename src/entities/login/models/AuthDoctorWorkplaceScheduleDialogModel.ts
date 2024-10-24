import type { Weekday, WorkplaceModel } from "@/entities/login";

export interface DaysListType {
  day: Weekday;
  endTime: string;
  id?: number;
  isChecked: boolean;
  startTime: string;
}

export interface AuthDoctorWorkplaceScheduleDialogModel {
  activeWorkplace?: WorkplaceModel;
  openWorkplaceScheduleDialog: boolean;
  setOpenWorkplaceScheduleDialog: (
    openWorkplaceScheduleDialog: boolean
  ) => void;
  workHereButton?: boolean;
  onWorkPeriodChanged?: (updatedWorkplace?: WorkplaceModel) => void;
}
