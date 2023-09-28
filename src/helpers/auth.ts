import axios from "axios";

export const getToken = async () => {
  const response = await axios.post(
    "https://digieye.viotgroup.com/phpapi/common/home/openAuthorization",
    {
      app_id: import.meta.env.VITE_APP_ID,
      secret_key: import.meta.env.VITE_SECRET_KEY,
    }
  );
  const { data } = response;
  if (data) {
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("expiration_time", data.data.expiration_time);
  }
};
