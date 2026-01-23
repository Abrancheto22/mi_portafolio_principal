/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // remotePatterns es la forma moderna de autorizar dominios en Next.js 14+
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co', // El ** permite cualquier subdominio de tu proyecto
      },
    ],
  },
};

module.exports = nextConfig;