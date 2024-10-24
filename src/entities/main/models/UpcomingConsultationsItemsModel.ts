import type { NextRouter } from "next/router";

import type { GetBookingInfoByDateResponseDTO } from "@/shared/api/dtos";

export type ParseConsultationTypes =
  | "Прием в клинике"
  | "Вызов врача на дом"
  | "Онлайн консультация"
  | "Анализы";

export interface ConsultationType {
  text: ParseConsultationTypes;
  icon: JSX.Element;
}

export interface UpcomingConsultationsItemsModel {
  consultation?: GetBookingInfoByDateResponseDTO;
  parseConsultationType: (type: string) => ConsultationType;
  router: NextRouter;
}
