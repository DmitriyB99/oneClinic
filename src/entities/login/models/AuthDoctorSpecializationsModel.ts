export interface AuthDoctorSpecializationsModel {
  openSpecializationsDialog: boolean;
  setOpenSpecializationsDialog: (openSpecializationsDialog: boolean) => void;
  setSpecializations: (specializations: SpecializationsListType[]) => void;
  specializations: SpecializationsListType[];
}
export interface SpecializationsListType {
  name?: string;
  id: string;
  code?: string;
}
