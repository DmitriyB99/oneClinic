import type { SubmitHandler } from "react-hook-form";

import type { AppointmentFormat } from "@/entities/appointments";

export interface AppointmentTimeAndFormat {
  date: Date;
  format: AppointmentFormat;
  time: string;
}

interface AppointmentChip {
  fromTime: string;
  isBooked: boolean;
  toTime: string;
}

export interface AppointmentChooseTimeFormatProps {
  appointmentChips?: AppointmentChip[];
  defaultSegmentValue?: string;
  handleBack?: () => void;
  onCalendarChange?: (date: string) => void;
  onSubmit: SubmitHandler<AppointmentTimeAndFormat>;
  onlineDisabled?: boolean;
  withConsultationTypeTabs?: boolean;
  doctorProfileId?: string;
  clinicId?: string;
}
