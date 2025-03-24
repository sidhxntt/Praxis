import { AppearanceForm } from "@/components/AdminDashboard/Features/Settings/Appearance/AppearanceForm"
import ContentSection from "@/components/AdminDashboard/Features/Settings/components/ContentSection"

const page = () => {
  return (
    <ContentSection
    title="Appearance"
    desc="Customize the appearance of the app. Automatically switch between day
        and night themes."
  >
    <AppearanceForm />
  </ContentSection>
  )
}

export default page