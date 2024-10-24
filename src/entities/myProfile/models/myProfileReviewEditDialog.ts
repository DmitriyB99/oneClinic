export interface MyProfileReviewEditDialogProps {
  id: string;
  onClose: () => void;
  comment: string;
  isClinicReview: boolean;
  refetchClinicReviews: () => void;
  refetchDoctorReviews: () => void;
}
