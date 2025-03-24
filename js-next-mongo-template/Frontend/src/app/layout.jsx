import { Mulish } from "next/font/google";
import "./globals.css";
import { cn, constructMetadata } from "@/lib/utils";
import ScreenRestriction from "@/components/CommonLayouts/ScreenRestriction";
import { ThemeProvider } from "@/Context/ThemeContext";

const mulish = Mulish({ subsets: ["latin"] });

// export const metadata = constructMetadata();

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light !scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="22623642-4859-4b11-bc9c-5e1be448cb2c"
        ></script>
        <title>Starter Template</title>
      </head>
      <body
        className={cn("min-h-screen font-sans antialiased", mulish.className)}
      >
        <ScreenRestriction>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ScreenRestriction>
      </body>
    </html>
  );
}
