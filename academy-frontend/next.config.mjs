/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [
    'localhost',
    '192.168.1.5', 
    '10.106.186.113',     // your mobile IP
    '192.168.1.*',      // any device on the same subnet
  ],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // Your backend address
      },
    ];
  },
};

export default nextConfig;