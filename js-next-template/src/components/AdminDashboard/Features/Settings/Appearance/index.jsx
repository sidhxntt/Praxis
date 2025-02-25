import ContentSection from "../components/ContentSection";
import { AppearanceForm } from "./AppearanceForm";

export default function SettingsAppearance() {
  return (
    <ContentSection
      title="Appearance"
      desc="Customize the appearance of the app. Automatically switch between day
          and night themes."
    >
      <AppearanceForm />
    </ContentSection>
  );
}
