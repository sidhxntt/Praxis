import ContentSection from "@/components/AdminDashboard/Features/Settings/components/ContentSection";
import { DisplayForm } from "@/components/AdminDashboard/Features/Settings/Display/DisplayForm";

const page = () => {
  return (
    <ContentSection
      title="Display"
      desc="Turn items on or off to control what's displayed in the app."
    >
      <DisplayForm />
    </ContentSection>
  );
};

export default page;
