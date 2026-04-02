import React from "react";
import ReactDOM from "react-dom/client";
import "@/styles/index.css";
import "@/app/fonts";
import { AppProviders } from "@/app/providers";
import { AppRouter } from "@/app/router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </React.StrictMode>,
);
