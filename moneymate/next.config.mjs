/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'randomuser.me',
                
            },
        ],
    },
    experimental: {
        serverActions: {
            bobySizeLimit: "5mb",
        }
    },
};

export default nextConfig;
