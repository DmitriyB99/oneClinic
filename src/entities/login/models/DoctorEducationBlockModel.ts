import type { Dispatch, SetStateAction } from "react";

import type { EducationBlockModel } from "@/widgets/auth/models";

export interface DoctorEducationBlockModel {
  doctorId?: string;
  id: number;
  setEducationBlocks: Dispatch<SetStateAction<EducationBlockModel[]>>;
}
