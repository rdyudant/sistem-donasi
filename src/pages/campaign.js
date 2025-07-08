export default async function campaignPage(app) {
  const campaigns = [
    {
      id: 1,
      title: "Bantu Renovasi Sekolah",
      description: "Ayo bantu renovasi sekolah di pelosok agar anak-anak bisa belajar dengan layak.",
      collected: "Rp 12.000.000",
      goal: "Rp 50.000.000",
      collectedAmount: 12000000,
      goalAmount: 50000000,
      image: "https://picsum.photos/seed/sekolah/600/400",
      category: "Pendidikan",
      daysLeft: 45,
      donors: 156
    },
    {
      id: 2,
      title: "Donasi Kesehatan Balita",
      description: "Bantu biaya pengobatan balita yang menderita gizi buruk dan infeksi paru.",
      collected: "Rp 8.500.000",
      goal: "Rp 20.000.000",
      collectedAmount: 8500000,
      goalAmount: 20000000,
      image: "https://picsum.photos/seed/kesehatan/600/400",
      category: "Kesehatan",
      daysLeft: 30,
      donors: 89
    },
    {
      id: 3,
      title: "Peduli Korban Bencana Alam",
      description: "Salurkan bantuan logistik dan medis untuk korban bencana alam.",
      collected: "Rp 25.000.000",
      goal: "Rp 100.000.000",
      collectedAmount: 25000000,
      goalAmount: 100000000,
      image: "https://picsum.photos/seed/bencana/600/400",
      category: "Bencana",
      daysLeft: 60,
      donors: 324
    }
  ];

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
      'Kesehatan': 'bg-success',
      'Bencana': 'bg-danger'
    };
    return colors[category] || 'bg-secondary';
  };

  app.innerHTML = `
    <!-- Hero Section with Gradient Background -->
    <div class="py-5 mt-5 position-relative overflow-hidden">
      <div class="container text-center text-dark position-relative">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <h1 class="display-4 fw-bold mb-4">Bersama #DonasiKita</h1>
            <p class="lead mb-4 fs-5">Dukung mereka yang membutuhkan bantuan dengan berdonasi sekarang. Setiap rupiah yang Anda sumbangkan akan membuat perbedaan nyata.</p>
            <div class="d-flex justify-content-center gap-4 mb-4">
              <div class="text-center">
                <h3 class="fw-bold text-primary mb-0">500+</h3>
                <small class="text-muted">Donatur</small>
              </div>
              <div class="text-center">
                <h3 class="fw-bold text-success mb-0">45M+</h3>
                <small class="text-muted">Terkumpul</small>
              </div>
              <div class="text-center">
                <h3 class="fw-bold text-warning mb-0">15</h3>
                <small class="text-muted">Kampanye</small>
              </div>
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

    <!-- Campaign Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row mb-5">
          <div class="col-lg-8 mx-auto text-center">
            <h2 class="display-5 fw-bold mb-3">Kampanye Donasi Terbaru</h2>
            <p class="lead text-muted">Pilih kampanye yang ingin Anda dukung dan berikan kontribusi terbaik Anda untuk mereka yang membutuhkan.</p>
          </div>
        </div>
        
        <div class="row g-4">
          ${campaigns.map(campaign => {
            const progress = calculateProgress(campaign.collectedAmount, campaign.goalAmount);
            const categoryColor = getCategoryColor(campaign.category);
            
            return `
              <div class="col-lg-4 col-md-6">
                <div class="card h-100 shadow-sm border-0 overflow-hidden campaign-card">
                  <div class="position-relative">
                    <img src="${campaign.image}" class="card-img-top" alt="${campaign.title}" style="height: 250px; object-fit: cover;">
                    <div class="position-absolute top-0 start-0 m-3">
                      <span class="badge ${categoryColor} px-3 py-2">${campaign.category}</span>
                    </div>
                    <div class="position-absolute top-0 end-0 m-3">
                      <div class="bg-white rounded-pill px-3 py-1 shadow-sm">
                        <small class="fw-bold text-dark">${campaign.daysLeft} hari lagi</small>
                      </div>
                    </div>
                  </div>
                  
                  <div class="card-body p-4">
                    <h5 class="card-title fw-bold mb-3">${campaign.title}</h5>
                    <p class="card-text text-muted mb-4">${campaign.description}</p>
                    
                    <!-- Progress Section -->
                    <div class="mb-4">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="fw-bold text-primary">${formatCurrency(campaign.collectedAmount)}</span>
                        <span class="text-muted">${progress}%</span>
                      </div>
                      <div class="progress mb-2" style="height: 8px;">
                        <div class="progress-bar bg-primary" role="progressbar" style="width: ${progress}%" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      <div class="d-flex justify-content-between">
                        <small class="text-muted">Target: ${formatCurrency(campaign.goalAmount)}</small>
                        <small class="text-muted">${campaign.donors} donatur</small>
                      </div>
                    </div>
                  </div>
                  
                  <div class="card-footer bg-white border-0 p-4 pt-0">
                    <div class="d-grid gap-2">
                      <a href="/campaign/${campaign.id}" onclick="navigate(event, 'campaign/${campaign.id}')" class="btn btn-primary btn-sm">
                        Lihat Detail
                      </a>
                      <!-- <button class="btn btn-outline-secondary btn-sm" onclick="shareCampaign(${campaign.id})">
                        <i class="fas fa-share-alt me-1"></i>Bagikan
                      </button> -->
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        
        <!-- Call to Action -->
        <div class="row mt-5">
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
      </div>
    </section>

    <!-- Trust Section -->
    <section class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-10 mx-auto">
            <div class="row g-4 text-center">
              <div class="col-md-3 col-sm-6">
                <div class="p-4">
                  <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                    <i class="fas fa-shield-alt fa-2x text-white"></i>
                  </div>
                  <h6 class="fw-bold">Aman & Terpercaya</h6>
                  <small class="text-muted">Platform donasi terpercaya dengan sistem keamanan tinggi</small>
                </div>
              </div>
              <div class="col-md-3 col-sm-6">
                <div class="p-4">
                  <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                    <i class="fas fa-chart-line fa-2x text-success"></i>
                  </div>
                  <h6 class="fw-bold">Transparan</h6>
                  <small class="text-muted">Laporan penggunaan dana yang jelas dan transparan</small>
                </div>
              </div>
              <div class="col-md-3 col-sm-6">
                <div class="p-4">
                  <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                    <i class="fas fa-clock fa-2x text-warning"></i>
                  </div>
                  <h6 class="fw-bold">Cepat</h6>
                  <small class="text-muted">Proses donasi yang mudah dan cepat</small>
                </div>
              </div>
              <div class="col-md-3 col-sm-6">
                <div class="p-4">
                  <div class="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                    <i class="fas fa-users fa-2x text-info"></i>
                  </div>
                  <h6 class="fw-bold">Komunitas</h6>
                  <small class="text-muted">Bergabung dengan komunitas peduli sesama</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <style>
      .campaign-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .campaign-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
      }
      
      .progress-bar {
        transition: width 0.6s ease;
      }
      
      .btn {
        transition: all 0.3s ease;
      }
      
      .btn:hover {
        transform: translateY(-1px);
      }
      
      .bg-primary {
        background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important;
      }
    </style>
  `;
}

window.navigate = function (event, path) {
  event.preventDefault();
  const url = path.startsWith('/') ? path : '/' + path;
  history.pushState(null, '', url);
  window.dispatchEvent(new Event('popstate'));
};

// Additional functions for enhanced features
window.shareCampaign = function(campaignId) {
  if (navigator.share) {
    navigator.share({
      title: 'DonasiKita - Kampanye Donasi',
      text: 'Ayo dukung kampanye donasi ini!',
      url: window.location.origin + '/campaign/' + campaignId
    });
  } else {
    // Fallback for browsers that don't support Web Share API
    const url = window.location.origin + '/campaign/' + campaignId;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link kampanye berhasil disalin ke clipboard!');
    });
  }
};