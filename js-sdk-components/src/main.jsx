import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import "@arcgis/core/assets/esri/themes/dark/main.css";

import { defineCustomElements as defineMapElements } from "@arcgis/map-components/dist/loader";

// Register custom elements
defineMapElements(window, {
  resourcesUrl: "https://js.arcgis.com/map-components/4.29/assets",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
