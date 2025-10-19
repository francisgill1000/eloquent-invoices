/** @type {import('next').NextConfig} */
const nextConfig = {
    // REQUIRED FOR STATIC BUILD (e.g., Netlify, Vercel Static)
    // This tells Next.js to export your application as static HTML, CSS, and JS assets.
    output: 'export',

    // Optional: Disable server-side image optimization and use static image imports.
    // This is often needed when using 'output: "export"' because the Next.js image server
    // (which dynamically optimizes images) is not available in a static deployment.
    images: {
        unoptimized: true,
        // The remotePatterns config below is retained for clarity, but 'unoptimized: true'
        // means Next.js won't attempt to optimize these images dynamically.
        // If you keep the image component, ensure external images are directly referenced.
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
            // Include any other external domains you use (e.g., 'cdn.example.com')
        ],
    },
};

export default nextConfig;
