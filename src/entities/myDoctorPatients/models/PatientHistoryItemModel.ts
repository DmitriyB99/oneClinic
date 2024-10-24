export type ServiceType = "appointment" | "analysis";

export interface PatientHistoryItem {
  caption?: string;
  date: string;
  id: string;
  serviceType?: ServiceType;
  title: string;
}
