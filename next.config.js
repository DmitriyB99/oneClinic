/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("./package.json");

const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // временно для сборки без проверки ошибок
    ignoreBuildErrors: true,
  },
  i18n: {
    locales: ["en", "ru", "kk", "uz"],
    defaultLocale: "ru",
    localeDetection: false,
  },
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
  env: {
    PUBLIC_URL: "/",
  },
  generateBuildId: async () => {
    if (process.env.COMMIT_SHA) {
      return `${version}-${process.env.COMMIT_SHA}`;
    }

    return version;
  },
  webpack: (config) => {
    config.resolve.alias["public"] = path.resolve(__dirname, "./public");

    config.module.rules.push({
      test: /\.svg?$/,
      oneOf: [
        {
          use: [
            {
              loader: "@svgr/webpack",
              options: {
                titleProp: true,
                dimensions: false,
              },
            },
          ],
          issuer: {
            and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
