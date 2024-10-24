export interface AppointmentChooseDirectionProps {
  userProfileId: string;
  handleBack?: () => void;
  handleClose: () => void;
  handleGoNext?: (id?: string | number) => void;
  setIsInDirection?: (status: boolean) => void;
}
