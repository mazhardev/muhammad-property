/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages serves static files only, so we pre-render everything to out/.
  output: 'export',

  // Keeps the URLs the site already ranks for: /, /ur/, /pa/ — each written as
  // a directory with an index.html rather than /ur.html.
  trailingSlash: true,

  // next/image needs a running server to optimise on the fly. We ship plain
  // <img> tags with width/height instead, so nothing here needs an optimiser.
  images: { unoptimized: true },

  // Fail the build on a type error rather than shipping a broken page.
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
