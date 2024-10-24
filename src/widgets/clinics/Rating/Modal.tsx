import type { FC } from "react";
import { useState } from "react";

import { ArrowRightOutlined } from "@ant-design/icons";

import {
  ArrowLeftIcon,
  Button,
  Dialog,
  DividerSaunet,
  Navbar,
  RatingCard,
} from "@/shared/components";

export const ModalRatingClinics: FC<{
  content: {
    created: Date;
    id: string;
    rating: number;
    reviewerName: string;
    text: string;
  }[];
}> = ({ content }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="s"
        variant="tinted"
        className="flex items-center rounded-full bg-gray-2 text-Medium12"
        onClick={() => setOpen(true)}
      >
        Все отзывы
        <ArrowRightOutlined />
      </Button>
      <Dialog isOpen={open} setIsOpen={setOpen}>
        <>
          <Navbar
            title="Отзывы"
            leftButtonOnClick={() => setOpen(false)}
            buttonIcon={<ArrowLeftIcon />}
          />
          {content.map((rating) => (
            <div key={rating.id}>
              <RatingCard
                className="mb-4"
                name={rating.reviewerName}
                rating={rating.rating}
                date={rating.created}
              />
              <p className="text-Regular14">{rating.text}</p>
              <DividerSaunet className="m-0 mb-3" />
            </div>
          ))}
        </>
      </Dialog>
    </>
  );
};
