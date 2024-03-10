import { useCallback, useMemo } from "react";
import RichTextComponent, { ARGS_COND, ARGS_DEF } from "../components/RichTextComponent";
import { useIsDebugMode } from "../contexts/FloroDebugProvider";
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
import { RichTextProps, TextRenderers, richTextRenderers } from "../renderers/RichTextRenderer";
import { RTCallbackProps } from "../hooks/text";

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

export const getRichText = <K extends keyof PhraseKeys>(
  floroText: LocalizedPhrases,
  selectedLocaleCode: keyof LocalizedPhrases["locales"] & string,
  phraseKey: K,
  ) => {
  const isDebugMode = useIsDebugMode();
  const debugInfo = useMemo(
    () => getDebugInfo(floroText.phraseKeyDebugInfo, phraseKey),
    [phraseKey, floroText.phraseKeyDebugInfo, floroText]
  );

  const callback = useCallback(
    (
      args: ARGS_DEF<K>,
      renderers: TextRenderers<keyof PhraseKeys[K]["styledContents"] & string>,
      richTextOptions?: RichTextProps<K>
    ) => {
      const nodes = getPhraseValue<React.ReactElement, keyof Locales, K>(
        floroText,
        selectedLocaleCode,
        phraseKey,
        args
      );
      const _renderers: TextRenderers<
        keyof PhraseKeys[K]["styledContents"] & string
      > = {
        ...(richTextRenderers ?? {}),
        ...(renderers ?? {}),
      };
      return _renderers.render(
        nodes,
        _renderers,
        debugInfo?.groupName,
        debugInfo?.phraseKey,
        selectedLocaleCode,
        richTextOptions
      );
    },
    [floroText, selectedLocaleCode, debugInfo, phraseKey]
  );
  return useCallback(
    (props: RTCallbackProps<K>) => {
      const { renders, richTextOptions, ...args } = props;
      return (
        <RichTextComponent
          isDebugMode={isDebugMode}
          callback={callback}
          phraseKey={phraseKey}
          renders={
            renders as TextRenderers<
              keyof PhraseKeys[K]["styledContents"] & string
            >
          }
          debugInfo={debugInfo}
          args={args as ARGS_COND<K>}
          debugHex={props.debugHex}
          debugTextColorHex={props.debugTextColorHex}
          richTextOptions={richTextOptions}
        />
      );
    },
    [isDebugMode, callback, phraseKey, selectedLocaleCode]
  );
};