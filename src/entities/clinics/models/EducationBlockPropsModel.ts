import type { EducationBlockModel } from "@/widgets/auth/models";
export enum DegreesEnum {
  "bachelor" = "Бакалавр",
  "candidate" = "Кандидат медицинских наук",
  "doctor" = "Доктор медицинских наук",
  "master" = "Магистр",
  "specialist" = "Специалист",
}

export interface EducationBlockProps {
  educations?: EducationBlockModel[];
  isEditable?: boolean;
  onAddEducation?: () => void;
}
