import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import ScreenRestriction from "./components/CommonLayouts/ScreenRestriction";
import { ThemeProvider } from "./Context/ThemeContext";

const rootElement = document.getElementById("root"); 
const root = createRoot(rootElement); 

root.render(
  <StrictMode>
    <ScreenRestriction>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </ScreenRestriction>
  </StrictMode>
);