export interface Pageable {
  page: number;
  size: number;
  sort: string;
}

export interface GetTreatmentByIdResponseDTO {
  category: string;
  categoryId: string;
  created: Date;
  doctorProfileId: string;
  id: string;
  isUsed: boolean;
  medicalPrescriptionId: string;
  updated: Date;
  userId: string;
  userProfileId: string;
}

export interface GetAllTreatmentsPayloadDTO {
  category: string | null;
  doctorFullname: string | null;
  reservedFullname: string | null;
  userProfileId: string | null;
  isUsed: boolean;
  created: string | null;
}

export interface GetAllTreatmentsResponseDTO {
  category: string;
  categoryId: string;
  categoryName: string;
  created: string;
  doctorFullname: string;
  doctorProfileId: string;
  id: string;
  reservedFullname: string;
  userProfileId: string;
}
