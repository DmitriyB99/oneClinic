import type { Dispatch, SetStateAction } from "react";

import type { CertificateModel } from "@/widgets/auth";

export type CertificateFormInputs = {
  certificates: CertificateModel[];
};

export interface AddCertificateFormProps {
  doctorId: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onFormSubmit: (data: CertificateFormInputs) => void;
  existingCertificates: CertificateModel[];
}
