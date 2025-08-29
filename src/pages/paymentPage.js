import renderHeader from '../components/header.js';
import { url } from './conf/baseurl.js';

export default async function paymentPage(app) {
  window.scrollTo(0, 0);
  setPageTitle('Status Pembayaran');

  const params = new URLSearchParams(window.location.search);
  const bill_no = params.get("bill_no");
  let statusPembayaran = "Menunggu Konfirmasi";
  let statusClass = "warning";
  console.log("Params:", params.toString());
  let status = params.get("status");
  if (status === "success") {   
    statusPembayaran = "Pembayaran Berhasil";
    statusClass = "success";
  } else if (status === "failed") {
    statusPembayaran = "Pembayaran Gagal";
    statusClass = "danger";
  } else {
    statusPembayaran = "Menunggu Konfirmasi";
    statusClass = "warning";
  }

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
              <a href="/" class="btn btn-outline-primary me-2">
                <i class="bi bi-arrow-bar-left"></i> Kembali
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}
