import renderHeader from '../components/header.js';
import renderFooter from '../components/footer.js';
import { url } from './conf/baseurl.js';
import { checkLogin } from './conf/auth.js';

export default async function shareCampaignPage(app) {
  window.scrollTo(0, 0);
  const result = await checkLogin();
    if (result.status !== 200 || localStorage.getItem('token') == null) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesi Berakhir!',
        text: 'Silakan login kembali.',
        timer: 3000,
        showConfirmButton: false
      });
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
      return;
    }

  const campaignId = window.location.pathname.split('/').pop();

  // Data dummy sementara (bisa nanti fetch berdasarkan ID)
  const campaign = {
    id: campaignId,
    title: "Bantu Renovasi Sekolah",
    available: "10000000",
    collected: "12000000",
    target: "50000000",
    image: "https://picsum.photos/seed/sekolah/600/400",
    percentage: 24,
    totalDonatur: 85,
    tanggal: "08 Juli 2025",
    deskripsi: "Kami mengajak Anda untuk berpartisipasi dalam program renovasi sekolah di daerah pelosok. Bantuan Anda sangat berarti."
  };
  const persentase = Math.round((campaign.collected / campaign.target) * 100);

  setPageTitle(`${campaign.title}`);
  app.innerHTML = `
    ${renderHeader(true)} <!-- pakai button -->
    <main>

      <!-- Hero Section dengan Background Gambar -->
      <section class="position-relative" style="height: 320px; background-image: url('${campaign.image}'); background-size: cover; background-position: center;">
        <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"></div>
        <div class="container h-100 d-flex flex-column justify-content-center text-white position-relative">
          <h1 class="fw-bold">${campaign.title}</h1>
          <p class="lead">Bantu wujudkan harapan mereka melalui kontribusi Anda.</p>
        </div>
      </section>

      <!-- Konten Detail -->
      <section class="py-5">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-8">
              <div class="mb-3">
                <button type="button" id="btnKembali" class="btn btn-secondary">
                  <i class="bi bi-arrow-left"></i> Kembali
                </button>
              </div>

              <!-- Info Donasi -->
              <div class="bg-white p-4 rounded shadow-sm mb-4">
                <div class="row align-items-center mb-2">
                  <div class="col-md-6">
                    <p class="mb-1 text-muted">Donasi terkumpul</p>
                    <h5 class="text-danger fw-bold">Rp${campaign.collected}</h5>
                  </div>
                  <div class="col-md-6 text-md-end text-start">
                    <p class="mb-1 text-muted">Target donasi</p>
                    <h5 class="text-primary fw-bold">Rp${campaign.target}</h5>
                  </div>
                </div>

                <!-- Label persentase -->
                <p class="text-center mb-1 small fw-semibold text-muted">${persentase}% dari target tercapai</p>

                <!-- Progress bar -->
                <div class="progress mb-3" style="height: 14px; border-radius: 10px;">
                  <div class="progress-bar bg-primary" role="progressbar"
                    style="width: ${persentase}%;"
                    aria-valuenow="${persentase}" aria-valuemin="0" aria-valuemax="100">
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <i class="bi bi-heart-fill text-danger"></i> ${campaign.totalDonatur} Donasi
                  </div>
                  <!-- <div>
                    <a href="#" class="text-decoration-none">
                      <i class="bi bi-file-earmark-text"></i> Rincian penggunaan dana
                    </a>
                  </div> -->
                </div>

                <div class="alert alert-info mt-3 mb-0">
                  Semakin banyak donasi yang tersedia, semakin besar bantuan yang bisa disalurkan oleh gerakan ini.
                </div>
              </div>

              <!-- Cerita -->
              <div class="bg-white p-4 rounded shadow-sm mb-4">
                <p class="text-muted mb-1">${campaign.tanggal}</p>
                <h5 class="fw-semibold mb-3">Cerita Penggalangan Dana</h5>
                <p>${campaign.deskripsi}</p>
              </div>

              <!-- Tombol CTA -->
              <div class="d-flex gap-2">
                <a href="#" class="btn btn-outline-primary w-50"><i class="bi bi-share"></i> Bagikan</a>
                <a href="/donasi/${campaign.id}/form" class="btn btn-danger w-50">Donasi Sekarang</a>
              </div>

            </div>
          </div>
        </div>
      </section>

    </main>
    ${renderFooter()}
  `;

  // Event listener untuk tombol kembali
  document.getElementById('btnKembali').addEventListener('click', () => {
    history.back(); // kembali ke halaman sebelumnya
  });
}