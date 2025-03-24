import React from "react";
import { Laptop } from "lucide-react";

export default function ScreenRestriction({ children }) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024); // 1024px is typical laptop width
    };

    // Check initially
    checkScreenSize();

    // Add resize listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
        <div className="text-center max-w-md">
          <Laptop className="w-16 h-16 mx-auto mb-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please Use a Laptop or Desktop
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            This application is designed for larger screens. Please access it
            from a laptop or desktop computer for the best experience.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
