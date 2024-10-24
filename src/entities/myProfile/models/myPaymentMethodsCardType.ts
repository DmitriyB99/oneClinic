export interface PaymentCardType {
  active: boolean;
  id: string;
  lastDigits: string;
  paymentNetwork: "mastercard" | "visa";
}
