import type { AxiosResponse } from "axios";
import dayjs from "dayjs";

import { api } from "@/shared/api/instance";
import { dateTimeWithOffset } from "@/shared/config";
import type { PageableResponse } from "@/shared/types";
import type { ServiceHistoryItem } from "@/widgets/medicalCard";

export const servicesHistoryApi = {
  getMyServiceHistory(
    page?: number,
    size?: number,
    toDate?: string,
    fromDate?: string
  ): Promise<AxiosResponse<PageableResponse<ServiceHistoryItem>>> {
    const firstDate = dayjs("2022-01-01", "YYYY-MM-DD");
    const secondDate = firstDate.add(3, "year");
    return api.post(
      "/main/service-history/slots/me",
      {
        fromDate: fromDate ?? firstDate.format(dateTimeWithOffset),
        toDate: toDate ?? secondDate.format(dateTimeWithOffset),
      },
      {
        params: {
          page: page ?? 0,
          size: size ?? 100,
        },
      }
    );
  },
  getUserServiceHistory(
    userId: string,
    page?: number,
    size?: number
  ): Promise<AxiosResponse<PageableResponse<ServiceHistoryItem>>> {
    return api.post(
      "/main/service-history/slots",
      {
        reservedUserId: userId,
      },
      {
        params: {
          page: page ?? 0,
          size: size ?? 100,
        },
      }
    );
  },
};
