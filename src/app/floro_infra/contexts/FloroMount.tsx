import React from "react";

import { LocalizedPhrases } from "../floro_modules/text-generator";

import { FloroDebugProvider } from "./FloroDebugProvider";
import { FloroTextProvider } from "./text/FloroTextContext";
import { FloroLocalesProvider } from "./text/FloroLocalesContext";
import { FloroPaletteProvider } from "./palette/FloroPaletteProvider";
import ThemeMount from "./themes/ThemeMount";
import { FloroIconsProvider } from "./icons/FloroIconsProvider";
import { ThemeSet } from "../floro_modules/themes-generator";

interface Props {
  children: React.ReactElement;
  initLocaleCode: keyof LocalizedPhrases["locales"] & string;
  initThemePreference?: keyof ThemeSet & string;
  text: LocalizedPhrases;
  cdnHost: string;
  localeLoads: {[key: string]: string}
}

const FloroMount = (props: Props) => {
  return (
    <FloroDebugProvider>
      <FloroPaletteProvider>
        <ThemeMount initTheme={props.initThemePreference}>
          <FloroIconsProvider>
            <FloroTextProvider text={props.text} cdnHost={props.cdnHost} localeLoads={props.localeLoads} >
              <FloroLocalesProvider initLocaleCode={props.initLocaleCode}>
                {props.children}
              </FloroLocalesProvider>
            </FloroTextProvider>
          </FloroIconsProvider>
        </ThemeMount>
      </FloroPaletteProvider>
    </FloroDebugProvider>
  );
};

export default FloroMount;
