import axios, { AxiosInstance } from "axios";
import { getToken } from "./auth";
import { createSign } from "./createSign";

export const instanceBase: AxiosInstance = axios.create({
  baseURL: "https://digieye.viotgroup.com",
});

instanceBase.interceptors.request.use(
  async function (config) {
    config.headers.Sign = createSign(
      config.data,
      String(localStorage.getItem("token"))
    );
    config.headers.Token = String(localStorage.getItem("token"));

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instanceBase.interceptors.response.use(
  function (response) {
    if (response.data.code === 1023) {
      getToken();
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
