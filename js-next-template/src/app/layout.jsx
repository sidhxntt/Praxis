import { Mulish } from "next/font/google";
import "./globals.css";
import { cn, constructMetadata } from "@/lib/utils";
import Navbar from "../components/Layout/Navbar";
import { Toaster } from "../components/ui/toaster";
import { ThemeProvider } from "../components/Layout/ThemeProvider";
import Footer from "../components/Layout/Footer";
import ScreenRestriction from "../components/Layout/ScreenRestriction";
// import { ClerkProvider } from "@clerk/nextjs";

const mulish = Mulish({ subsets: ["latin"] });

export const metadata = constructMetadata();

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light !scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="22623642-4859-4b11-bc9c-5e1be448cb2c"
        ></script>
      </head>
      <body
        className={cn("min-h-screen font-sans antialiased", mulish.className)}
      >
        <ScreenRestriction>
          {/* <ClerkProvider> */}
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              <Navbar />
              {children}
              <Footer />
            </ThemeProvider>
          {/* </ClerkProvider> */}
        </ScreenRestriction>
      </body>
    </html>
  );
}
