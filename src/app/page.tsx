import { Metadata } from 'next';
import { LocalizedPhrases } from './floro_infra/floro_modules/text-generator';
import { cookies } from 'next/headers';
import { getText } from '@/backend/FloroTextStore';
import Home from './Home';

export async function generateMetadata(
): Promise<Metadata> {
  const locale = (cookies().get("NEXT_LOCALE")?.value ||
    "EN") as keyof LocalizedPhrases["locales"] & string;
  const title = getText(locale, "meta_tags.welcome_to_demo")
  return {
    title
  }
}

export default function Page() {
  return (
    <Home/>
  )
}
