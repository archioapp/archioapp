/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Suppress the "Serializing big strings" warning for large pitch deck components
    // The pitch deck has large inline data (~114KB) which is expected and works correctly
    if (dev) {
      // Disable filesystem caching in development to avoid serialization warnings
      config.cache = {
        type: 'memory',
      }
    }
    return config
  },
  async rewrites() {
    return [
      // If any old link still has a literal /(main)/ segment, forward it to the correct path
      { source: '/(main)/:path*', destination: '/:path*' },
      // Serve static HTML pitch/brief pages at clean URLs.
      // These live in /public/moodboard/index.html and /public/xclay/index.html.
      // Next.js does not auto-serve index.html for directory requests, so we
      // map both /moodboard and /moodboard/ explicitly.
      { source: '/moodboard', destination: '/moodboard/index.html' },
      { source: '/moodboard/', destination: '/moodboard/index.html' },
      { source: '/xclay', destination: '/xclay/index.html' },
      { source: '/xclay/', destination: '/xclay/index.html' },
      // qclay — signed founder-confirmation edition of the landing brief
      { source: '/qclay', destination: '/qclay/index.html' },
      { source: '/qclay/', destination: '/qclay/index.html' },
      // Moodboard v2 — four lens prototypes for XCLAY presentation
      { source: '/moodboard-v2', destination: '/moodboard-v2/index.html' },
      { source: '/moodboard-v2/', destination: '/moodboard-v2/index.html' },
      { source: '/moodboard-v2/room', destination: '/moodboard-v2/room/index.html' },
      { source: '/moodboard-v2/room/', destination: '/moodboard-v2/room/index.html' },
      { source: '/moodboard-v2/tide', destination: '/moodboard-v2/tide/index.html' },
      { source: '/moodboard-v2/tide/', destination: '/moodboard-v2/tide/index.html' },
      { source: '/moodboard-v2/constellation', destination: '/moodboard-v2/constellation/index.html' },
      { source: '/moodboard-v2/constellation/', destination: '/moodboard-v2/constellation/index.html' },
      { source: '/moodboard-v2/ecosystem', destination: '/moodboard-v2/ecosystem/index.html' },
      { source: '/moodboard-v2/ecosystem/', destination: '/moodboard-v2/ecosystem/index.html' },
    ];
  },
  // Client flags are read from process.env at build time
  // Server secrets should be in .env.local
}

export default nextConfig
