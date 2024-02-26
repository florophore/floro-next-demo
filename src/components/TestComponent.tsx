"use client";

import { useTestContent } from "@/app/contexts/TestContext";
import { useFloroLocales } from "@/app/floro_infra/contexts/text/FloroLocalesContext";
import { useFloroText } from "@/app/floro_infra/contexts/text/FloroTextContext";
import { useRichText } from "@/app/floro_infra/hooks/text";
import React, { useEffect, useState } from "react";

const TestComponent = () => {
  // this context has been initialized by a parent RSC
  // but we can access it as expected in a Client Component

  const [count, setCount] = useState(1);
  const { referer, setReferer } = useTestContent();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!referer) {
        return;
      }
      const index = Math.floor(Math.random() * referer.length);
      const charIndex = Math.floor(26 * Math.random());
      const char = String.fromCharCode("A".charCodeAt(0) + charIndex);
      const next = referer.split("");
      next[index] = char;
      setReferer(next.join(""));
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, [referer]);


  const someValue = useRichText("main.hello_world");

  const { selectedLocaleCode , setSelectedLocaleCode} = useFloroLocales();
  return (
    <div>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        {`Count: ${count}`}
      </button>
      <p>{`Ref: ${referer}`}</p>
      <div>
        <p className="whitespace-pre fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          {someValue}
        </p>
      </div>
      <button
        onClick={() => {
            if (selectedLocaleCode == "EN") {
                setSelectedLocaleCode("ZH");
            } else {
                setSelectedLocaleCode("EN");
            }
        }}
      >
        {`Switch Locale To: ${selectedLocaleCode == "EN" ? "ZH" : "EN" }`}
      </button>
    </div>
  );
};

export default React.memo(TestComponent);
