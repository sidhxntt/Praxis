import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./components/Layout/ThemeProvider";
import ScreenRestriction from "./components/Layout/ScreenRestriction";
// import { ClerkProvider } from "@clerk/clerk-react";

// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// if (!PUBLISHABLE_KEY) {
//   throw new Error("Missing Publishable Key");
// }

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ScreenRestriction>
    <ThemeProvider>
      {/* <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/"> */}
      <App />
      {/* </ClerkProvider> */}
    </ThemeProvider>
    </ScreenRestriction>
  </StrictMode>
);
