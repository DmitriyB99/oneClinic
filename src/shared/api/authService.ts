import axios from "axios";
import setupInterceptors from "./axiosInterceptors";

export const baseURL = "https://oneclinic-auth-api-test.appleseed.kz/api/v1/";

const authApi = axios.create({
  baseURL,
});

setupInterceptors(authApi); 

export const api = authApi;
