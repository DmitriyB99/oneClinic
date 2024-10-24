export interface ConsultationCardModel {
  date: string;
  imageUrl?: string;
  name: string;
  onClick?: () => void;
  serviceType: string;
  time: string;
  type: string;
  status: string;
  fromTime: string;
}
