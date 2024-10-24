export interface familyMemberType {
  code: string;
  name: string;
}

export interface MyProfileModel {
  created: string;
  birth_date: string | null;
  familyId: string | null;
  id: string;
  iin: string | null;
  invitingFamilyId: string | null;
  gender: string | null;
  is_mine: boolean;
  modified: string;
  name: string | null;
  father_name: string | null;
  family_member_type?: familyMemberType;
  phone: string | null;
  photo_url: string | null;
  surname: string | null;
  // userId: string;
  whoIs: string | null;
}
