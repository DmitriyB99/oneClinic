import axios from "axios";

import { getAuthToken, setAuthToken, setRefreshToken } from "shared/utils/auth";

import { authApi } from "./auth";

export const baseURL = "https://oneclinic-api-test.appleseed.kz/api/v1/";

const axiosInstance = axios.create({
  baseURL,
});

// for multiple requests
let isRefreshing = false;
/* eslint-disable  @typescript-eslint/no-explicit-any */
let failedQueue: any[] = [];

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

axiosInstance.interceptors.response.use(
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
            return axios(originalRequest);
          })
          .catch((err) => err);
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

            axios.defaults.headers.common["Authorization"] =
              "Bearer " + data.access_token;
            originalRequest.headers["Authorization"] =
              "Bearer " + data.access_token;

            processQueue(null, data.access_token);
            resolve(axios(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
          })
          .then(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use((reqConfig) => {
  const authToken = getAuthToken();

  if (authToken) {
    reqConfig.headers["Authorization"] = `Bearer ${authToken}`;
  }

  return reqConfig;
});

export const api = axiosInstance;
