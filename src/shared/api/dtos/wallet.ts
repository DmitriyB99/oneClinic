export interface GetWalletBalanceResponseDTO {
  id: string;
  userId: string;
  clinicId: string | null;
  currency: string;
  balance: number;
}

export interface GetAllWalletTransactionsPayloadDTO {
  transactionType?: string;
  transactionStatus?: string;
  from?: string;
  to?: string;
}

export interface WalletTransactionInfo {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  productName: string;
  note: string | null;
  currency: string;
  amount: number;
  transactionType: string;
  transactionStatus: string;
  created: string;
  modified: string;
}

export interface GetWalletTransactionsResponseDTO {
  first: string | null;
  last: string | null;
  sort: string | null;
  totalElements: number;
  content: Array<Partial<WalletTransactionInfo>>;
}
