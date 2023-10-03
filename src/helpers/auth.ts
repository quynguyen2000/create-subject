import { instanceBase } from "./axios";

export const getToken = async () => {
  const response = await instanceBase.post(
    "/phpapi/common/home/openAuthorization",
    {
      app_id: import.meta.env.VITE_APP_ID,
      secret_key: import.meta.env.VITE_SECRET_KEY,
    }
  );
  const { data } = response;
  if (data) {
    localStorage.setItem("token", data.data.token);
    const currentTime = new Date().getTime();

    const expirationTime = data.data.expiration_time;

    localStorage.setItem(
      "expiration_time",
      String(currentTime + expirationTime)
    );
  }
};
