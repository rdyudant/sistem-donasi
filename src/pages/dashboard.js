import renderHeader from '../components/header.js';
import renderFooter from '../components/footer.js';
import { url } from './conf/baseurl.js';
import { checkLogin } from './conf/auth.js';

export default async function dashboardPage(app) {
  setPageTitle('Dashboard Admin');
  const result = await checkLogin();
    if (result.status !== 200) {
      console.log('token expired');
      history.pushState(null, '', '/');
      // Swal.fire({
      //   icon: 'warning',
      //   title: 'Sesi Berakhir!',
      //   text: 'Silakan login kembali.',
      //   timer: 3000,
      //   showConfirmButton: false
      // });
      // setTimeout(() => {
      //   window.location.href = '/';
      // }, 1000);
      return;
    }
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
    ${renderHeader(false, true)}
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
                    <div class="d-flex flex-wrap gap-2">
                      <a class="btn btn-sm btn-primary" href="/edit-campaign/${c.id}">
                        <i class="bi bi-pencil"></i> Edit
                      </a>
                      <a class="btn btn-sm btn-warning" href="/share-campaign/${c.id}">
                        <i class="bi bi-share"></i> Share
                      </a>
                      <a class="btn btn-sm btn-dark" onclick="openCollaboratorModal(${c.id})">
                        <i class="bi bi-person"></i> Collaborator
                      </a>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </main>
    <!-- Modal Collaborator -->
    <div class="modal fade" id="collabModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <form id="formCollaborator" class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Tambah Kolaborator</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <input type="hidden" id="campaignId" />
            <div class="mb-3">
              <label for="collabEmail" class="form-label">Masukkan Email Tujuan</label>
              <input type="email" class="form-control" id="collabEmail" required>
            </div>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn btn-primary">Tambah</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
          </div>
        </form>
      </div>
    </div>
    ${renderFooter()}
  `;

  let currentCampaignId = null;

  // Buka modal
  window.openCollaboratorModal = function (id) {
    currentCampaignId = id;
    document.getElementById('campaignId').value = id;
    document.getElementById('collabEmail').value = '';

    const modal = new bootstrap.Modal(document.getElementById('collabModal'));
    modal.show();
  };

  // Submit email kolaborator
  document.getElementById('formCollaborator').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('collabEmail').value;
    const campaignId = document.getElementById('campaignId').value;

    if (!email) return;

    // Validasi format email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Email tidak valid',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    // Simulasi kirim data
    try {
      const res = await fetch(`http://localhost:3000/api/campaigns/${campaignId}/collaborators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Kolaborator ditambahkan!',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        const err = await res.json();
        Swal.fire({
          icon: 'error',
          title: 'Gagal menambahkan',
          text: err.message || 'Terjadi kesalahan',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal koneksi ke server',
        timer: 2000,
        showConfirmButton: false
      });
    }

    bootstrap.Modal.getInstance(document.getElementById('collabModal')).hide();
  });

  // Tambah event listener untuk tombol logout
  document.getElementById('btnLogout')?.addEventListener('click', logout);
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}