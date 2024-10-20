/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/sdapi/:path*',
          destination: 'http://127.0.0.1:7861/sdapi/:path*', // Proxy to Stable Diffusion API
        },
      ];
    },
  };
  
  export default nextConfig;
  