import MaxWidthWrapper from "./MaxWidthWrapper";
import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/AdminDashboard/AdminDashboardComponents/ModeToggle";
import Link from "next/link";

function Navbar() {

  return (
    <nav className="sticky h-16 inset-x-0 top-0 z-30 w-full border-b backdrop-blur-3xl transition-all">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          {/* Left Side - Logo & Links */}
          <div className="flex items-center gap-14">
            <Link href="/" className="flex z-40 font-bold text-lg">
              <span>Your App</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 lg:gap-14">
              <Link
                href="#pricing"
                className="font-semibold hover:underline hover:underline-offset-1"
              >
                Pricing
              </Link>
              <Link
                href="#demo"
                className="font-semibold hover:underline hover:underline-offset-1"
              >
                Demo
              </Link>
              <Link
                href="#faq"
                className="font-semibold hover:underline hover:underline-offset-1"
              >
                FAQ
              </Link>
              <Link
                href="#about"
                className="font-semibold hover:underline hover:underline-offset-1"
              >
                About
              </Link>
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
