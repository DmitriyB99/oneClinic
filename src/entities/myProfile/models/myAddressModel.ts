export interface CityModel {
  id: string;
  code: string;
  name: string;
}

export interface MyAddressModel {
  id: string;
  patient_id: string;
  apartment?: string;
  city: CityModel;
  floor?: string;
  location_point: [];
  address: string;
  type?: string;
  title?: string;
  comment?: string;
  entrance?: string;
  is_default?: boolean;
}
