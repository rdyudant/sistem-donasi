import renderHeader from '../components/header.js';
import renderFooter from '../components/footer.js';
import { url } from './conf/baseurl.js';
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

  const res = await fetch(url + '/campaign/daftar-campaign', {
    method: 'GET',
    headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')  
            }
  });

  const respons = await res.json();
  const campaigns = respons.data
  console.log(campaigns)

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
          <div class="col-md-3 mb-3">
            <div class="card border-0 shadow-sm stats-card h-100">
              <div class="card-body text-center">
                <div class="text-primary mb-2">
                  <i class="bi bi-bar-chart fs-1"></i>
                </div>
                <h4 class="fw-bold text-success">152</h4>
                <p class="text-muted mb-0">Total Campaign</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="card border-0 shadow-sm stats-card h-100">
              <div class="card-body text-center">
                <div class="text-info mb-2">
                  <i class="bi bi-people fs-1"></i>
                </div>
                <h4 class="fw-bold text-success">1,247</h4>
                <p class="text-muted mb-0">Total Donatur</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="card border-0 shadow-sm stats-card h-100">
              <div class="card-body text-center">
                <div class="text-warning mb-2">
                  <i class="bi bi-currency-dollar fs-1"></i>
                </div>
                <h4 class="fw-bold text-success">Rp 45.2M</h4>
                <p class="text-muted mb-0">Total Donasi</p>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="card border-0 shadow-sm stats-card h-100">
              <div class="card-body text-center">
                <div class="text-success mb-2">
                  <i class="bi bi-check-circle fs-1"></i>
                </div>
                <h4 class="fw-bold text-success">98</h4>
                <p class="text-muted mb-0">Campaign Aktif</p>
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
            <div class="card border-0 shadow-sm h-100">
              <div class="card-header bg-white border-0">
                <h5 class="fw-bold mb-0">
                  <i class="bi bi-clock-history text-primary me-2"></i>
                  Aktivitas Terbaru
                </h5>
              </div>
              <div class="card-body">
                <div class="activity-card border-bottom py-3">
                  <div class="d-flex align-items-center">
                    <div class="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                      <i class="bi bi-plus-circle text-success"></i>
                    </div>
                    <div class="flex-grow-1">
                      <p class="mb-1">Campaign baru "Bantu Pendidikan Anak Yatim" telah dibuat</p>
                      <small class="text-muted">2 jam yang lalu</small>
                    </div>
                  </div>
                </div>
                <div class="activity-card border-bottom py-3">
                  <div class="d-flex align-items-center">
                    <div class="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                      <i class="bi bi-heart-fill text-info"></i>
                    </div>
                    <div class="flex-grow-1">
                      <p class="mb-1">Donasi baru sebesar Rp 500.000 diterima</p>
                      <small class="text-muted">5 jam yang lalu</small>
                    </div>
                  </div>
                </div>
                <div class="activity-card border-bottom py-3">
                  <div class="d-flex align-items-center">
                    <div class="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                      <i class="bi bi-star-fill text-warning"></i>
                    </div>
                    <div class="flex-grow-1">
                      <p class="mb-1">Campaign "Bantuan Korban Bencana" mencapai 75% target</p>
                      <small class="text-muted">1 hari yang lalu</small>
                    </div>
                  </div>
                </div>
                <div class="activity-card py-3">
                  <div class="d-flex align-items-center">
                    <div class="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                      <i class="bi bi-check-circle text-primary"></i>
                    </div>
                    <div class="flex-grow-1">
                      <p class="mb-1">Campaign "Masjid Al-Ikhlas" telah selesai dan mencapai target</p>
                      <small class="text-muted">2 hari yang lalu</small>
                    </div>
                  </div>
                </div>
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
                  <button class="btn btn-outline-info" onclick="location.href='/laporan'">
                    <i class="bi bi-file-earmark-text me-2"></i>
                    Unduh Laporan
                  </button>
                  <button class="btn btn-outline-warning" onclick="location.href='/pengaturan'">
                    <i class="bi bi-gear me-2"></i>
                    Pengaturan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Campaign Progress -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-white border-0">
                <h5 class="fw-bold mb-0">
                  <i class="bi bi-graph-up text-success me-2"></i>
                  Campaign Populer
                </h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <div class="border rounded p-3">
                      <h6 class="fw-bold">Bantu Pendidikan Anak Yatim</h6>
                      <div class="progress mb-2" style="height: 8px;">
                        <div class="progress-bar bg-success" style="width: 85%"></div>
                      </div>
                      <div class="d-flex justify-content-between">
                        <small class="text-muted">85% tercapai</small>
                        <small class="fw-bold text-success">Rp 8.5M / 10M</small>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 mb-3">
                    <div class="border rounded p-3">
                      <h6 class="fw-bold">Bantuan Korban Bencana Alam</h6>
                      <div class="progress mb-2" style="height: 8px;">
                        <div class="progress-bar bg-warning" style="width: 65%"></div>
                      </div>
                      <div class="d-flex justify-content-between">
                        <small class="text-muted">65% tercapai</small>
                        <small class="fw-bold text-warning">Rp 6.5M / 10M</small>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 mb-3">
                    <div class="border rounded p-3">
                      <h6 class="fw-bold">Renovasi Masjid Al-Ikhlas</h6>
                      <div class="progress mb-2" style="height: 8px;">
                        <div class="progress-bar bg-info" style="width: 45%"></div>
                      </div>
                      <div class="d-flex justify-content-between">
                        <small class="text-muted">45% tercapai</small>
                        <small class="fw-bold text-info">Rp 4.5M / 10M</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
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