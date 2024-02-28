import "./globals.css";
import FloroMount from "./floro_infra/contexts/FloroMount";
import { cookies } from "next/headers";

import { LocalizedPhrases } from "./floro_infra/floro_modules/text-generator";
import FloroTextStore from "@/backend/FloroTextStore";
import Body from "./Body";
import { ThemeSet } from "./floro_infra/floro_modules/themes-generator";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (cookies().get("NEXT_LOCALE")?.value ||
    "EN") as keyof LocalizedPhrases["locales"] & string;
  const themePreference = cookies().get(
    "NEXT_THEME_PREFERENCE"
  )?.value as undefined|keyof ThemeSet & string;
  const text = FloroTextStore.getInstance().getText();
  const localeLoads = FloroTextStore.getInstance().getLocaleLoads();
  const cdnHost = ""; // IN PROD THIS SHOULD BE THE URL TO YOUR ASSET CDN/SERVER

  return (
    <FloroMount
      text={text}
      initLocaleCode={locale}
      cdnHost={cdnHost}
      localeLoads={localeLoads}
      initThemePreference={themePreference}
    >
      <Body>{children}</Body>
    </FloroMount>
  );
}