import React from "react";
import ReactDOM from "react-dom/client";
import { EnergyProvider } from "./context/energyContext";
import App from "./App";
import "./assets/styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <EnergyProvider>
      <App />
    </EnergyProvider>
  </React.StrictMode>
);