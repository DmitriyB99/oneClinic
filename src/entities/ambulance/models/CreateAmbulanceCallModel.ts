export interface AddressDetails {
  address: string;
  city: string;
  entrance: string;
  flat: string;
  floor: string;
}

export interface CreateAmbulanceCallModel {
  address: AddressDetails;
  comment: string;
  created?: string;
  id?: string;
  map: {
    latitude: number;
    longitude: number;
  };
  phoneNumber: string;
  price?: number;
  status?: string;
  updated?: string;
  userId: string;
  userProfileId: string;
}
