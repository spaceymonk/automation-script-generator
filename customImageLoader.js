const basePath = process.env.NODE_ENV === "production" ? "/automation-script-generator" : "";

export default function myImageLoader({ src, width, quality }) {
  return `${basePath}${src}`;
}
