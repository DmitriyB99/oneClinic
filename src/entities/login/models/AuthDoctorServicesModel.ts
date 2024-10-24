export interface DoctorServiceModel {
  id: string;
  price?: {
    firstPrice: number;
    secondPrice: number;
  } | null;
  title: string;
}
