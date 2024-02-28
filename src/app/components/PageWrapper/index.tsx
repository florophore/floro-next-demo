"use client"

import React from "react";
import styles from "./PageWrapper.module.css";
import Link from "next/link";
import { useIcon } from "@/app/floro_infra/contexts/icons/FloroIconsProvider";
import ThemeSwitcher from "../ThemeSwitcher";
import LanguageSelect from "../LanguageSelect";

interface Props {
    children?: React.ReactNode;
}

const PageWrapper = (props: Props) => {
    const RoundIcon = useIcon("front-page.floro-round");
    return (
      <div className={styles["page-wrapper"]}>
        <nav className={styles["page-nav"]}>
          <div className={styles["inner-container"]}>
            <div className={styles["nav-content"]}>
              <Link href={"/"}>
                <img className={styles["nav-icon"]} src={RoundIcon} />
              </Link>
              <div className={styles["nav-data"]}>
                <div/>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                    <ThemeSwitcher/>
                    <LanguageSelect/>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div className={styles["scroll-wrapper"]}>
            <div className={styles["main-content"]}>
                {props.children}
            </div>
        </div>
      </div>
    );

}

export default React.memo(PageWrapper);