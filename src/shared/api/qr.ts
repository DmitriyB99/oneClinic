import type { AxiosResponse } from "axios";

import { api } from "./instance";

export const qrApi = {
  generateQrForConsultation(
    bookingConsultationSlotId: string
  ): Promise<AxiosResponse<Partial<{ data: string }>>> {
    return api.get(
      `main/quick-response/generate/consultation/approve?bookingConsultationSlotId=${bookingConsultationSlotId}`
    );
  },
  approveConsultationQr(
    token: string,
    hash: string
  ): Promise<AxiosResponse<Partial<unknown>>> {
    return api.get(
      `/main/quick-response/consultation/approve?data=${token}&hash=${hash}`
    );
  },
};
