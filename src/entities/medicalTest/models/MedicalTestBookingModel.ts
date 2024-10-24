export interface CreateBookingSlotModel {
  analysisTypeId?: string;
  clinicId?: string;
  consultationStatus?: string;
  fromTime?: string;
  price?: number;
  reservedUserId?: string;
  samplingMethods?: string[];
  serviceDirectoryId?: string;
  toTime?: string;
  type?: string;
  userProfileId?: string;
}

export interface BookingSlotModel extends CreateBookingSlotModel {
  created?: string;
  id?: string;
  modified?: string;
}

export interface MedicalTestSlotModel {
  analysisType: string;
  analysisTypeName?: string;
  bookingMedicalTestSlotId: string;
  clinicInfo?: {
    clinicId: string;
  };
  consultationStatus: string;
  doctorFullName: string;
  id: string;
  name: string;
  samplingMethod: string;
  serviceDirectoryId: string;
}
