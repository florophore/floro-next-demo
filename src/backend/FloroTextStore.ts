import metaFile from "../app/floro_infra/meta.floro.json" assert { type: "json" };
import {
  LocalizedPhraseKeys,
  LocalizedPhrases,
  PhraseKeyDebugInfo,
  PhraseKeys,
} from "../app/floro_infra/floro_modules/text-generator";
import initText from "../app/floro_infra/floro_modules/text-generator/server-text.json" assert { type: "json" };
import initLocaleLoads from "../app/floro_infra/floro_modules/text-generator/locale.loads.json" assert { type: "json" };
import staticStructure from "../app/floro_infra/floro_modules/text-generator/static-structure.json" assert { type: "json" };
import InMemoryKVAndPubSub from "./InMemoryKVAndPubSub";

const FLORO_TEXT_PREFIX = `floro_text_repo:${staticStructure.hash}`;

export default class FloroTextStore {
  public buildText: LocalizedPhrases = initText as unknown as LocalizedPhrases;
  public currentText: LocalizedPhrases =
    initText as unknown as LocalizedPhrases;
  public currentTextString: string = JSON.stringify(initText);
  public currentLocaleLoads: { [key: string]: string } =
    initLocaleLoads as unknown as { [key: string]: string };
  public currentLocaleLoadsString: string = JSON.stringify(
    initLocaleLoads,
    null,
    2
  );
  public buildSha: string = metaFile.sha;
  public currentSha: string = metaFile.sha;
  public buildRepoId: string = metaFile.repositoryId;
  public buildBranch: string = "main";
  private static _instance?: FloroTextStore;

  public static getInstance(): FloroTextStore {
    if (!this._instance) {
        this._instance = new FloroTextStore();
        this._instance.onReady();
    }
    return this._instance;
  }

  public onReady() {
    // setup subscriber
    InMemoryKVAndPubSub.subscribe(
      `${FLORO_TEXT_PREFIX}:current_sha_changed:${metaFile.repositoryId}:${this.buildSha}`,
      async (sha: string) => {
        if (sha && this.currentSha != sha) {
          const textString = InMemoryKVAndPubSub?.get(
            `${FLORO_TEXT_PREFIX}:text:${metaFile.repositoryId}:${this.buildSha}`
          );
          if (textString) {
            const text = JSON.parse(textString) as LocalizedPhrases;
            this.currentText = text;
            this.currentSha = sha;
            this.currentTextString = JSON.stringify(text);
          }
          const localeLoadsString = InMemoryKVAndPubSub.get(
            `${FLORO_TEXT_PREFIX}:locale_loads:${metaFile.repositoryId}:${this.buildSha}`
          );
          if (localeLoadsString) {
            const localeLoads = JSON.parse(localeLoadsString) as {
              [key: string]: string;
            };
            this.currentLocaleLoads = localeLoads;
            this.currentLocaleLoadsString = localeLoadsString;
          }
        }

      }
    );

    // hydrate persisted state
    const currSha = InMemoryKVAndPubSub?.get(
      `${FLORO_TEXT_PREFIX}:current_sha:${metaFile.repositoryId}:${this.buildSha}`
    );
    if (currSha && this.currentSha != currSha) {
      const textString = InMemoryKVAndPubSub?.get(
        `${FLORO_TEXT_PREFIX}:text:${metaFile.repositoryId}:${this.buildSha}`
      );
      if (textString) {
        const text = JSON.parse(textString) as LocalizedPhrases;
        this.currentText = text;
        this.currentSha = currSha;
        this.currentTextString = textString;
      }

      const localeLoadsString = InMemoryKVAndPubSub?.get(
        `${FLORO_TEXT_PREFIX}:locale_loads:${metaFile.repositoryId}:${this.buildSha}`
      );
      if (localeLoadsString) {
        const localeLoads = JSON.parse(localeLoadsString) as {
          [key: string]: string;
        };
        this.currentLocaleLoads = localeLoads;
        this.currentLocaleLoadsString = localeLoadsString;
      }
    }
  }

  public async setText(
    newSha: string,
    text: LocalizedPhrases,
    localeLoads: { [key: string]: string }
  ) {
    await InMemoryKVAndPubSub.set(
      `${FLORO_TEXT_PREFIX}:current_sha:${metaFile.repositoryId}:${this.buildSha}`,
      newSha
    );
    await InMemoryKVAndPubSub.set(
      `${FLORO_TEXT_PREFIX}:text:${metaFile.repositoryId}:${this.buildSha}`,
      JSON.stringify(text)
    );
    await InMemoryKVAndPubSub.set(
      `${FLORO_TEXT_PREFIX}:locale_loads:${metaFile.repositoryId}:${this.buildSha}`,
      JSON.stringify(localeLoads, null, 2)
    );
    InMemoryKVAndPubSub.publish(
      `${FLORO_TEXT_PREFIX}:current_sha_changed:${metaFile.repositoryId}:${this.buildSha}`,
      newSha
    );
  }

  public getText(): LocalizedPhrases {
    return this.currentText;
  }
  public getTextString(): string {
    return this.currentTextString;
  }
  public getLocaleLoads(): { [key: string]: string } {
    return this.currentLocaleLoads;
  }
  public getLocaleLoadsString(): string {
    return this.currentLocaleLoadsString;
  }

  public getTextSubSet(localeCode: string, phraseKeys: Set<string>): string {
    const localizedPhraseKeys = {} as Record<
      keyof PhraseKeys,
      PhraseKeys[keyof PhraseKeys]
    >;
    const phraseKeyDebugInfo = {} as Record<
      keyof PhraseKeys,
      PhraseKeyDebugInfo[keyof PhraseKeys]
    >;
    for (const phraseKey of Array.from(phraseKeys) as Array<keyof PhraseKeys>) {
      localizedPhraseKeys[phraseKey] =
        this.currentText?.localizedPhraseKeys?.[
          localeCode as keyof LocalizedPhraseKeys
        ]?.[phraseKey];
      phraseKeyDebugInfo[phraseKey] =
        this.currentText?.phraseKeyDebugInfo?.[phraseKey];
    }
    return JSON.stringify({
      locales: this.currentText.locales,
      localizedPhraseKeys: {
        [localeCode]: localizedPhraseKeys,
      },
      phraseKeyDebugInfo,
    });
  }
}