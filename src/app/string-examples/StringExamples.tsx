"use client";

import {
  useCallback,
  useMemo,
  useState,
} from "react";
import PageWrapper from "@/app/components/PageWrapper";
import { usePlainText, useRichText } from "@/app/floro_infra/hooks/text";
import styles from "./StringExamples.module.css";
import { PhraseKeys } from "../floro_infra/floro_modules/text-generator";
import { useRouter } from "next/navigation";
import { useFloroPalette } from "../floro_infra/contexts/palette/FloroPaletteProvider";
import { ordinalSuffix } from "./stringhelpers";
import { useFloroLocales } from "../floro_infra/contexts/text/FloroLocalesContext";

export default function StringExamples() {
  const router = useRouter();
  const palette = useFloroPalette();
  const { selectedLocaleCode } = useFloroLocales();

  const StringExamplesTitle = useRichText(
    "string_examples.string_examples_title"
  );
  const StringOverview = useRichText("string_examples.string_overview");
  const HandlingLinks = useRichText("string_examples.handling_links");
  const InsertingContent = useRichText("string_examples.inserting_content");
  const PluralizationAndGrammar = useRichText(
    "string_examples.pluralization_and_grammar"
  );

  const NumberAndDatesExamples = useRichText(
    "string_examples.numbers,_dates,_currency,_&_lists"
  );

  const enterUrlPlaceholder = usePlainText(
    "string_examples.enter_url_input_placeholder"
  );
  const [link, setLink] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Mallard_drake_.02.jpg/800px-Mallard_drake_.02.jpg"
  );

  const onClickLink = useCallback(
    (
      linkName: keyof PhraseKeys["string_examples.handling_links"]["links"],
      linkHref: string
    ) => {
      if (linkName == "navigate back") {
        router.back();
      }
      if (linkName == "alert link") {
        alert(linkName);
      }
      if (linkName == "floro webpage") {
        window.open(linkHref, "_blank");
      }
    },
    [router]
  );

  const enterNumberOfFilesPlaceholder = usePlainText(
    "string_examples.enter_number_of_files_placeholder"
  );
  const [numberOfFilesString, setNumberOfFiles] = useState("1");
  const numberOfFiles = useMemo(() => {
    try {
      const value = parseFloat(numberOfFilesString);
      if (Number.isNaN(value)) {
        return 0;
      }
      return value;
    } catch (e) {
      return 0;
    }
  }, [numberOfFilesString]);

  const [placeString, setPlaceString] = useState("1");
  const place = useMemo(() => {
    try {
      const value = parseFloat(placeString);
      if (Number.isNaN(value)) {
        return 0;
      }
      return value;
    } catch (e) {
      return 0;
    }
  }, [placeString]);

  const placeSuffix = useMemo(() => {
    return ordinalSuffix(place, selectedLocaleCode);
  }, [place, selectedLocaleCode]);
  const enterPlacePlaceholder = usePlainText("string_examples.enter_place");

  const onPressShopifyLinkExample = useCallback(
    (
      linkName: keyof PhraseKeys["string_examples.pluralization_and_grammar"]["links"],
      linkHref: string
    ) => {
      if (linkName == "shopify article") {
        window.open(linkHref, "_blank");
      }
    },
    []
  );

  const [gender, setGender] = useState("female");
  const enterGenderInput = usePlainText(
    "string_examples.enter_gender_input_placeholder"
  );

  const renderTitle = useCallback((content: React.ReactElement) => {
    return <h2 className={styles["example-title"]}>{content}</h2>;
  }, []);

  const renderSmallTitle = useCallback((content: React.ReactElement) => {
    return <h3 className={styles["example-small-title"]}>{content}</h3>;
  }, []);

  return (
    <PageWrapper>
      <div className={styles.wrapper}>
        <h1 className={styles["title"]} style={{ marginBottom: 12 }}>
          <StringExamplesTitle />
        </h1>
        <div className={styles["example"]}>
          <StringOverview
            code={<b>{"src/app/string-examples/page.tsx"}</b>}
            title={renderTitle}
          />
        </div>
        <div className={styles["example"]}>
          <HandlingLinks
            title={renderTitle}
            code={(content) => content}
            richTextOptions={{
              onClickLink,
              linkColor: palette?.blue.regular ?? "blue",
              styledContent: {
                code: styles["code"],
              },
            }}
          />
        </div>
        <div className={styles["example"]}>
          <InsertingContent
            title={renderTitle}
            richTextOptions={{
              onClickLink,
              linkColor: palette?.blue.regular ?? "blue",
            }}
            inputContent={
              <>
                <img className={styles["link-img"]} src={link} />
                <input
                  className={styles["input"]}
                  type="text"
                  value={link}
                  onChange={(event) => {
                    setLink(event.target.value);
                  }}
                  placeholder={enterUrlPlaceholder}
                />
              </>
            }
          />
        </div>
        <div className={styles["example"]}>
          <PluralizationAndGrammar
            title={renderTitle}
            smallTitle={renderSmallTitle}
            richTextOptions={{
              linkColor: palette?.blue.regular ?? "blue",
              onClickLink: onPressShopifyLinkExample,
            }}
            inputContent={
              <>
                <input
                  className={styles["input"]}
                  type="text"
                  value={numberOfFilesString}
                  onChange={(event) => {
                    setNumberOfFiles(event.target.value);
                  }}
                  placeholder={enterNumberOfFilesPlaceholder}
                />
              </>
            }
            gender={gender}
            numberOfFiles={numberOfFiles}
            place={place}
            placeSuffix={placeSuffix}
            genderInputContent={
              <>
                <input
                  className={styles["input"]}
                  type="text"
                  value={gender}
                  onChange={(event) => {
                    setGender(event.target.value);
                  }}
                  placeholder={enterGenderInput}
                />
              </>
            }
            placeInput={
              <>
                <input
                  className={styles["input"]}
                  type="text"
                  value={placeString}
                  onChange={(event) => {
                    setPlaceString(event.target.value);
                  }}
                  placeholder={enterPlacePlaceholder}
                />
              </>
            }
          />
        </div>
        <div className={styles["example"]}>
          <NumberAndDatesExamples
            title={renderTitle}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
