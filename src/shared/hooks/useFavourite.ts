import { useCallback } from "react";
import { useMutation } from "react-query";

import { patientFavouritesApi } from "@/shared/api/patient/favourites";

type FavouriteType = "Clinic" | "Doctor";

export const useFavourite = (type: FavouriteType) => {
  const { mutate: addFavourite } = useMutation(
    [`addFavourite${type}`],
    (id: string) => {
      if (type === "Clinic") {
        return patientFavouritesApi.addFavouriteClinic(id);
      } else if (type === "Doctor") {
        return patientFavouritesApi.addFavouriteDoctor(id);
      }
    }
  );

  const { mutate: deleteFavourite } = useMutation(
    [`deleteFavourite${type}`],
    (id: string) => {
      if (type === "Clinic") {
        return patientFavouritesApi.deleteFavouriteClinic(id);
      } else if (type === "Doctor") {
        return patientFavouritesApi.deleteFavouriteDoctor(id);
      }
    }
  );

  const handleLikeToggle = useCallback(
    (
      id: string,
      isFavourite: boolean,
      updateFavouriteState: (newState: boolean) => void
    ) => {
      if (isFavourite) {
        deleteFavourite(id, {
          onSuccess: () => updateFavouriteState(false),
        });
      } else {
        addFavourite(id, {
          onSuccess: () => updateFavouriteState(true),
        });
      }
    },
    [addFavourite, deleteFavourite]
  );

  return { handleLikeToggle };
};
