export default {
  root: '.',
  server: {
    host: '0.0.0.0', // biar bisa diakses dari luar
    port: 5173,
    strictPort: true,
    allowedHosts: ['donasikita.id', 'www.donasikita.id'], // ✅ whitelist domain
  },
  hmr: {
    protocol: 'ws',
    host: 'donasikita.id',
    port: 5173
  }
}
