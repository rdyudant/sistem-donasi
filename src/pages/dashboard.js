import renderHeader from '../components/header.js';
import renderFooter from '../components/footer.js';
import { url } from './conf/baseurl.js';
import { checkLogin } from './conf/auth.js';

document.addEventListener('DOMContentLoaded', async () => {
    const result = await checkLogin();
    if (result.success !== true) {
      console.log('token expired')
      history.pushState(null, '', '/login');
    }
});

export default function dashboardPage(app) {
    
  setPageTitle('Dashboard Admin');
  const campaigns = [
    {
      id: 1,
      title: "Bantu Renovasi Sekolah",
      goal: "50.000.000",
      collected: "12.000.000",
      status: "active"
    },
    {
      id: 2,
      title: "Donasi Kesehatan Balita",
      goal: "20.000.000",
      collected: "8.500.000",
      status: "closed"
    }
  ];

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'active':
        return 'success';
      case 'closed':
        return 'danger';
      case 'cancelled':
        return 'danger';
      case 'draft':
      default:
        return 'secondary';
    }
  }

  app.innerHTML = `
    ${renderHeader(false)} <!-- tidak pakai button -->
    <main class="py-5 mt-5">
      <div class="container">
        <h2 class="mb-4 text-center">Kelola Data Campaign</h2>
        <div class="text-end mb-3">
          <a href="/tambah-campaign" class="btn btn-success" id="btnTambah">
            <i class="bi bi-plus-circle"></i> Tambah Campaign
          </a>
        </div>
        <div class="table-responsive">
          <table class="table table-bordered table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Judul</th>
                <th>Terkumpul</th>
                <th>Target</th>
                <th>Status</th>
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
                    <span class="badge bg-${getStatusBadgeClass(c.status)}">${c.status}</span>
                  </td>
                  <td>
                    <a class="btn btn-sm btn-primary me-1" href="/edit-campaign/${c.id}">Edit</a>
                    <button class="btn btn-sm btn-danger" onclick="deleteCampaign(${c.id})">Hapus</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;
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
