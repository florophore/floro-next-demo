const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  trailingSlash: true,
  webpack: (config) => {
    // Webpack will scream about fs from the generators if we don't
    // set the fs fallback to false
    config.resolve.fallback = { fs: false };

    config.devServer =  {
      watchOptions: {
        ignored: [
          path.resolve(__dirname, '.dumb_cache.json')
        ]
      }
    }

    return config;
  },
};

module.exports = nextConfig;
