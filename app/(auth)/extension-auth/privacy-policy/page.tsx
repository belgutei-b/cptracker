import ExtensionPrivacyBody from "@/components/extension/ExtensionPrivacyBody";

/**
 * Extension Privacy page for authenticated users
 * This page is added to keep layout consistency across authenticated pages
 */
export default function Page() {
  return <ExtensionPrivacyBody isAuth={true} />;
}
