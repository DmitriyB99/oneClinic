import type { Control } from "react-hook-form";

import type { NewDesktopBookingModel } from "@/entities/desktopDrawer";

interface AppointmentChip {
  fromTime: string;
  isBooked: boolean;
  toTime: string;
}
export interface NewBookingTimeProps {
  control: Control<NewDesktopBookingModel>;
  time?: string;
  onCalendarChange?: (date: string) => void;
  appointmentChips?: AppointmentChip[];
  doctorProfileId: string;
}
