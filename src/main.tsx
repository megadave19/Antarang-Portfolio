import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Canvas } from '@react-three/fiber';
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Canvas>
      <App />
    </Canvas>
  </StrictMode>
);
