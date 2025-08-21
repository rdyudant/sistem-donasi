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
    </style>
    ${renderHeader(false, true)}
    <main class="py-5 mt-5">
      <div class="container mt-2">
        <h2 class="mb-4 text-center">Selamat Datang di Dashboard</h2>

        <!-- Grid Card Menu (label di bawah card, center, padding rapat, efek hover) -->
        <div class="d-flex justify-content-center mb-3">
          <div class="d-flex flex-wrap gap-2">
            <div class="d-flex flex-column align-items-center">
              <a href="/list-campaign" class="text-decoration-none">
                <div class="card dashboard-card-menu shadow-sm text-center p-2" style="min-width:110px; max-width:130px; background-color: #6eb7ffff;">
                  <div class="card-body p-2">
                    <i class="bi bi-search fs-2 mb-1" style="color: white;"></i>
                  </div>
                </div>
              </a>
              <span class="mt-1" style="font-size:.8rem;">Cari Campaign</span>
            </div>
            <div class="d-flex flex-column align-items-center">
              <a href="/following-campaign" class="text-decoration-none">
                <div class="card dashboard-card-menu shadow-sm text-center p-2" style="min-width:110px; max-width:130px; background-color: #bbff6eff;">
                  <div class="card-body p-2">
                    <i class="bi bi-people fs-2 mb-1" style="color: black;"></i>
                  </div>
                </div>
              </a>
              <span class="mt-1" style="font-size:.8rem;">Campaign Diikuti</span>
            </div>
            <div class="d-flex flex-column align-items-center">
              <a href="/tambah-campaign" class="text-decoration-none">
                <div class="card dashboard-card-menu shadow-sm text-center p-2" style="min-width:110px; max-width:130px; background-color: #fff56eff;">
                  <div class="card-body p-2">
                    <i class="bi bi-plus-circle fs-2 mb-1" style="color: black;"></i>
                  </div>
                </div>
              </a>
              <span class="mt-1" style="font-size:.8rem;">Buat Campaign</span>
            </div>
            <div class="d-flex flex-column align-items-center">
              <a href="/campaignku" class="text-decoration-none">
                <div class="card dashboard-card-menu shadow-sm text-center p-2" style="min-width:110px; max-width:130px; background-color: #e58080ff;">
                  <div class="card-body p-2">
                    <i class="bi bi-archive-fill fs-2 mb-1" style="color: black;"></i>
                  </div>
                </div>
              </a>
              <span class="mt-1" style="font-size:.8rem;">Campaign Ku</span>
            </div>
          </div>
        </div>
        <!-- End Grid Card Menu -->
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