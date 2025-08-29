import renderHeader from '../components/header.js';
import renderFooter from '../components/footer.js';
import { url } from './conf/baseurl.js';

export default async function paymentPage(app) {
  window.scrollTo(0, 0);
  setPageTitle('Status Pembayaran');

  // contoh fetch status pembayaran (bisa dari API backend kamu)
  const params = new URLSearchParams(window.location.search);
  const bill_no = params.get("bill_no");
  let statusPembayaran = "Menunggu Konfirmasi";
  let statusClass = "warning";
  console.log("Params:", params.toString());
  
//   try {
//     const res = await fetch(`${url}/transaksi/status/${bill_no}`);
//     if (res.ok) {
//       const data = await res.json();
//       if (data.status === "00") {
//         statusPembayaran = "Pembayaran Berhasil";
//         statusClass = "success";
//       } else if (data.status === "01") {
//         statusPembayaran = "Pembayaran Gagal";
//         statusClass = "danger";
//       }
//     }
//   } catch (err) {
//     console.error("Gagal mengambil status pembayaran", err);
//   }

  app.innerHTML = `
    ${renderHeader(false)}
    <main class="py-5 mt-5">
      <div class="container mt-4">
        <h4 class="mb-4">Status Pembayaran</h4>
        <div class="card shadow border-0 rounded-3">
          <div class="card-body text-center p-5">
            <i class="bi bi-credit-card-2-front-fill text-${statusClass}" style="font-size: 4rem;"></i>
            <h3 class="mt-3 text-${statusClass}">${statusPembayaran}</h3>
            <p class="text-muted">Nomor Transaksi: <strong>${bill_no || "-"}</strong></p>
            <div class="mt-4">
              <a href="/dashboard" class="btn btn-outline-primary me-2">
                <i class="bi bi-house"></i> Kembali ke Dashboard
              </a>
              <a href="/campaign" class="btn btn-success">
                <i class="bi bi-collection"></i> Lihat Campaign
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;
}
