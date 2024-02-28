"use client"

import Link from 'next/link';
import PageWrapper from './components/PageWrapper';
import { useIcon } from './floro_infra/contexts/icons/FloroIconsProvider';
import { useRichText } from './floro_infra/hooks/text';
import styles from "./Home.module.css";

export default function Home() {
  const FloroIcon = useIcon("main.floro");
  const FloroTextIcon = useIcon("main.floro-text");

  const WelcomeToFloroDemo = useRichText("demo_page.welcome_to_floro_demo");
  const EditAppCode = useRichText("demo_page.edit_app_code");
  const StringExamples = useRichText("demo_page.string_examples");
  const ReadTheDocs = useRichText("demo_page.read_the_docs");

  return (
    <PageWrapper>
      <div className={styles.wrapper}>
        <img className={styles['floro-icon']} src={FloroIcon}/>
        <img className={styles['floro-icon-text']} src={FloroTextIcon}/>
      </div>
      <div className={styles['text-wrapper']}>
        <p className={styles['welcome-banner']}>
          <WelcomeToFloroDemo/>
        </p>
        <p className={styles['demo-code-text']}>
          <EditAppCode sourcePath={`src/app/page.tsx`}/>
        </p>
      </div>
      <div className={styles['link-wrapper']}>
        <Link target="_blank" className={styles['link']} href="https://floro.io/docs">
          <ReadTheDocs/>
        </Link>
        <Link style={{marginTop: 24}} className={styles['link']} href="/string-examples">
          <StringExamples/>
        </Link>
      </div>
    </PageWrapper>
  )
}
