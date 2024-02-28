import metaFile from "../../../floro_infra/meta.floro.json";
import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import {
  LocalizedPhraseKeys,
  LocalizedPhrases,
  PhraseKeyDebugInfo,
  PhraseKeys,
} from "@/app/floro_infra/floro_modules/text-generator";
import staticStructure from "@/app/floro_infra/floro_modules/text-generator/static-structure.json" assert { type: "json" };
import importText from "@/app/floro_infra/floro_modules/text-generator/server-text.json" assert { type: "json" };
import { getJSON } from "@floro/text-generator";
import FloroTextStore from "@/backend/FloroTextStore";
import StaticLocaleStorageAccessor from "@/backend/StaticLocalesStorageAccessor";

const initText = importText as unknown as LocalizedPhrases;

const argsAreSame = (
  existingArgs: { [key: string]: string | number | boolean },
  incomingArgs: { [key: string]: string | number | boolean }
): boolean => {
  if (Object.keys(existingArgs).length != Object.keys(incomingArgs).length) {
    return false;
  }
  for (const key in existingArgs) {
    if (incomingArgs?.[key] != existingArgs[key]) {
      return false;
    }
  }
  return true;
};

const getUpdatedText = (localesJSON: LocalizedPhrases): LocalizedPhrases => {
  for (const localeCode in localesJSON.locales) {
    const localesJSONPhraseKeys =
      localesJSON.localizedPhraseKeys?.[
        localeCode as string & keyof LocalizedPhraseKeys
      ] ?? ({} as LocalizedPhrases);
    const initJSONPhraseKeys =
      initText.localizedPhraseKeys?.[
        localeCode as string & keyof LocalizedPhraseKeys
      ] ?? ({} as LocalizedPhrases);
    for (let phraseKey in staticStructure.structure) {
      if (
        !localesJSONPhraseKeys?.[
          phraseKey as keyof typeof localesJSONPhraseKeys
        ]
      ) {
        (localesJSONPhraseKeys[
          phraseKey as keyof PhraseKeys
        ] as PhraseKeys[keyof PhraseKeys]) = initJSONPhraseKeys[
          phraseKey as keyof PhraseKeys
        ] as PhraseKeys[keyof PhraseKeys];
      } else {
        if (
          !argsAreSame(
            (
              staticStructure?.structure as {
                [key: string]: {[key: string]: string | number | boolean};
              }
            )?.[phraseKey as string] as {
              [key: string]: string | number | boolean;
            },
            localesJSONPhraseKeys[phraseKey as keyof PhraseKeys].args as {
              [key: string]: string | number | boolean;
            },
          )
        ) {
          (localesJSONPhraseKeys[
            phraseKey as keyof PhraseKeys
          ] as PhraseKeys[keyof PhraseKeys]) = initJSONPhraseKeys[
            phraseKey as keyof PhraseKeys
          ] as PhraseKeys[keyof PhraseKeys];
        }
      }
    }
    for (let phraseKey in localesJSONPhraseKeys) {
      if (!(staticStructure.structure as any)?.[phraseKey as keyof PhraseKeys]) {
        const partialLocalesJSON = localesJSONPhraseKeys as Partial<PhraseKeys>;
        const partialDebugInfo =
          localesJSON.phraseKeyDebugInfo as Partial<PhraseKeyDebugInfo>;
        delete partialLocalesJSON[phraseKey as keyof PhraseKeys];
        delete partialDebugInfo[phraseKey as keyof PhraseKeys];
      }
    }
  }
  return localesJSON;
};

const shortHash = (str: string) => {
  let hash = 0;
  str = str.padEnd(8, "0");
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash;
  }
  return new Uint32Array([hash])[0].toString(16);
};

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("floro-signature-256");
    const body = await req.json();
    const stringPayload = JSON.stringify(body);
    const hmac = createHmac("sha256", process?.env?.FLORO_WEBHOOK_SECRET ?? "");
    const reproducedSignature =
      "sha256=" + hmac.update(stringPayload).digest("hex");

    if (signature == reproducedSignature) {
      if (body.event == "test") {
        return NextResponse.json(
          {},
          {
            status: 200,
          }
        );
      }
      if (body?.repositoryId != metaFile.repositoryId) {
        return NextResponse.json(
          {},
          {
            status: 200,
          }
        );
      }
      const payload = body?.payload;
      if (!payload?.branch?.lastCommit) {
        return NextResponse.json(
          {},
          {
            status: 200,
          }
        );
      }
      if (payload?.branch?.id != "main") {
        return NextResponse.json(
          {},
          {
            status: 200,
          }
        );
      }

      try {
        const apiServer =
          process?.env?.FLORO_API_SERVER ?? "http://localhost:63403";
        const stateLinkRequest = await fetch(
          `${apiServer}/public/api/v0/repository/${metaFile.repositoryId}/commit/${payload.branch.lastCommit}/stateLink`,
          {
            headers: {
              "floro-api-key": process?.env?.FLORO_API_KEY ?? "",
            },
          }
        );
        if (!stateLinkRequest) {
          return NextResponse.json(
            {},
            {
              status: 400,
            }
          );
        }
        const { stateLink } = await stateLinkRequest.json();
        if (!stateLink) {
          return NextResponse.json(
            {},
            {
              status: 400,
            }
          );
        }
        const stateRequest = await fetch(
          stateLink
        );
        const state = await stateRequest.json();
        if (!state?.store?.text) {
          return NextResponse.json(
            {},
            {
              status: 400,
            }
          );
        }
        const textUpdateJSON: LocalizedPhrases = await getJSON(state.store);
        const textUpdate = getUpdatedText(textUpdateJSON);
        const loadsLoads: { [key: string]: string } = {};
        for (const localeCode in textUpdate.localizedPhraseKeys) {
          const jsonString = JSON.stringify(
            textUpdate.localizedPhraseKeys[
              localeCode as keyof typeof textUpdate.localizedPhraseKeys
            ]
          );
          const sha = shortHash(jsonString);
          const fileName = `${localeCode}.${sha}.json`;
          // write to disk or upload to CDN here
          const didWrite = await StaticLocaleStorageAccessor.writeLocales(
            fileName,
            jsonString
          );
          if (didWrite) {
            loadsLoads[localeCode] = fileName;
          } else {
            // if we don't write, then don't publish
            return NextResponse.json(
              {},
              {
                status: 400,
              }
            );
          }
        }
        FloroTextStore.getInstance().setText(
          payload.branch.lastCommit,
          textUpdate,
          loadsLoads
        );
        return NextResponse.json(
          {},
          {
            status: 200,
          }
        );
      } catch (e) {
        console.log("Text update failed", e);
        return NextResponse.json(
          {
            message: "You dun goof'd",
          },
          {
            status: 500,
          }
        );
      }
    } else {
      return NextResponse.json(
        {
          message: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }
  } catch (e) {
    console.log("Webhook failed", e);
    return NextResponse.json(
      {
        message: "You dun goof'd",
      },
      {
        status: 500,
      }
    );
  }
}
