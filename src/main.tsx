import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { validateConfig } from "./utils/config";
import "./styles/global.css";

validateConfig();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
