/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_URL: process.env.BASE_URL,
        JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    },
};

export default nextConfig;
