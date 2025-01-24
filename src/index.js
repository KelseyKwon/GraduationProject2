// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // 여기에서 전체 앱을 한 번만 BrowserRouter로 감쌉니다.
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
