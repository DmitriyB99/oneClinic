import type { FC } from "react";
import { useCallback, useState } from "react";
import { useMutation } from "react-query";

import { clinicsApi } from "@/shared/api/clinics";
import { Button, Dialog, InputText } from "@/shared/components";

interface Props {
  reviewingId: string;
  refetchReviews: () => void;
  canAddReview: boolean;
}

export const ModalAddRating: FC<Props> = ({
  reviewingId,
  refetchReviews,
  canAddReview,
}) => {
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);

  const { mutate: addReview } = useMutation(
    ["addReview"],
    () =>
      clinicsApi.addReviews("clinic", {
        rating: stars,
        text: review,
        reviewingId,
      }),
    {
      onSuccess: () => refetchReviews(),
    }
  );

  const onAddReview = useCallback(() => {
    addReview();
    setOpen(false);
  }, [addReview]);

  return (
    <>
      {canAddReview && (
        <Button
          size="s"
          className="flex items-center rounded-full text-Medium12"
          onClick={() => setOpen(true)}
        >
          Добавить отзыв
        </Button>
      )}
      <Dialog isOpen={open} setIsOpen={setOpen}>
        <>
          <InputText
            wrapperClassName="mb-4"
            label="Отзыв"
            name="review"
            onChange={(val) => setReview(val.target.value)}
          />
          <InputText
            wrapperClassName="mb-4"
            label="Рейтинг"
            name="rating"
            onChange={(val) => setStars(parseInt(val.target.value))}
          />
          <Button onClick={onAddReview}>Оставить отзыв</Button>
        </>
      </Dialog>
    </>
  );
};
