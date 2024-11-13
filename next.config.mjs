/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },

    typescript: {
      // Add this to also ignore TypeScript errors during build
      ignoreBuildErrors: true,
    },
};

export default nextConfig;