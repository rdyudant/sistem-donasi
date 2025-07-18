import renderHeader from '../components/header.js';
import { url } from './conf/baseurl.js';
import { checkLogin } from './conf/auth.js';

export default async function colabolatorPage(app) {
  window.scrollTo(0, 0);
  setPageTitle('Dashboard Admin');
  const result = await checkLogin();
  if (result.status !== 200 || localStorage.getItem('token') == null) {
    console.log('token expired');
    window.location.href = '/';
    return;
  }
  const campaignId = window.location.pathname.split('/').pop();

  const res = await fetch(url + '/collab/'+campaignId, {
    method: 'GET',
    headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')  
            }
  });

  const respons = await res.json();
  const list = respons.data
  console.log(list)

  app.innerHTML = `
    ${renderHeader(false, true)}
    <main class="py-5 mt-5">
      <div class="container mt-2">
        <h2 class="mb-4 text-center">Kelola Data Collaborator</h2>
        <button type="button" id="btnKembali" class="btn btn-secondary">
          <i class="bi bi-arrow-left"></i> Kembali
        </button>
        <div class="p-2" />
        <div class="mb-3">
          <div class="row">
            <div class="col-sm-6">
              <form id="formCollaborator">
                <input type="hidden" id="campaignId" value="${ campaignId }"/>
                <div class="mb-3">
                  <label for="collabEmail" class="form-label">Masukkan Email Collaborator</label>
                  <input type="email" class="form-control" id="collabEmail" required>
                </div>
                <button type="submit" class="btn btn-primary">Tambah</button>
              </form>
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table table-bordered table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Judul</th>
                <th>User Collab</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${list.map((c, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${c.title}</td>
                  <td>${c.fullname}</td>
                  <td>
                    <div class="d-flex flex-wrap gap-1">
                      <a class="btn btn-sm btn-warning" href="/share-campaign/${c.id}">
                        <i class="bi bi-graph-up-arrow"></i> Statistik
                      </a>
                      <a class="btn btn-sm btn-danger" href="/collaborator/${c.id}">
                        <i class="bi bi-trash"></i> Delete
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
  `;

   // Event listener untuk tombol kembali
  document.getElementById('btnKembali').addEventListener('click', () => {
    history.back(); // kembali ke halaman sebelumnya
  });

  // Buka modal
  window.openCollaboratorModal = function () {
    const modal = new bootstrap.Modal(document.getElementById('collabModal'));
    modal.show();
  };
  window.addCollab = function () {
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

    
  }
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
      const res = await fetch(`${ url }/collab/`, {
        method: 'POST',
        headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token') 
           },
        body: JSON.stringify({ email: email, id_campaign: campaignId })
      });
      const respons = await res.json();
      console.log(respons)
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: respons.msg,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: respons.msg,
          text: respons.message || 'Terjadi kesalahan',
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
  });

  // Tambah event listener untuk tombol logout
  document.getElementById('btnLogout')?.addEventListener('click', logout);
}

function logout() {
  localStorage.clear()
  window.location.href = '/';
}

// Navigasi SPA
window.navigate = function (event, path) {
  event.preventDefault();
  history.pushState(null, '', `/${path}`);
  window.dispatchEvent(new Event('popstate'));
};