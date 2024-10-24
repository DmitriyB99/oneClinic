import type { SubmitHandler } from "react-hook-form";

export interface CreditCardForm {
  cardNumber: string;
  cvc: string;
  expirationDate: string;
}
export interface PaymentsCreditCardAddition {
  handleBack?: () => void;
  handleClose?: () => void;
  handleGoToNextPage?: () => void;
  isLoading?: boolean;
  onSubmit: SubmitHandler<CreditCardForm>;
}
