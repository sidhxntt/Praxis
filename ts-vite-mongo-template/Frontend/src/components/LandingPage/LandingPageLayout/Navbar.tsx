import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollLink from "./ScrollLink";

interface NavLink {
  id: string;
  label: string;
  href: string;
}

interface NavbarProps {
  logo: React.ReactNode;
  links?: NavLink[];
  optionalElements?: (React.ReactNode | string)[];
}

const Navbar: React.FC<NavbarProps> = ({ logo, links = [], optionalElements }) => {
  return (
    <nav className="sticky h-16 inset-x-0 top-0 z-30 w-full border-b backdrop-blur-3xl transition-all">
      <MaxWidthWrapper>
        <div className="flex h-16 items-center justify-between">
          {/* Left Side - Logo & Links */}
          <div className="flex items-center gap-14">
            <Link to="/" className="flex z-40 font-bold text-lg">
              <span>{logo}</span>
            </Link>

            {links.length > 0 && (
              <div className="hidden md:flex items-center gap-8 lg:gap-14">
                {links.map(({ id, label, href }) => (
                  <ScrollLink
                    key={id}
                    to={href}
                    id={id}
                    className="font-semibold hover:underline hover:underline-offset-1"
                  >
                    {label}
                  </ScrollLink>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <Menu className="h-6 w-6 cursor-pointer" />
          </div>

          {/* Right Side - Custom Elements */}
          <div className="hidden md:flex items-center space-x-3">
            {optionalElements?.map((element, index) =>
              typeof element === "string" ? (
                <span key={index}>{element}</span>
              ) : (
                <React.Fragment key={index}>{element}</React.Fragment>
              )
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
