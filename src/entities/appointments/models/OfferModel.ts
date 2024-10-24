export interface OfferModel {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleGoToNextPage: () => void;
  isLoading: boolean;
}
