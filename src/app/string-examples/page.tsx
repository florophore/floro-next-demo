import { LocalizedPhrases } from "../floro_infra/floro_modules/text-generator";
import StringExamples from "./StringExamples";
import { cookies } from "next/headers";
import { getText } from "@/backend/FloroTextStore";
import { Metadata } from "next";

export async function generateMetadata(
): Promise<Metadata> {
  const locale = (cookies().get("NEXT_LOCALE")?.value ||
    "EN") as keyof LocalizedPhrases["locales"] & string;
  const title = getText(locale, "meta_tags.string_examples")
  return {
    title
  }
}

export default function Page() {
  return (
    <StringExamples/>
  )
}