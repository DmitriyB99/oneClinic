import type { FC, ReactElement } from "react";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/router";

import { CallContextProvider } from "@/shared/contexts/callContext";
import { useGetCity } from "@/shared/hooks/useGetCity";
import { authApi } from "shared/api/auth";
import {
  getAuthToken,
  removeAuthToken,
  subscribeToAuthToken,
  setAuthToken as persistAuthToken,
  removeRefreshToken,
  setDefaultLocale,
} from "shared/utils";

export interface ContactsList {
  name: string;
  phoneNumber: string;
}

interface UserProfile {
  role: "patient" | "doctor" | "clinic" | "superadmin";
  role_id: string;
  user_id: string;
}

interface UserContextType {
  authToken: string | null;
  contactsList: ContactsList[];
  getContactListNative: () => void;
  getLocationNative: () => void;
  isLoading: boolean | null;
  loadUser: () => Promise<void>;
  logout: () => void;
  locale: string;
  setLocale: (loc: string) => void;
  setGeo: (geo: [number, number]) => void;
  setAuthToken: (token: string | null) => void;
  setUser: (user: UserProfile | null) => void;
  setUserCity: (cityName: string) => void;
  user: UserProfile | null;
  userCity: string;
  userCoordinates: [number, number];
}

const _authToken = getAuthToken();

const getLocationNative = () => {
  if (window) {
    window.AndroidInterface?.requestGeo?.();
  }
  if (window?.webkit) {
    window.webkit?.messageHandlers?.jsMessageHandler?.postMessage?.(
      "requestGeo"
    );
  }
};

const getContactListNative = () => {
  if (window) {
    window.AndroidInterface?.requestContacts?.();
  }
  if (window?.webkit) {
    window.webkit?.messageHandlers?.jsMessageHandler?.postMessage?.(
      "requestContacts"
    );
  }
};

export const UserContext = createContext<UserContextType>({
  authToken: _authToken ?? null,
  user: null,
  isLoading: null,
  contactsList: [],
  userCoordinates: [43.238293, 76.945465],
  userCity: "Алматы",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUserCity: () => {},
  locale: "ru",
  loadUser: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setAuthToken: () => Promise.resolve(),
  setUser: (user: UserProfile | null) => user,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setLocale: () => {},
  setGeo: () => {},
  getLocationNative: getLocationNative,
  getContactListNative: getContactListNative,
});

export const UserContextProvider: FC<{ children: ReactElement }> = (props) => {
  const [authToken, _setAuthToken] = useState<string | null>(
    _authToken ?? null
  );
  const [userCoordinates, setUserCoordinates] = useState<[number, number]>([
    43.238293, 76.945465,
  ]);
  const [contactsList, setContactsList] = useState<ContactsList[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  const router = useRouter();
  const [locale, setLocale] = useState(router.locale ?? "ru");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserCoordinates([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      });
    }
  }, []);
  const city = useGetCity(userCoordinates?.[0], userCoordinates?.[1]);

  const [userCity, setUserCity] = useState<string>(city.city ?? "Алматы");

  useEffect(() => {
    setUserCity(city?.city ?? "Алматы");
  }, [city?.city]);

  useEffect(() => {
    if (user) {
      getLocationNative();
    }
  }, [user]);

  const goBackMobile = useCallback(() => {
    if (router.pathname !== "/main") {
      router.back();
      return true;
    }
    return false;
  }, [router]);

  const goForwardMobile = useCallback(() => {
    router.forward();
  }, [router]);

  const setGeo = useCallback((geo: [number, number]) => {
    setUserCoordinates(geo);
  }, []);

  const setContacts = useCallback((contacts: ContactsList[]) => {
    alert(JSON.stringify(contacts));
    setTimeout(() => {
      alert(contacts);
    }, 5000);
    setContactsList(contacts);
  }, []);

  const handleQRResult = useCallback((qrCode: string) => {
    alert(qrCode);
  }, []);

  const requestPin = useCallback((message: string) => message, []);

  const receiveDevicePushToken = useCallback(
    (deviceId: string, tokenType: "IOS" | "ANDROID") => {
      authApi.setDeviceId(deviceId, tokenType).then(() => {
        localStorage.setItem("oneClinic_deviceID", tokenType);
      });
    },
    []
  );

  useEffect(() => {
    if (window) {
      window.oneClinic = {
        goBack: goBackMobile,
        goForward: goForwardMobile,
        requestPin,
        handleQRResult,
        setGeo,
        receiveDevicePushToken,
        setContacts,
      };
    }
  }, [
    setGeo,
    goBackMobile,
    goForwardMobile,
    handleQRResult,
    requestPin,
    receiveDevicePushToken,
    setContacts,
  ]);

  const setAuthToken = (token: string | null) => {
    _setAuthToken(token);
    console.log('token')
    console.log(token)

    if (token) {
      persistAuthToken(token);
    } else {
      removeAuthToken();
    }
  };

  const loadUser = useCallback(async () => {
    setIsLoading(true);

    return authApi
      .getProfile()
      .then(({ data }) => {
        setUser({
          user_id: data.userId,
          role: data.role,
          role_id: data.profileId,
        });
        if (window) {
          window.AndroidInterface?.authWithPin?.();
          window.AndroidInterface?.requestDevicePushToken?.();
        }
        if (window?.webkit) {
          window.webkit?.messageHandlers?.jsMessageHandler?.postMessage?.(
            "authWithPin"
          );
          window.webkit?.messageHandlers?.jsMessageHandler?.postMessage?.(
            "requestDevicePushToken"
          );
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const logout = useCallback(() => {
    const deviceId = localStorage.getItem("oneClinic_deviceID");
    if (deviceId) {
      authApi.removeDeviceId(deviceId as "IOS" | "ANDROID").then(() => {
        removeRefreshToken();
        removeAuthToken();
        setAuthToken(null);
        setUser(null);
      });
    } else {
      removeRefreshToken();
      removeAuthToken();
      setAuthToken(null);
      setUser(null);
    }
  }, []);

  const onSetLocale = useCallback((loc: string) => {
    setDefaultLocale(loc);
    setLocale(loc);
  }, []);

  const userContext = useMemo<UserContextType>(
    () => ({
      isLoading,
      loadUser,
      userCity,
      contactsList,
      user,
      setUser,
      setLocale: onSetLocale,
      locale,
      logout,
      userCoordinates,
      authToken,
      setAuthToken,
      setUserCity,
      getLocationNative,
      getContactListNative,
      setGeo,
    }),
    [
      isLoading,
      loadUser,
      userCity,
      contactsList,
      user,
      onSetLocale,
      locale,
      logout,
      userCoordinates,
      authToken,
      setGeo,
    ]
  );

  useEffect(() => {
    if (authToken) {
      loadUser();
    }
  }, [authToken, loadUser]);

  // watch localstorage token
  useEffect(() => {
    subscribeToAuthToken((_token, newToken) => {
      setAuthToken(newToken ?? null);
    });
  }, []);

  return (
    <UserContext.Provider value={userContext}>
      {user && user.role !== "superadmin" ? (
        <CallContextProvider>{props.children}</CallContextProvider>
      ) : (
        props.children
      )}
    </UserContext.Provider>
  );
};
