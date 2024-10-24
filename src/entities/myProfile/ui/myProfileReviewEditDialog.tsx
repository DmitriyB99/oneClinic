import type { FC } from "react";
import { useCallback, useState } from "react";

import type { MyProfileReviewEditDialogProps } from "@/entities/myProfile";
import { Button, CloseIcon, InputTextarea } from "@/shared/components";
import { useMutation } from "react-query";
import { patientReviewsApi } from "@/shared/api/patient/reviews";

export const MyProfileReviewEditDialog: FC<MyProfileReviewEditDialogProps> = ({
  id,
  comment: initialComment,
  onClose,
  isClinicReview,
  refetchDoctorReviews,
  refetchClinicReviews,
}) => {
  const [comment, setComment] = useState<string>(initialComment);

  const { mutate: updateClinicReview } = useMutation(
    ["updateClinicReview"],
    (data: { id: string; comment: string }) =>
      patientReviewsApi.updateClinicReview(data),
    {
      onSuccess: () => {
        refetchClinicReviews();
      },
    }
  );

  const { mutate: updateDoctorReview } = useMutation(
    ["updateDoctorReview"],
    (data: { id: string; comment: string }) =>
      patientReviewsApi.updateDoctorReview(data),
    {
      onSuccess: () => {
        refetchDoctorReviews();
      },
    }
  );

  const onSaveClick = useCallback(() => {
    isClinicReview
      ? updateClinicReview({ id, comment })
      : updateDoctorReview({ id, comment });

    onClose();
  }, [updateClinicReview, updateDoctorReview, id, comment, isClinicReview]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div />
        <div className="ml-12 text-Bold16">Редактирование</div>
        <Button variant="tertiary" onClick={onClose}>
          <CloseIcon />
        </Button>
      </div>
      <InputTextarea
        className="mb-7 !border-solid !border-2 !border-neutralStatus"
        rows={6}
        defaultValue={comment}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        label="Комментарий"
      />
      <Button
        className="w-full"
        variant="primary"
        onClick={() => {
          onSaveClick();
        }}
      >
        Сохранить
      </Button>
    </div>
  );
};
