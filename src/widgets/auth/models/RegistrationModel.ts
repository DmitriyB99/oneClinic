export interface DoctorRegistrationModel {
  fatherName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  specialityCodes: string[];
  username: string;
  iin: string;
  email: string;
}

export interface ManagerRegistrationModel {
  bin: string;
  name: string;
  email: string;
  fatherName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface ClinicRegistrationRequestModel {
  clinicId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  fullName: string;
  name: string;
  phoneNumber: string;
}
