/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import CreateSubject from "./Pages/CreateSubject/CreateSubject";
import { getToken } from "./helpers/auth";
import "./App.css";

const App: React.FC = () => {
  useEffect(() => {
    getToken();
  }, []);

  return (
    <div className="subject-container">
      <CreateSubject />
    </div>
  );
};
export default App;
