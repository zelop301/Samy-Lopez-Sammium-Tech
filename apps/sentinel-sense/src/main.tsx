import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Sentinel Sense could not find the #root element.");
}

// The visual engine owns several canvas loops. React StrictMode intentionally
// double-mounts effects in development, which makes those loops look much
// heavier than production. Render once so local development matches production.
createRoot(root).render(<App />);
