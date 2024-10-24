import type { Dispatch, SetStateAction } from "react";

import type { DoctorServiceModel } from "@/entities/login";

export interface AuthDoctorServiceDialogModel {
  currentService?: DoctorServiceModel;
  openServiceDialog: boolean;
  setOpenServiceDialog: (openServiceDialog: boolean) => void;
  setServices: Dispatch<SetStateAction<DoctorServiceModel[]>>;
}
