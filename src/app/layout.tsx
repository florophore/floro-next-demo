import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TestProvider } from "./contexts/TestContext";
import { headers } from "next/headers";
import FloroMount from "./floro_infra/contexts/FloroMount";
import { cookies } from "next/headers";

import { LocalizedPhrases } from "./floro_infra/floro_modules/text-generator";
import FloroTextStore from "@/backend/FloroTextStore";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Floro Demo App",
  description: "How floro works with next",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const referer = headersList.get("referer");
  const locale = (cookies().get("NEXT_LOCALE")?.value ||
    "EN") as keyof LocalizedPhrases["locales"] & string;
  const text = FloroTextStore.getInstance().getText();
  const localeLoads = FloroTextStore.getInstance().getLocaleLoads();
  const cdnHost = "";

  return (
    <FloroMount
      text={text}
      initLocaleCode={locale}
      cdnHost={cdnHost}
      localeLoads={localeLoads}
    >
      <TestProvider initReferer={referer ?? null}>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </TestProvider>
    </FloroMount>
  );
}
