"use client"

import React, { useMemo, useCallback, useState, useEffect } from "react";
import styles from "./ThemeSwitch.module.css";
import { useThemePreference } from "@/app/floro_infra/contexts/themes/ThemePreferenceProvider";
import { useIcon } from "@/app/floro_infra/contexts/icons/FloroIconsProvider";
import { useFloroPalette } from "@/app/floro_infra/contexts/palette/FloroPaletteProvider";

interface Props {}

const ThemeSwitcher = (props: Props) => {
  const { currentTheme, selectColorTheme } = useThemePreference();

  const sunIcon = useIcon("front-page.sun");
  const moonIcon = useIcon("front-page.moon");
  const palette = useFloroPalette();

  const isLight = useMemo(() => {
    return currentTheme == "light";
  }, [currentTheme]);

  const onToggle = useCallback(() => {
    if (currentTheme == "light") {
      selectColorTheme("dark");
    } else {
      selectColorTheme("light");
    }
  }, [currentTheme]);

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["toggle-wrapper"]} onClick={onToggle}>
        <div
          className={styles["switch-toggle"]}
          style={{
            left: isLight ? 2 : 26,
            background: isLight
              ? palette.white.regular ?? ""
              : palette.black.regular ?? "",
          }}
        >
          <img className={styles.icon} src={isLight ? sunIcon : moonIcon} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ThemeSwitcher);
