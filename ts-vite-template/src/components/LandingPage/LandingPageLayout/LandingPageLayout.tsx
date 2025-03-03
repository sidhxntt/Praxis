import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ModeToggle } from "@/components/AdminDashboard/AdminDashboardComponents/ModeToggle";
import { navlinks } from "@/SampleData/LandingPage/navbar-data";
import { footerLinks } from "@/SampleData/LandingPage/footer-data";

const LandingPageLayout = () => {
  return (
    <>
      <Navbar
        logo="MyApp"
        links={navlinks}
        optionalElements={[<ModeToggle/>]}
      />
      <Outlet />
      <Footer
        logo="YourApp"
        description="Lorem ipsum dolor sit amet consectet"
        links={footerLinks}
        // additionalContent={<p className="text-sm text-gray-600 dark:text-white">Follow us on social media</p>}
      />
    </>
  );
};

export default LandingPageLayout;
