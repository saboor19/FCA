/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [
    'localhost',
    '192.168.1.4', 
    '10.106.186.113',     // your mobile IP
    '192.168.1.*', 
    '172.17.80.1',     // any device on the same subnet
  ],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`, // Your backend address
      },
    ];
  },
};

export default nextConfig;