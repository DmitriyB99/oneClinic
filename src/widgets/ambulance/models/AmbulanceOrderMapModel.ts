import type { Dispatch, SetStateAction } from "react";

export type Coords = [number, number];

export interface AmbulanceOrderMapProps {
  setAddressData: (streetAddress: string, coords: number[], city: string) => void;
  userCoordinates: Coords;
  setSelectedMap?: Dispatch<SetStateAction<boolean | undefined>>;
  width?: string;
  height?: string;
  desktop?: boolean;
}
