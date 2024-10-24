import type { ContactsList } from "@/shared/contexts/userContext";

export interface ContactModel {
  id: number;
  isDoctor?: boolean;
  isRegistered: boolean;
  name: string;
  phone?: string;
  role?: string;
}

export interface AuthDoctorContactListModel {
  contacts: ContactsList[];
}
