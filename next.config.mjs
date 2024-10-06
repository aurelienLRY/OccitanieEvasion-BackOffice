/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'lh6.googleusercontent.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: '*',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'images.app.goo.gl',
          port: '',
          pathname: '/**',
        },
      ],
    },
  }









  
  export default nextConfig;
