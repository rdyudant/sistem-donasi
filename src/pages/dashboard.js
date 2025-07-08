// src/pages/dashboard.js
export default function dashboardPage(app) {
  const campaigns = [
    {
      id: 1,
      title: "Bantu Renovasi Sekolah",
      goal: "50.000.000",
      collected: "12.000.000"
    },
    {
      id: 2,
      title: "Donasi Kesehatan Balita",
      goal: "20.000.000",
      collected: "8.500.000"
    }
  ];

  toggleSearchBar(false); // Sembunyikan search bar di dashboard
  app.innerHTML = `
    <main class="py-5 mt-5">
      <div class="container">
        <h2 class="mb-4 text-center">Dashboard Admin - Data Campaign</h2>
        <div class="text-end mb-3">
          <button class="btn btn-success" id="btnTambah">+ Tambah Campaign</button>
        </div>
        <div class="table-responsive">
          <table class="table table-bordered table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Judul</th>
                <th>Terkumpul</th>
                <th>Target</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${campaigns.map((c, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${c.title}</td>
                  <td>Rp ${c.collected}</td>
                  <td>Rp ${c.goal}</td>
                  <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="editCampaign(${c.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCampaign(${c.id})">Hapus</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  `;

  // Sementara: handler tombol Tambah
  document.getElementById('btnTambah').addEventListener('click', () => {
    alert('Form tambah campaign belum dibuat!');
  });
}

// Dummy action (nanti ganti pakai modal/form dinamis)
window.editCampaign = function (id) {
  alert(`Edit campaign ID: ${id}`);
};

window.deleteCampaign = function (id) {
  const konfirmasi = confirm(`Yakin ingin menghapus campaign ID ${id}?`);
  if (konfirmasi) {
    alert(`Campaign ${id} dihapus (simulasi)`);
  }
};
