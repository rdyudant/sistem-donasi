export default function detailCampaignPage(app) {
  const campaignId = window.location.pathname.split('/').pop();

  // Data dummy sementara (bisa nanti fetch berdasarkan ID)
  const campaign = {
    id: campaignId,
    title: "Bantu Renovasi Sekolah",
    available: "10.000.000",
    collected: "12.000.000",
    target: "50.000.000",
    percentage: 24,
    totalDonatur: 85,
    tanggal: "08 Juli 2025",
    deskripsi: "Kami mengajak Anda untuk berpartisipasi dalam program renovasi sekolah di daerah pelosok. Bantuan Anda sangat berarti."
  };

  app.innerHTML = `
    <main>
      <section class="py-5 mt-5">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-8">

              <h4 class="fw-semibold mb-3">${campaign.title}</h4>

              <div class="bg-white p-4 rounded shadow-sm mb-4">
                <div class="row">
                  <div class="col-md-6">
                    <p class="mb-1 text-muted">Donasi tersedia</p>
                    <h5 class="text-danger fw-bold">Rp${campaign.available}</h5>
                  </div>
                  <div class="col-md-6 text-end">
                    <p class="mb-1 text-muted">Donasi terkumpul</p>
                    <h5 class="text-primary fw-bold">Rp${campaign.collected}</h5>
                    <p class="mb-0">dari target <strong>Rp${campaign.target}</strong></p>
                  </div>
                </div>

                <div class="progress my-3" style="height: 8px;">
                  <div class="progress-bar bg-primary" role="progressbar" 
                       style="width: ${campaign.percentage}%"
                       aria-valuenow="${campaign.percentage}"
                       aria-valuemin="0" aria-valuemax="100"></div>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <i class="bi bi-heart-fill text-danger"></i> ${campaign.totalDonatur} Donasi
                  </div>
                  <div>
                    <a href="#" class="text-decoration-none">
                      <i class="bi bi-file-earmark-text"></i> Rincian penggunaan dana
                    </a>
                  </div>
                </div>

                <div class="alert alert-info mt-3 mb-0">
                  Semakin banyak donasi yang tersedia, semakin besar bantuan yang bisa disalurkan oleh gerakan ini.
                </div>
              </div>

              <div class="bg-white p-4 rounded shadow-sm mb-4">
                <p class="text-muted mb-1">${campaign.tanggal}</p>
                <h5 class="fw-semibold mb-3">Cerita Penggalangan Dana</h5>
                <p>${campaign.deskripsi}</p>
              </div>

              <!-- <div class="d-flex gap-2">
                <a href="#" class="btn btn-outline-primary w-50"><i class="bi bi-share"></i> Bagikan</a>
                <a href="/donasi/${campaign.id}/form" class="btn btn-danger w-50">Donasi Sekarang</a>
              </div> -->

            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}