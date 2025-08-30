import renderHeader from '../components/header.js';
import renderFooter from '../components/footer.js';
import { url, formatRupiah } from './conf/baseurl.js';
import { checkLogin } from './conf/auth.js';

export default async function dashboardPage(app) {
  window.scrollTo(0, 0);
  setPageTitle('Dashboard');
  const result = await checkLogin();
  if (result.status !== 200 || localStorage.getItem('token') == null) {
    console.log('token expired');
    window.location.href = '/';
    return;
  }

  const user = await fetch(url + '/auth/get-user', {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')  
    }
  });

  const getRes = await user.json();
  const userData = getRes.data;

  const res = await fetch(url + `/campaign/campaign-active/${ userData.id }`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')  
    }
  });

  const respons = await res.json();
  const campaigns = respons.data;

  app.innerHTML = `
    <style>
      .dashboard-card-menu:hover {
        box-shadow: 0 0.5rem 1rem rgba(0,0,0,.15)!important;
        transform: translateY(-4px) scale(1.04);
        transition: all 0.2s;
        border: 1.5px solid #009e00ff;
      }
      
      .stats-card:hover {
        transform: translateY(-2px);
        transition: all 0.3s ease;
      }
      
      .activity-card {
        transition: all 0.2s ease;
      }
      
      .activity-card:hover {
        background-color: #f8f9fa;
      }
    </style>
    ${renderHeader(false, true)}
    <main class="py-5 mt-5">
      <div class="container mt-2">
        <!-- Welcome Section -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="text-center mb-4">
              <h2 class="fw-bold text-primary">Selamat Datang di Dashboard</h2>
              <p class="text-muted">Kelola campaign donasi Anda dengan mudah</p>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0">
                <h5 class="fw-bold mb-0">
                  <i class="bi bi-graph-up text-success me-2"></i>
                  Campaign Yang Sedang Berjalan
                </h5>
              </div>
              <div class="card-body">
                <div class="row">
                  ${ campaigns.length > 0 ? campaigns.map(campaign => `
                      <div class="col-md-4 mb-3">
                        <div class="border rounded p-3">
                          <h6 class="fw-bold">${ campaign.title }</h6>
                          <div class="progress mb-2" style="height: 8px;">
                            <div class="progress-bar bg-success" style="width: ${ campaign.persentase }%"></div>
                          </div>
                          <div class="d-flex justify-content-between">
                            <small class="text-muted">${ campaign.persentase }% tercapai</small>
                            <small class="fw-bold text-success">${ formatRupiah(campaign.total_donasi) } / ${ formatRupiah(campaign.target_amount) }</small>
                          </div>
                        </div>
                      </div>
                    `).join('') : '<p class="text-center">Tidak ada campaign yang sedang berjalan.</p>' }
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Menu Cards -->
        <div class="row mb-5">
          <div class="col-12">
            <h4 class="text-center mb-4 fw-bold">Menu Utama</h4>
            <div class="d-flex justify-content-center">
              <div class="d-flex flex-wrap gap-3 justify-content-center">
                <div class="d-flex flex-column align-items-center">
                  <a href="/list-campaign" class="text-decoration-none">
                    <div class="card dashboard-card-menu shadow-sm text-center p-3" style="min-width:120px; max-width:140px; background-color: #6eb7ffff;">
                      <div class="card-body p-2">
                        <i class="bi bi-search fs-1 mb-2" style="color: white;"></i>
                      </div>
                    </div>
                  </a>
                  <span class="mt-2 fw-semibold" style="font-size:.9rem;">Cari Campaign</span>
                </div>
                <div class="d-flex flex-column align-items-center">
                  <a href="/following-campaign" class="text-decoration-none">
                    <div class="card dashboard-card-menu shadow-sm text-center p-3" style="min-width:120px; max-width:140px; background-color: #bbff6eff;">
                      <div class="card-body p-2">
                        <i class="bi bi-people fs-1 mb-2" style="color: black;"></i>
                      </div>
                    </div>
                  </a>
                  <span class="mt-2 fw-semibold" style="font-size:.9rem;">Campaign Diikuti</span>
                </div>
                <div class="d-flex flex-column align-items-center">
                  <a href="/tambah-campaign" class="text-decoration-none">
                    <div class="card dashboard-card-menu shadow-sm text-center p-3" style="min-width:120px; max-width:140px; background-color: #fff56eff;">
                      <div class="card-body p-2">
                        <i class="bi bi-plus-circle fs-1 mb-2" style="color: black;"></i>
                      </div>
                    </div>
                  </a>
                  <span class="mt-2 fw-semibold" style="font-size:.9rem;">Buat Campaign</span>
                </div>
                <div class="d-flex flex-column align-items-center">
                  <a href="/campaignku" class="text-decoration-none">
                    <div class="card dashboard-card-menu shadow-sm text-center p-3" style="min-width:120px; max-width:140px; background-color: #e58080ff;">
                      <div class="card-body p-2">
                        <i class="bi bi-archive-fill fs-1 mb-2" style="color: black;"></i>
                      </div>
                    </div>
                  </a>
                  <span class="mt-2 fw-semibold" style="font-size:.9rem;">Campaign Ku</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity and Quick Actions -->
        <div class="row mb-4">
          <!-- Recent Activity -->
          <div class="col-md-8 mb-4">
              <div class="card shadow border-0 mt-4">
                <div class="card-header bg-light fw-bold">
                  Aktivitas Terbaru
                </div>
                <div class="card-body" id="recent-activity">
                  <p class="text-muted">Memuat aktivitas...</p>
                </div>
              </div>
          </div>

          <!-- Quick Actions -->
          <div class="col-md-4 mb-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-header bg-white border-0">
                <h5 class="fw-bold mb-0">
                  <i class="bi bi-lightning-charge text-warning me-2"></i>
                  Aksi Cepat
                </h5>
              </div>
              <div class="card-body">
                <div class="d-grid gap-2">
                  <button class="btn btn-outline-primary" onclick="location.href='/tambah-campaign'">
                    <i class="bi bi-plus-circle me-2"></i>
                    Buat Campaign Baru
                  </button>
                  <button class="btn btn-outline-success" onclick="location.href='/donatur'">
                    <i class="bi bi-people me-2"></i>
                    Lihat Data Donatur
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
  // load pertama kali
  await loadRecentActivity();

  // auto refresh setiap 5 detik
  setInterval(loadRecentActivity, 5000);
  document.getElementById('btnLogout')?.addEventListener('click', logout);
}

/* ---------------- PAGINATION ---------------- */
let activityData = [];
let currentPage = 1;
const itemsPerPage = 5;

async function loadRecentActivity() {
  try {
    const res = await fetch(url + '/campaign/activity', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });
    const data = await res.json();
    activityData = data.data || [];
    renderActivity();
  } catch (err) {
    console.error("Gagal ambil recent activity:", err);
  }
}

function renderActivity() {
  const container = document.getElementById('recent-activity');
  if (!container) return;

  if (activityData.length === 0) {
    container.innerHTML = '<p class="text-muted">Belum ada aktivitas.</p>';
    return;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = activityData.slice(startIndex, endIndex);

  const activityHTML = paginatedData.map(act => `
    <div class="activity-card border-bottom py-3">
      <div class="d-flex align-items-center">
        <div class="bg-success bg-opacity-10 rounded-circle p-2 me-3">
          <i class="bi bi-bell text-success"></i>
        </div>
        <div class="flex-grow-1">
          <p class="mb-1">
            Sdr/i <b>${act.cust_name}</b> telah berdonasi untuk
            <b><i>${act.title}</i></b> sebesar <i>${formatRupiah(act.bill_total)}</i>
          </p>
          <small class="text-muted">
            ${new Date(act.createdAt).toISOString().slice(0, 19).replace("T", " ")}
          </small>
        </div>
      </div>
    </div>
  `).join('');

  const totalPages = Math.ceil(activityData.length / itemsPerPage);
  let paginationHTML = `
    <nav aria-label="Page navigation" class="mt-3">
      <ul class="pagination justify-content-center">
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
          <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Prev</a>
        </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
    paginationHTML += `
      <li class="page-item ${currentPage === i ? 'active' : ''}">
        <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
      </li>
    `;
  }

  paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
          <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
        </li>
      </ul>
    </nav>
  `;

  container.innerHTML = activityHTML + paginationHTML;
}

window.changePage = function (page) {
  const totalPages = Math.ceil(activityData.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderActivity();
};

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
