import type { WeekdayEnglish } from "@/entities/login";

export interface Clinic {
  street: string | null;
  city_name: string | null;
  city_id: string | null;
  id: string;
  created: string;
  email: string | null;
  icon_url?: string | null;
  location?: { latitude: number; longitude: number };
  modified: null;
  name: string;
  phone_number: string | null;
  rating: number;
  status: "ACTIVE";
  tags: string[] | null;
  work_periods: WorkPeriod[] | null;
  phoneNumbers: ClinicPhoneNumbers[];
  description?: string;
  reviews_count?: number;
  is_favourite?: boolean;
}

export interface ClinicPhoneNumbers {
  title: string;
  phoneNumber: string;
}

export interface WorkPeriod {
  day_of_week: WeekdayEnglish;
  is_working?: boolean;
  start_time?: string;
  end_time?: string;
  is_24hour_working?: boolean;
}
