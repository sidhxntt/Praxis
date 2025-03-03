import Footer from "@/components/LandingPage/LandingPageLayout/Footer";
import LandingPage from "@/components/LandingPage/LandingPageLayout/LandingPage";
import Navbar from "@/components/LandingPage/LandingPageLayout/Navbar";
import { ModeToggle } from "@/components/AdminDashboard/AdminDashboardComponents/ModeToggle";
import { navlinks } from "@/SampleData/LandingPage/navbar-data";
import { footerLinks } from "@/SampleData/LandingPage/footer-data";

const Page = () => {
  return (
    <>
      <Navbar
        logo="MyApp"
        links={navlinks}
        optionalElements={[<ModeToggle/>]}
      />
      <LandingPage />
      <Footer
        logo="YourApp"
        description="Lorem ipsum dolor sit amet consectet"
        links={footerLinks}
        // additionalContent={<p className="text-sm text-gray-600 dark:text-white">Follow us on social media</p>}
      />
    </>
  );
};

export default Page;
