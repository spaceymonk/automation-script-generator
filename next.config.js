const basePath = process.env.NODE_ENV === "production" ? "/automation-script-generator" : "";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: `${basePath}/`,
  images: {
    loader: 'custom',
    loaderFile: './customImageLoader.js',
  },
};

module.exports = nextConfig;
