import {
  Locales,
  LocalizedPhrases,
  PhraseKeys,
  getDebugInfo,
  getPhraseValue,
} from "../floro_modules/text-generator";
import {
  PlainTextRenderers,
  plainTextRenderers,
} from "../renderers/PlainTextRenderer";

export const getPlainTextValue = <
  K extends keyof PhraseKeys,
  ARGS extends {
    [KV in keyof PhraseKeys[K]["variables"]]: PhraseKeys[K]["variables"][KV];
  } & {
    [KCV in keyof PhraseKeys[K]["contentVariables"]]: string;
  } & {
    [KSC in keyof PhraseKeys[K]["styleClasses"]]: (
      content: string,
      styledContentName: keyof PhraseKeys[K]["styledContents"] & string
    ) => string;
  }
>(
  floroText: LocalizedPhrases,
  selectedLocaleCode: keyof LocalizedPhrases["locales"] & string,
  phraseKey: K,
  ...opts: keyof ARGS extends { length: 0 }
    ? [
        ARGS?,
        PlainTextRenderers<keyof PhraseKeys[K]["styledContents"] & string>?
      ]
    : [
        ARGS,
        PlainTextRenderers<keyof PhraseKeys[K]["styledContents"] & string>?
      ]
): string => {
  const args = opts[0] ?? ({} as ARGS);
  const renderers = opts?.[1] ?? plainTextRenderers;
  const nodes = getPhraseValue<string, keyof Locales, K>(
    floroText,
    selectedLocaleCode,
    phraseKey,
    args
  );
  const debugInfo = getDebugInfo(floroText.phraseKeyDebugInfo, phraseKey);
  return renderers.render(
    nodes,
    renderers,
    debugInfo.groupName,
    debugInfo.phraseKey,
    selectedLocaleCode
  );
};
