import { authApi } from "./auth";
import { getAuthToken, setAuthToken, setRefreshToken } from "shared/utils/auth";

// for multiple requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const setupInterceptors = (instance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;
        return new Promise((resolve, reject) => {
          authApi
            .refreshAuthToken()
            .then(({ data }) => {
              setAuthToken(data.access_token);
              if (data.refresh_token) {
                setRefreshToken(data.refresh_token);
              }

              instance.defaults.headers.common["Authorization"] =
                "Bearer " + data.access_token;
              originalRequest.headers["Authorization"] =
                "Bearer " + data.access_token;

              processQueue(null, data.access_token);
              resolve(instance(originalRequest));
            })
            .catch((err) => {
              processQueue(err, null);
              reject(err);
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }

      return Promise.reject(error);
    }
  );

  instance.interceptors.request.use((reqConfig) => {
    const authToken = getAuthToken();

    if (authToken) {
      reqConfig.headers["Authorization"] = `Bearer ${authToken}`;
    }

    return reqConfig;
  });
};

export default setupInterceptors;
