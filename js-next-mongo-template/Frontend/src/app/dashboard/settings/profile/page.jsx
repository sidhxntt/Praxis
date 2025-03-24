import ContentSection from "@/components/AdminDashboard/Features/Settings/components/ContentSection";
import ProfileForm from "@/components/AdminDashboard/Features/Settings/Profile/ProfileForm";

const page = () => {
  return (
    <ContentSection
      title="Profile"
      desc="This is how others will see you on the site."
    >
      <ProfileForm />
    </ContentSection>
  );
};

export default page;
