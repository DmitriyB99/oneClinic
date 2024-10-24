import axios from "axios";
import setupInterceptors from "./axiosInterceptors";

export const baseURL = "https://oneclinic-medical-card-api-test.appleseed.kz/api/v1/";

const dictionaryApi = axios.create({
  baseURL,
});

setupInterceptors(dictionaryApi);

export const api = dictionaryApi;
