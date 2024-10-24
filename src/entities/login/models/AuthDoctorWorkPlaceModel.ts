/* eslint-disable typescript-sort-keys/string-enum */

import type { SetStateAction } from "react";

import type { Clinic } from "@/entities/clinics";

export enum WeekdayEnum {
  "Понедельник" = "MONDAY",
  "Вторник" = "TUESDAY",
  "Среда" = "WEDNESDAY",
  "Четверг" = "THURSDAY",
  "Пятница" = "FRIDAY",
  "Суббота" = "SATURDAY",
  "Воскресенье" = "SUNDAY",
}

export type Weekday = keyof typeof WeekdayEnum;

export type WeekdayEnglish = typeof WeekdayEnum[keyof typeof WeekdayEnum];

export interface WorkScheduleModel {
  day: WeekdayEnum | string;
  endTime: string;
  startTime: string;
}

export interface WorkplaceModel extends Clinic {
  checked: boolean;
  workPeriods?: WorkScheduleModel[];
}

export interface AuthDoctorWorkPlaceModel {
  openWorkPlaceDialog: boolean;
  setOpenWorkPlaceDialog: (openWorkPlaceDialog: boolean) => void;
  setWorkPlaces: React.Dispatch<SetStateAction<WorkplaceModel[]>>;
  workPlaces: WorkplaceModel[];
}
