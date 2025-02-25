import MaxWidthWrapper from "./MaxWidthWrapper";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollLink from "./ScrollLink";
import { ModeToggle } from "@/components/AdminDashboard/AdminDashboardComponents/ModeToggle";

function Navbar() {

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
            </div>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <Menu className="h-6 w-6 cursor-pointer" />
          </div>

          {/* Right Side - Theme Toggle & Auth */}
          <div className="hidden md:flex items-center space-x-3">
            <ModeToggle />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default Navbar;
