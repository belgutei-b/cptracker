import ExtensionBody from "@/components/extension/ExtensionBody";

/**
 * Extension page for authenticated users
 * This page is added to keep layout consistency across authenticated pages
 */
export default function Page() {
  return <ExtensionBody isAuth={true} />;
}
