import axios from "axios";

import setupInterceptors from "../axiosInterceptors";

export const baseURL =
  "https://oneclinic-patients-content-api-test.appleseed.kz/api/v1/";

const patientContentApi = axios.create({
  baseURL,
});

setupInterceptors(patientContentApi);

export const api = patientContentApi;
