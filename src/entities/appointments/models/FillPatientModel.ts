import { FamilyMember } from "@/shared/api/patient/family";
import type { SubmitHandler } from "react-hook-form";

export interface PatientInfoFillDialogProps {
  handleBack?: () => void;
  refetch?: () => void;
  refetchMyProfile?: () => void;
  isMyProfile?: boolean;
  onSubmit?: SubmitHandler<FamilyMember>;
}
