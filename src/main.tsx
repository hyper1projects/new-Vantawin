import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SDKProvider } from "@telegram-apps/sdk-react";

createRoot(document.getElementById("root")!).render(
  <SDKProvider acceptCustomStyles debug>
    <App />
  </SDKProvider>
);