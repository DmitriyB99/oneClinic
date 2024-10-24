import axios from "axios";

import { mapKey } from "@/shared/config";
export const mapApi = {
  getByCoords: (geocode: string) =>
    axios.get("https://geocode-maps.yandex.ru/1.x/", {
      params: {
        apikey: mapKey,
        geocode,
        format: "json",
        kind: "locality",
        results: 1,
      },
    }),
};
