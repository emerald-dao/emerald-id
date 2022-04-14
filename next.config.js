module.exports = {
  async redirects() {
    return [
      {
        source: '/create',
        destination: '/',
        permanent: true,
      },
      {
        source: '/reset',
        destination: '/',
        permanent: true,
      },
    ]
  },
}