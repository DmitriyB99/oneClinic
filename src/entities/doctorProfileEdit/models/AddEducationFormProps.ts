import type { Dispatch, SetStateAction } from "react";

import type { EducationBlockModel } from "@/widgets/auth";

export type EducationFormInputs = {
  studyDegrees: EducationBlockModel[];
};

export interface AddEducationFormProps {
  doctorId: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onFormSubmit: (data: EducationFormInputs) => void;
  existingStudyDegrees: EducationBlockModel[];
}
