import type { AxiosResponse } from "axios";

import type { MyAddressModel } from "@/entities/myProfile";

import { api } from "./apiClient";

export const patientAddressesApi = {
  getAddresses(): Promise<AxiosResponse<MyAddressModel[]>> {
    return api.get("address", {
      headers: {
        "Accept-Language": "ru",
      },
    });
  },
  getAddress(addressId: string): Promise<AxiosResponse<MyAddressModel>> {
    return api.get(`address/${addressId}`, {
      headers: {
        "Accept-Language": "ru",
      },
    });
  },
  addAddress(
    data, // NEWTODO: типизировать
    userId: string
  ): Promise<AxiosResponse<unknown>> {
    return api.post("address", data, {
      params: {
        userId,
      },
    });
  },
  updateAddress(id: string, data): Promise<AxiosResponse<MyAddressModel>> {
    return api.put(`address/${id}`, data);
  },
  setDefaultAddress(id: string): Promise<AxiosResponse<unknown>> {
    return api.put(`address/${id}/default`);
  },
  deleteAddress(addressId: string): Promise<AxiosResponse<unknown>> {
    return api.delete(`address/${addressId}`);
  },
};
