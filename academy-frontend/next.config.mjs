/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [
    'localhost',
    '192.168.1.5',      // your mobile IP
    '192.168.1.*',      // any device on the same subnet (optional)
  ],
};

export default nextConfig;