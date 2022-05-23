import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";

const container = document.getElementById("react-page");
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

root.render(<App />);
