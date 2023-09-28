/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import CreateSubject from "./Pages/CreateSubject/CreateSubject";
import { expiration } from "./helpers/ expirationTime";
import { getToken } from "./helpers/auth";
import "./App.css";

const App: React.FC = () => {
  useEffect(() => {
    const isExpire = expiration(
      JSON.parse(String(localStorage.getItem("expiration_time")))
    );
    if (isExpire === true) {
      getToken();
    }
  }, [String(localStorage.getItem("expiration_time"))]);

  return (
    <div className="subject-container">
      <CreateSubject />
    </div>
  );
};
export default App;
