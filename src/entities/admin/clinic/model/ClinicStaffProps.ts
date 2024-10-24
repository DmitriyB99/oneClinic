export interface ClinicStaffProps {
  clinicDoctors: StaffProfiles[];
  status?: string;
}

export interface StaffProfiles {
  userId: string;
  doctorProfileId: string;
  username: string;
}
