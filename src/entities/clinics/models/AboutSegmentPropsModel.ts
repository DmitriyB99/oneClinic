import type { EducationBlockModel } from "@/widgets/auth/models";

export interface AboutSegmentProps {
  studyDegrees?: EducationBlockModel[];
  clinicInfo?: {
    title: string;
    address: string;
    locationPoint?: {
      x: number;
      y: number;
    };
  };
}
