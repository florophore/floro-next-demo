const localesJSON = require("./src/app/floro_infra/floro_modules/text-generator/text.json");
const localeCodes = Object.keys(localesJSON.locales).map((l) =>
  l.toLowerCase()
);
const defaultLocaleCode = Object.keys(localesJSON.locales)
  .find((l) => localesJSON.locales[l].isGlobalDefault)
  .toLowerCase();

const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: localeCodes,
    defaultLocale: defaultLocaleCode,
    localeDetection: false,
  },
  trailingSlash: true,
  webpack: (config) => {
    // Webpack will scream about fs from the generators if we don't
    // set the fs fallback to false
    config.resolve.fallback = { fs: false };

    config.devServer = {
      watchOptions: {
        ignored: [path.resolve(__dirname, ".dumb_cache.json")],
      },
    };

    return config;
  },
};

module.exports = nextConfig;
