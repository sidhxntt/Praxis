import MaxWidthWrapper from "./MaxWidthWrapper";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "../ui/mode-toggle";
import ScrollLink from './ScrollLink';
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
// import DisplayPic from "../Clerk/Displaypic";

function Navbar() {
  // const jwtTemplate = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY // Renamed for clarity
  // const { isSignedIn, getToken } = useAuth();
  // const [_, setToken] = useState<string | null>(null);

  // useEffect(() => {
  //   let mounted = true;

  //   const fetchToken = async () => {
  //     if (typeof window === "undefined") return;

  //     try {
  //       const newToken = await getToken({ template: jwtTemplate });
  //       if (newToken && mounted) {
  //         setToken(newToken);
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch token:", error);
  //       if (mounted) setToken(null);
  //     }
  //   };

  //   fetchToken();
  //   return () => { mounted = false; };
  // }, [getToken, jwtTemplate]);

  return (
    <nav className="sticky h-16 inset-x-0 top-0 z-30 w-full border-b backdrop-blur-3xl transition-all">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          {/* Left Side - Logo & Links */}
          <div className="flex items-center gap-14">
            <Link to="/" className="flex z-40 font-bold text-lg">
              <span>Your App</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 lg:gap-14">
              <ScrollLink 
                to="/" 
                id="pricing" 
                className="font-semibold hover:underline hover:underline-offset-1"
              >
                Pricing
              </ScrollLink>
              <ScrollLink 
                to="/" 
                id="demo" 
                className="font-semibold hover:underline hover:underline-offset-1"
              >
                Demo
              </ScrollLink>
              <ScrollLink 
                to="/" 
                id="faq" 
                className="font-semibold hover:underline hover:underline-offset-1"
              >
                FAQ
              </ScrollLink>
              <ScrollLink 
                to="/" 
                id="about" 
                className="font-semibold hover:underline hover:underline-offset-1"
              >
                About
              </ScrollLink>
              {/* Show "Dashboard" only when signed in */}
              {/* {isSignedIn && ( */}
                <Link to="/dashboard" className="font-semibold hover:underline hover:underline-offset-1">
                  Dashboard
                </Link>
               {/* )}  */}
            </div>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <Menu className="h-6 w-6 cursor-pointer" />
          </div>

          {/* Right Side - Theme Toggle & Auth */}
          <div className="hidden md:flex items-center space-x-3">
            <ModeToggle />
            {/* <DisplayPic /> */}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default Navbar;