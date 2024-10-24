import { useEffect, useMemo, useState } from "react";

import { mapApi } from "@/shared/api/map";

export const useGetCity = (lat: number, long: number) => {
  const geoCode = useMemo(() => `${long},${lat}`, [lat, long]);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [country, setCountry] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (lat && long) {
      mapApi
        .getByCoords(geoCode)
        .then((response) => {
          const { data } = response;
          const featureMember =
            data.response.GeoObjectCollection.featureMember[0].GeoObject;
          setCity(featureMember.name);
          setCountry(featureMember.description);
        })
        .catch((error) => {
          console.error("Error fetching city data:", error);
        });
    }
  }, [lat, long, geoCode]);

  return {
    city,
    country,
  };
};
