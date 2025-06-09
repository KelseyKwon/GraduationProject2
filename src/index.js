// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    {" "}
    {/* ← 여기서만 한 번 */}
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
