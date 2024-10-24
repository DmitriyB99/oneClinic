const AUTH_TOKEN_KEY = "saunet_auth_token";
const REFRESH_TOKEN_KEY = "saunet_refresh_token";

export const getAuthToken = (): string | undefined => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(AUTH_TOKEN_KEY) ?? undefined;
  }
};

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

export const getRefreshToken = (): string | undefined => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(REFRESH_TOKEN_KEY) ?? undefined;
  }
};

export const setRefreshToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
};

export const removeRefreshToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const subscribeToAuthToken = (
  cb: (
    tokenChanged: boolean,
    newVal?: string | null,
    oldVal?: string | null
  ) => void
) => {
  if (window) {
    return window.addEventListener("storage", (ev) => {
      const isAuthTokenChanged = ev.key === AUTH_TOKEN_KEY;

      if (isAuthTokenChanged) {
        cb(isAuthTokenChanged, ev.newValue, ev.oldValue);
      }
    });
  }
};
