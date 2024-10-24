import axios from "axios";

import setupInterceptors from "../axiosInterceptors";

export const baseURL =
  "https://oneclinic-doctors-api-test.appleseed.kz/api/v1/";

const patientApi = axios.create({
  baseURL,
});

setupInterceptors(patientApi);

export const api = patientApi;
