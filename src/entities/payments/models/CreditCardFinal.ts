export interface PaymentsCreditCardAdditionProps {
  handleClose: () => void;
  handleNext: () => void;
  handleRetry: () => void;
  type: "success" | "fail" | "noMoney";
}
