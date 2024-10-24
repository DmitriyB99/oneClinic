import type { AxiosResponse } from "axios";

import { api } from "./apiClient";

export interface Notifications {
  patient_id?: string;
  taking_medications: boolean;
  new_messages: boolean;
  booking_remind: boolean;
  promotion: boolean;
}

export interface ConfidentialitySettings {
  patient_id: string;
  medical_card: string;
  service_history: string;
  send_messages: string;
}

export const patientSettingsApi = {
  getNotificationsSettings(): Promise<AxiosResponse<Notifications>> {
    return api.get("notification/settings");
  },
  updateNotificationsSettings(
    data: Notifications
  ): Promise<AxiosResponse<Notifications>> {
    return api.put("notification/settings", data);
  },
  getConfidentialitySettings(): Promise<
    AxiosResponse<ConfidentialitySettings>
  > {
    return api.get("privacy/settings");
  },
  updateConfidentialitySettings(
    data: Omit<ConfidentialitySettings, "patient_id">
  ): Promise<AxiosResponse<ConfidentialitySettings>> {
    return api.put("privacy/settings", data);
  },
  getMyLanguage(): Promise<AxiosResponse> {
    return api.get("profile/me/language");
  },
  updateMyLanguage(language_code: string): Promise<AxiosResponse<unknown>> {
    return api.put("profile/me/language", { language_code });
  },
};
