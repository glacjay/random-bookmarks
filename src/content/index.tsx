import React from "react";
import { createRoot } from "react-dom/client";

import App from "./components/app";

import "./index.scss";

import { initDoubanUrlCleaner } from "./douban-url-cleaner";

// Initialize Douban URL cleaner
initDoubanUrlCleaner();

// const container = document.createElement("popup");
// document.body.appendChild(container);

// const root = createRoot(container);
// root.render(<App />);

console.log("Content Script 👋");
