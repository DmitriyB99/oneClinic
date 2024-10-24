export interface ClinicBookingSlots {
  id: string;
  bookingType: string;
  analysisType: string;
  analysisTypeId: string;
  analysisTypeName: string;
  serviceDirectoryName: string;
  serviceDirectoryId: string;
  doctorFullName: string;
  doctorProfileId: string;
  userProfileId: string;
  reservedUserId: string;
  patientFullName: string;
  patientPhoneNumber: string;
  clinicId: string;
  price: number;
  consultationType: string;
  consultationStatus: string;
  samplingMethods: string[];
  fromTime: string;
  toTime: string;
}
