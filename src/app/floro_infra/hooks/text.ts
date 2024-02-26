import React, { useDebugValue, useMemo } from "react";
import {
  Locales,
  PhraseKeys,
  getDebugInfo,
  getPhraseValue,
} from "../floro_modules/text-generator";
import {
  TextRenderers,
  richTextRenderers,
} from "../renderers/RichTextRenderer";
import {
  PlainTextRenderers,
  plainTextRenderers,
} from "../renderers/PlainTextRenderer";
import { useFloroText } from "../contexts/text/FloroTextContext";
import { useFloroLocales } from "../contexts/text/FloroLocalesContext";
import {  useIsDebugMode } from "../contexts/FloroDebugProvider";

export interface TextDebugOptions {
  debugHex: `#${string}`;
  debugTextColorHex: string;
}

export const useRichText = <
  K extends keyof PhraseKeys,
  ARGS extends {
    [KV in keyof PhraseKeys[K]["variables"]]: PhraseKeys[K]["variables"][KV];
  } & {
    [KCV in keyof PhraseKeys[K]["contentVariables"]]: React.ReactElement;
  } & {
    [KSC in keyof PhraseKeys[K]["styleClasses"]]: (
      content: React.ReactElement,
      styledContentName: keyof PhraseKeys[K]["styledContents"] & string
    ) => React.ReactElement;
  }
>(
  phraseKey: K,
  ...opts: keyof ARGS extends { length: 0 }
    ? [
        ARGS?,
        TextRenderers<keyof PhraseKeys[K]["styledContents"] & string>?,
        {
          debugHex: `#${string}`;
          debugTextColorHex: string;
        }?
      ]
    : [
        ARGS,
        TextRenderers<keyof PhraseKeys[K]["styledContents"] & string>?,
        {
          debugHex: `#${string}`;
          debugTextColorHex: string;
        }?
      ]
) => {
  const args = opts?.[0] ?? ({} as ARGS);
  const renderers: TextRenderers<keyof PhraseKeys[K]["styledContents"] & string> = opts?.[1] ?? richTextRenderers;
  const debugOptions = opts?.[2] ?? {
    debugHex: "#FF0000" as `#${string}`,
    debugTextColorHex: "white",
  };

  const floroText = useFloroText();
  const isDebugMode = useIsDebugMode();
  const { selectedLocaleCode } = useFloroLocales();
  const debugInfo = useMemo(
    () => getDebugInfo(floroText.phraseKeyDebugInfo, phraseKey),
    [phraseKey, floroText.phraseKeyDebugInfo, floroText]
  );

  const nodes = getPhraseValue<React.ReactElement, keyof Locales, K>(
    floroText,
    selectedLocaleCode,
    phraseKey,
    args
  );
  return useMemo(() => {
    return renderers.render(
      nodes,
      renderers,
      isDebugMode,
      debugInfo,
      debugOptions.debugHex,
      debugOptions.debugTextColorHex,
    );
  }, [
    richTextRenderers,
    renderers,
    isDebugMode,
    debugInfo,
    selectedLocaleCode,
    args,
    phraseKey,
  ]);
};

export const usePlainText = <
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
) => {
  const args = opts[0] ?? ({} as ARGS);
  const renderers = opts?.[1] ?? plainTextRenderers;
  const floroText = useFloroText();
  const { selectedLocaleCode } = useFloroLocales();
  return useMemo(() => {
    const nodes = getPhraseValue<string, keyof Locales, K>(
      floroText,
      selectedLocaleCode,
      phraseKey,
      args
    );
    return renderers.render(nodes, renderers);
  }, [richTextRenderers, renderers, selectedLocaleCode, args, phraseKey]);
};