import { AccountForm } from "@/components/AdminDashboard/Features/Settings/Account/AccountForm"
import ContentSection from "@/components/AdminDashboard/Features/Settings/components/ContentSection"

const page = () => {
  return (
    <ContentSection
    title="Account"
    desc="Update your account settings. Set your preferred language and
        timezone."
  >
    <AccountForm />
  </ContentSection>
  )
}

export default page