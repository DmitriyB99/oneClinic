import type { AddressDetails } from "./CreateAmbulanceCallModel";

export interface AmbulanceOnRouteProps {
  readonly userProfileId: string;
  readonly address: AddressDetails;
  readonly comment: string;
  readonly price: number;
  readonly callTime: string;
  readonly handleAmbulanceCancellation: () => void;
  readonly handleBack: () => void;
  readonly handleCallDoctor?: () => void;
}
