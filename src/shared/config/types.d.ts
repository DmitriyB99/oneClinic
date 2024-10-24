import type { ContactsList } from "@/shared/contexts/userContext";

declare global {
  interface Window {
    AndroidInterface?: {
      acceptCall?: () => void;
      declineCall?: () => void;
      authWithPin?: () => void;
      installPin?: () => void;
      openQR?: () => void;
      requestContacts?: () => void;
      requestDevicePushToken?: () => void;
      requestGeo?: () => void;
      shareData?: (msg?: string) => void;
      sendRefreshToken?: (refreshToken: string) => void;
    };
    oneClinic: {
      goBack: () => void;
      goForward: () => void;
      handleQRResult: (val: string) => void;
      receiveDevicePushToken?: (
        deviceId: string,
        tokenType: "IOS" | "ANDROID"
      ) => void;
      requestPin?: (message: string) => string;
      setContacts?: (contacts: ContactsList[]) => void;
      setGeo?: (geo: [number, number]) => void;
    };
    postMessageListener: (msg: string) => void;
    webkit?: {
      messageHandlers?: {
        jsMessageHandler?: {
          postMessage?: (msg?: string) => void;
        };
      };
    };
    handleMessageFromMobile: (message: string) => void;
  }
}

export default global;
