import renderHeader from '../components/header.js';
import renderFooter from '../components/footer.js';
import { url, url_images } from './conf/baseurl.js';

export default async function campaignPage(app) {
  setPageTitle('Campaign');
  const res = await fetch(url + '/campaign/daftar-index', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  const respons = await res.json();
  let campaigns = respons.data; // simpan data asli

  // Function to calculate progress percentage
  const calculateProgress = (collected, goal) => {
    return Math.round((collected / goal) * 100);
  };

  // Function to format number to Indonesian currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Function to get category badge color
  const getCategoryColor = (category) => {
    const colors = {
      'Pendidikan': 'bg-primary',
      'Religi': 'bg-success',
      'Sosial': 'bg-danger',
      'Medis': 'bg-warning',
      'Lainnya': 'bg-secondary',
    };
    return colors[category] || 'bg-secondary';
  };

  // Function render campaigns
  const renderCampaigns = (list) => {
    return list.map(campaign => {
      const progress = calculateProgress(campaign.collected_amount, campaign.target_amount);
      const categoryColor = getCategoryColor(campaign.category);

      return `
        <div class="col-lg-4 col-md-6">
          <div class="card h-100 shadow-sm border-0 overflow-hidden campaign-card">
            <div class="position-relative">
              <img src="${url_images}${campaign.image_thumb}" class="card-img-top" alt="${campaign.title}" style="height: 250px; object-fit: cover;">
              <div class="position-absolute top-0 start-0 m-3">
                <span class="badge ${categoryColor} px-3 py-2">${campaign.category}</span>
              </div>
            </div>
            
            <div class="card-body p-4">
              <h5 class="card-title fw-bold mb-3">${campaign.title}</h5>
              <p class="card-text text-muted mb-4">${campaign.description}</p>
              
              <!-- Progress Section -->
              <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="fw-bold text-primary">${formatCurrency(campaign.collected_amount)}</span>
                  <span class="text-muted">${progress}%</span>
                </div>
                <div class="progress mb-2" style="height: 8px;">
                  <div class="progress-bar bg-primary" role="progressbar" style="width: ${progress}%" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <div class="d-flex justify-content-between">
                  <small class="text-muted">Target: ${formatCurrency(campaign.target_amount)}</small>
                </div>
              </div>
            </div>
            
            <div class="card-footer bg-white border-0 p-4 pt-0">
              <div class="d-grid gap-2">
                <a href="/campaign/${btoa(campaign.id)}" onclick="navigate(event, 'campaign/${btoa(campaign.id)}')" class="btn btn-primary btn-sm">
                  Lihat Detail
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  app.innerHTML = `
    ${renderHeader(true)}

    <!-- Hero -->
    <div class="py-5 mt-5 position-relative overflow-hidden">
      <div class="container text-center text-dark position-relative">
        <div class="row justify-content-center">
          <div class="col-lg-8 mt-4">
            <h1 class="display-4 fw-bold mb-4">Bersama #DonasiKita</h1>
            <p class="lead mb-4 fs-5">Dukung mereka yang membutuhkan bantuan dengan berdonasi sekarang. Setiap rupiah yang Anda sumbangkan akan membuat perbedaan nyata.</p>
            <div class="d-flex justify-content-center gap-4 mb-4">
            </div>
          </div>
        </div>
      </div>
      <!-- Decorative elements -->
      <div class="position-absolute top-0 end-0 translate-middle-y opacity-25">
        <div class="bg-primary rounded-circle" style="width: 200px; height: 200px;"></div>
      </div>
      <div class="position-absolute bottom-0 start-0 translate-middle-y opacity-25">
        <div class="bg-warning rounded-circle" style="width: 150px; height: 150px;"></div>
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-lg-8 mx-auto text-center">
        <div class="bg-primary rounded-4 p-5 text-white">
          <h3 class="fw-bold mb-3">Ingin Membuat Kampanye Sendiri?</h3>
          <p class="mb-4">Bergabunglah dengan ribuan orang yang telah membantu sesama melalui platform kami.</p>
          <a href="/signup" class="btn btn-light btn-lg fw-bold px-5">
            <i class="fas fa-plus me-2"></i>Buat Kampanye
          </a>
        </div>
      </div>
    </div>

    <!-- Campaign Section -->
    <section class="py-5 bg-light">
      <div class="container">

        <!-- Search -->
        <div class="row mb-4">
          <div class="col-lg-6 mx-auto">
            <input type="text" id="searchCampaign" class="form-control form-control-lg" placeholder="Cari kampanye berdasarkan judul atau kategori...">
          </div>
        </div>

        <div class="row mb-5">
          <div class="col-lg-8 mx-auto text-center">
            <h2 class="display-5 fw-bold mb-3">Kampanye Donasi Terbaru</h2>
            <p class="lead text-muted">Pilih kampanye yang ingin Anda dukung.</p>
          </div>
        </div>
        
        <div class="row g-4" id="campaignList">
          ${renderCampaigns(campaigns)}
        </div>
      </div>
    </section>

    ${renderFooter()}
  `;

  // Search functionality
  document.getElementById("searchCampaign").addEventListener("input", function(e) {
    const keyword = e.target.value.toLowerCase();
    const filtered = campaigns.filter(c =>
      c.title.toLowerCase().includes(keyword) ||
      c.category.toLowerCase().includes(keyword) ||
      c.description.toLowerCase().includes(keyword)
    );
    document.getElementById("campaignList").innerHTML = renderCampaigns(filtered);
  });

  document.getElementById('btnLogout')?.addEventListener('click', logout);
  function logout() {
    localStorage.clear()
    window.location.href = '/';
  }
}

window.navigate = function (event, path) {
  event.preventDefault();
  const url = path.startsWith('/') ? path : '/' + path;
  history.pushState(null, '', url);
  window.dispatchEvent(new Event('popstate'));
};