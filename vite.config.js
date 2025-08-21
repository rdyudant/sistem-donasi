export default {
  root: '.',
  server: {
    host: '0.0.0.0', // biar bisa diakses dari network/domain
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: ['donasikita.id', 'www.donasikita.id', '36.91.103.198'],
      port: 5173
    }
  }
};