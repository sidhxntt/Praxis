import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./Context/ThemeContext";
import ScreenRestriction from "./components/CommonLayouts/ScreenRestriction";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ScreenRestriction>
        <ThemeProvider>
          <App />
        </ThemeProvider>
    </ScreenRestriction>
  </StrictMode>
);
