import ContentSection from "@/components/AdminDashboard/Features/Settings/components/ContentSection";
import { NotificationsForm } from "@/components/AdminDashboard/Features/Settings/Notifications/NotificationsForm";

const page = () => {
  return (
    <ContentSection
      title="Notifications"
      desc="Configure how you receive notifications."
    >
      <NotificationsForm />
    </ContentSection>
  );
};

export default page;
