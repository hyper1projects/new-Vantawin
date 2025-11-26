import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SdkProvider } from "./components/SdkProvider";

createRoot(document.getElementById("root")!).render(
  <SdkProvider>
    <App />
  </SdkProvider>
);