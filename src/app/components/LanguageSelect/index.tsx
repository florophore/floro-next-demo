"use client";

import React, { useState } from "react";

import { useIcon } from "@/app/floro_infra/contexts/icons/FloroIconsProvider";
import { useFloroLocales } from "@/app/floro_infra/contexts/text/FloroLocalesContext";
import styles from "./LanguageSelect.module.css";

interface Props {}

const LanguageSelect = (props: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  const langIcon = useIcon(
    "front-page.language",
    isHovered ? "hovered" : undefined
  );
  const dropdownIcon = useIcon(
    "front-page.drop-down-arrow",
    isHovered ? "hovered" : undefined
  );

  const { selectedLocaleCode, setSelectedLocaleCode } = useFloroLocales();

  return (
    <div className={styles.wrapper} onMouseLeave={() => setIsHovered(false)}>
      <div
        className={styles["image-wrapper"]}
        onMouseEnter={() => setIsHovered(true)}
      >
        <img className={styles.icon} src={langIcon} />
        <img className={styles.icon} src={dropdownIcon} />
      </div>
      <div
        style={{
          display: isHovered ? "block" : "none",
        }}
        className={styles.container}
      >
        <div className={styles.outer}>
          <div className={styles.inner}>
            <p
              style={{
                fontWeight: selectedLocaleCode == "EN" ? 600 : 400,
              }}
              className={styles["lang-option"]}
              onClick={() => {
                setSelectedLocaleCode("EN");
              }}
            >
              {"English"}
            </p>
            <p
              style={{
                fontWeight: selectedLocaleCode == "ES" ? 600 : 400,
              }}
              className={styles["lang-option"]}
              onClick={() => {
                setSelectedLocaleCode("ES");
              }}
            >
              {"Español"}
            </p>
            <p
              style={{
                fontWeight: selectedLocaleCode == "ZH" ? 600 : 400,
              }}
              className={styles["lang-option"]}
              onClick={() => {
                setSelectedLocaleCode("ZH");
              }}
            >
              {"简体中文"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(LanguageSelect);
