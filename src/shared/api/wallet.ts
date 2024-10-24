import type { AxiosResponse } from "axios";

import { api } from "@/shared/api/instance";

import type {
  Pageable,
  GetWalletBalanceResponseDTO,
  GetAllWalletTransactionsPayloadDTO,
  GetWalletTransactionsResponseDTO,
} from "./dtos";

export const walletApi = {
  getWalletBalance(): Promise<
    AxiosResponse<Partial<GetWalletBalanceResponseDTO>>
  > {
    return api.get(`/main/wallet/balance`);
  },
  getWalletTransactions(
    payload: GetAllWalletTransactionsPayloadDTO,
    params: Pageable = { page: 0, size: 999, sort: "modified,desc" }
  ): Promise<AxiosResponse<Partial<GetWalletTransactionsResponseDTO>>> {
    return api.post(`/main/wallet`, payload, { params });
  },
};
