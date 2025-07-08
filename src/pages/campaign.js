export default async function campaignPage(app) {
  const campaigns = [
    {
      id: 1,
      title: "Bantu Renovasi Sekolah",
      description: "Ayo bantu renovasi sekolah di pelosok agar anak-anak bisa belajar dengan layak.",
      collected: "Rp 12.000.000",
      goal: "Rp 50.000.000",
      image: "https://picsum.photos/seed/sekolah/600/400"
    },
    {
      id: 2,
      title: "Donasi Kesehatan Balita",
      description: "Bantu biaya pengobatan balita yang menderita gizi buruk dan infeksi paru.",
      collected: "Rp 8.500.000",
      goal: "Rp 20.000.000",
      image: "https://picsum.photos/seed/kesehatan/600/400"
    },
    {
      id: 3,
      title: "Peduli Korban Bencana Alam",
      description: "Salurkan bantuan logistik dan medis untuk korban bencana alam.",
      collected: "Rp 25.000.000",
      goal: "Rp 100.000.000",
      image: "https://picsum.photos/seed/bencana/600/400"
    }
  ];

  app.innerHTML = `
    <!-- Hero Section -->
    <div class="py-5 mt-5">
      <div class="container text-center text-dark">
        <h2 class="display-4">Bersama #DonasiKita</h2>
        <p class="lead">Dukung mereka yang membutuhkan bantuan dengan berdonasi sekarang.</p>
        <!-- <a href="#" class="btn btn-warning btn-lg mt-3">Mulai Berdonasi</a> -->
      </div>
    </div>

    <!-- Campaign Section -->
    <section class="py-5">
      <div class="container">
        <h2 class="mb-4 text-center">Kampanye Donasi Terbaru</h2>
        <div class="row">
          ${campaigns.map(campaign => `
            <div class="col-md-4 mb-4">
              <div class="card h-100 shadow-sm">
                <img src="${campaign.image}" class="card-img-top" alt="${campaign.title}">
                <div class="card-body">
                  <h5 class="card-title">${campaign.title}</h5>
                  <p class="card-text">${campaign.description}</p>
                  <small>${campaign.collected} dari ${campaign.goal}</small>
                </div>
                <div class="card-footer bg-white border-top-0">
                  <a href="/campaign/${campaign.id}" onclick="navigate(event, 'campaign/${campaign.id}')" class="btn btn-outline-primary w-100">Donasi Sekarang</a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

window.navigate = function (event, path) {
  event.preventDefault();

  const url = path.startsWith('/') ? path : '/' + path;
  history.pushState(null, '', url);
  window.dispatchEvent(new Event('popstate'));
};