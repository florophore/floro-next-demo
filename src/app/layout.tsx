import "./globals.css";
import { cookies } from "next/headers";

import { LocalizedPhrases } from "./floro_infra/floro_modules/text-generator";
import FloroTextStore, { getFilteredText } from "@/backend/FloroTextStore";
import Body from "./Body";
import { ThemeSet } from "./floro_infra/floro_modules/themes-generator";
import FloroMount from "./floro_infra/contexts/FloroMount";

export default async function RootLayout(props: { children: React.ReactNode }) {
  const localeCode = (cookies().get("NEXT_LOCALE")?.value ||
    "EN") as keyof LocalizedPhrases["locales"] & string;
  const themePreference = cookies().get("NEXT_THEME_PREFERENCE")?.value as
    | undefined
    | (keyof ThemeSet & string);
  const localeLoads = FloroTextStore.getInstance().getLocaleLoads();
  const text = FloroTextStore.getInstance().getText();
  const cdnHost = ""; // IN PROD THIS SHOULD BE THE URL TO YOUR ASSET CDN/SERVER

  return (
    <FloroMount
      initLocaleCode={localeCode}
      cdnHost={cdnHost}
      localeLoads={localeLoads}
      initThemePreference={themePreference}
      text={getFilteredText(text, localeCode)}
    >
      <Body>{props.children}</Body>
    </FloroMount>
  );
}
