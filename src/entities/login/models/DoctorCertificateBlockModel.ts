import type { Dispatch, SetStateAction } from "react";

import type { CertificateModel } from "@/widgets/auth/models";

export interface DoctorCertificateBlockModel {
  doctorId?: string;
  id: number;
  setCertificates: Dispatch<SetStateAction<CertificateModel[]>>;
}
