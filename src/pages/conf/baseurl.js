export const url = "http://36.91.103.198:3000/api";
export const url_images = "http://36.91.103.198:3000/images/";
// export const url = "http://localhost:3000/api";
// export const url_images = "http://localhost:3000/images/";
export function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(angka);
}