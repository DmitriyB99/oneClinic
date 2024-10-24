import type { FC } from "react";
import { useCallback, useMemo, useState } from "react";
import { useMutation } from "react-query";

import type { Clinic } from "@/entities/clinics";
import type { WorkPeriod } from "@/shared/api/clinics";
import { patientFavouritesApi } from "@/shared/api/patient/favourites";
import { Avatar, Island, StarIcon } from "@/shared/components";
import { LikeButton } from "@/shared/components/molecules/FavouriteButton";
import { useFavourite } from "@/shared/hooks/useFavourite";
import { convertStringToAvatarLabel } from "@/shared/utils";

export const AboutClinic: FC<
  Partial<Clinic> & {
    workPeriods?: WorkPeriod[];
  }
> = ({
  name,
  rating,
  icon_url,
  description,
  reviews_count,
  id,
  is_favourite,
}) => {
  const convertedAvatarLabel = useMemo(
    () => convertStringToAvatarLabel(name),
    [name]
  );

  const [isFavourite, setIsFavourite] = useState(is_favourite);
  const { handleLikeToggle } = useFavourite("Clinic");
  const onToggleFavourite = () => {
    handleLikeToggle(id, isFavourite, (updatedState) => {
      setIsFavourite(updatedState);
    });
  };

  return (
    <Island className="my-2">
      <div className="flex items-center">
        <Avatar text={convertedAvatarLabel} src={icon_url} size="lg" />
        <div className="ml-4 w-full">
          <p className="mb-1 text-Medium16">{name}</p>
          <div className="mb-1 flex items-center">
            <StarIcon size="xs" />
            <p className="mb-0 ml-1 text-Semibold12">{rating?.toFixed(1)}</p>
            <p className="mb-0 ml-2 text-Regular12 text-secondaryText">
              {reviews_count} отзыва
            </p>
          </div>
          <div className="flex items-center">
            <div className="mr-1.5 h-2 w-2 rounded-full bg-positiveStatus" />
            <p className="mb-0 text-Regular12">Сегодня c 9:00 до 18:00</p>
          </div>
        </div>
        <LikeButton initialLiked={is_favourite} onToggle={onToggleFavourite} />
      </div>
      <p className="mb-3 mt-4 text-Bold20">О клинике</p>
      <p className="mb-0 text-Regular14">{description}</p>
    </Island>
  );
};
