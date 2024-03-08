/** @type {import('next').NextConfig} */

const nextConfig = {
  // reactStrictMode: true,
  poweredByHeader: false,
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'strict-transform-security',
            value: 'max-age=31536000; includeSubdomains',
          },
          // {
          //   key: 'content-security-policy',
          //   value: '',
          // },
          {
            key: 'referrer-policy',
            value: 'no-referrer',
          },
          {
            key: 'x-frame-options',
            value: 'DENY',
          },
          // {
          //   key: 'permission-policy',
          //   value: '',
          // },
          {
            key: 'x-content-type-options',
            value: 'nosniff',
          },
          {
            key: 'x-permitted-cross-domain-policies',
            value: 'none',
          },
          {
            key: 'clear-site-data',
            value: '*',
          },
        ],
      }
    ]
  }
};

module.exports = nextConfig;