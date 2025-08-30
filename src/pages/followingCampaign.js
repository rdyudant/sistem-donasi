import renderHeader from '../components/header.js';
import { url, formatRupiah } from './conf/baseurl.js';
import { checkLogin } from './conf/auth.js';

export default async function followingCampaignPage(app) {
  window.scrollTo(0, 0);
  setPageTitle('Dashboard Admin');
  const result = await checkLogin();
  if (result.status !== 200 || localStorage.getItem('token') == null) {
    console.log('token expired');
    window.location.href = '/';
    return;
  }
  const campaignId = window.location.pathname.split('/').pop();

  const res = await fetch(url + '/campaign/daftar-follow-campaign', {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')  
    }
  });

  const respons = await res.json();
  const list = respons.data || [];
  const id_user = respons.id_user || null;
  console.log(list);

  app.innerHTML = `
    ${renderHeader(false, true)}
    <main class="py-5 mt-5">
      <div class="container mt-2">
        <h5 class="mb-4">Campaign yang ikuti</h5>
        <span><i class="bi bi-house-fill"></i> <a href="/dashboard">Dashboard</a> / <strong>Campaign yang ikuti</strong></span>
        <hr>
        <span class="text-muted mb-3">Berikut adalah daftar campaign yang Anda ikuti.</span>
        <div class="p-2"></div>
        <div class="table-responsive">
          <table id="followingCampaignTable" class="table table-bordered table-hover align-middle display nowrap" style="width:100%">
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
              ${list.map((c, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${c.title}</td>
                  <td>${formatRupiah(c.total_donasi)}</td>
                  <td>${formatRupiah(c.target_amount)}</td>
                  <td>${c.status}</td>
                  <td>
                    <div class="d-flex flex-wrap gap-1">
                      <a target="#blank" class="btn btn-sm btn-success" href="/share-campaign?id_campaign=${c.id}">
                        <i class="bi bi-share-fill"></i> Bagikan
                      </a>
                      <a class="btn btn-sm btn-warning" href="/statistik?id=${ id_user }&id_campaign=${c.id}">
                        <i class="bi bi-graph-up-arrow"></i> Statistik
                      </a>
                      <!-- <a class="btn btn-sm btn-danger" href="#">
                        <i class="bi bi-trash"></i> keluar dari campaign
                      </a>-->
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

  // Inisialisasi DataTable setelah render
  setTimeout(() => {
    if (window.followingCampaignTableInstance) {
      window.followingCampaignTableInstance.destroy();
      $('#followingCampaignTable').removeClass('dataTable');
    }
    window.followingCampaignTableInstance = $('#followingCampaignTable').DataTable({
      scrollX: true,
      paging: true,
      pageLength: 10,
      lengthChange: true,
      info: true,
      searching: true,
      order: [[0, "asc"]]
    });
  }, 0);

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