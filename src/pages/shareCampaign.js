import renderHeader from '../components/header.js';
import renderFooter from '../components/footer.js';
import { url, url_images } from './conf/baseurl.js';
import { checkLogin } from './conf/auth.js';

export default async function shareCampaignPage(app) {
  window.scrollTo(0, 0);
  const result = await checkLogin();
    if (result.status !== 200 || localStorage.getItem('token') == null) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesi Berakhir!',
        text: 'Silakan login kembali.',
        timer: 3000,
        showConfirmButton: false
      });
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
      return;
    }
  const params = new URLSearchParams(window.location.search);
  const campaignId = params.get("id_campaign");
  const url_ = window.location.href.split('/')
  const donation_url = `${ url_[0] }//${ url_[2] }/`
  // Data dummy sementara (bisa nanti fetch berdasarkan ID)

  const res = await fetch(url + '/campaign/daftar-campaign/'+campaignId, {
    method: 'GET',
    headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')  
            }
  });

  const respons = await res.json();
  const campaign = respons.data[0];
  console.log(respons.data)
  const persentase = Math.round((campaign.total_donasi / campaign.target_amount) * 100);
  console.log(persentase)
  const options = { 
                    day: "numeric", 
                    month: "long", 
                    year: "numeric", 
                    hour: "2-digit", 
                    minute: "2-digit",
                    timeZone: "Asia/Jakarta"
                  };
  const date = new Date(campaign.createdAt);
  campaign.createdAt = date;
  setPageTitle(`${campaign.title}`);
  app.innerHTML = `
    ${renderHeader(false, true)} <!-- pakai button -->
    <main>

      <!-- Hero Section dengan Background Gambar -->
      <section class="position-relative" style="height: 320px; background-image: url('${ url_images }${campaign.image_thumb}'); background-size: cover; background-position: center;">
        <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"></div>
        <div class="container h-100 d-flex flex-column justify-content-center text-white position-relative">
          <h1 class="fw-bold">${campaign.title}</h1>
          <p class="lead">Bantu wujudkan harapan mereka melalui kontribusi Anda.</p>
        </div>
      </section>

      <!-- Konten Detail -->
      <section class="py-5">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-8">
              <div class="mb-3">
                <a type="button" href="/dashboard" class="btn btn-secondary btn-sm">
                  <i class="bi bi-arrow-left"></i> Kembali
                </a>
              </div>

              <!-- Info Donasi -->
              <div class="bg-white p-4 rounded shadow-sm mb-4">
                <div class="card-body">
                  <!-- Statistics -->
                  <div class="stats-container">
                      <div class="stat-item stat-collected">
                          <i class="fas fa-coins stat-icon"></i>
                          <div class="stat-label">Donasi Terkumpul</div>
                          <div class="stat-value" id="collected-amount">Rp${campaign.total_donasi}</div>
                      </div>
                      <div class="stat-item stat-target">
                          <i class="fas fa-bullseye stat-icon"></i>
                          <div class="stat-label">Target Donasi</div>
                          <div class="stat-value" id="target-amount">Rp${campaign.target_amount}</div>
                      </div>
                  </div>
                  
                  <!-- Progress Section -->
                  <div class="progress-section">
                      <div class="progress-label">
                          <span class="progress-percentage" id="percentage">${persentase}%</span>
                          <span class="progress-text">dari target tercapai</span>
                      </div>
                      <div class="custom-progress">
                          <div class="progress-fill" id="progress-fill" style="width: 0%;"></div>
                      </div>
                  </div>
                  
                  <!-- Supporters count 
                  <div class="supporters-count">
                      <span class="number" id="supporters-count">${campaign.totalDonatur}</span>
                      <span class="label">orang telah berdonasi</span>
                  </div> -->
                </div>

                <div class="alert alert-info mt-3 mb-0">
                  Semakin banyak donasi yang tersedia, semakin besar bantuan yang bisa disalurkan oleh gerakan ini.
                </div>
              </div>

              <!-- Cerita -->
              <div class="bg-white p-4 rounded shadow-sm mb-4">
                <p class="text-muted mb-1">${
                      campaign.createdAt.toLocaleString("id-ID", options) 
                }</p>
                <h5 class="fw-semibold mb-3">Proposal</h5>
                <iframe 
                    class="iframe-fullscreen"
                    src="${campaign.url}" 
                    title="Form Donasi"
                    style="overflow-x:hidden;">
                </iframe>
              </div>

              <!-- Tombol CTA -->
              <div class="d-flex gap-2">
                <a class="btn btn-outline-primary w-100" onclick="openShareModal(${campaign.id})">
                  <i class="bi bi-share"></i> Bagikan
                </a>
                <!-- <a href="/donasi/${campaign.id}/form" class="btn btn-danger w-50">Donasi Sekarang</a> -->
              </div>

            </div>
          </div>
        </div>
      </section>

    </main>
    ${renderFooter()}

    <!-- Modal Share Campaign -->
    <div class="modal fade" id="modalShareCampaign" tabindex="-1" aria-labelledby="modalShareLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content p-4">
          <div class="modal-header border-0">
            <h5 class="modal-title w-100 text-center fw-bold" id="modalShareLabel">Bagikan Campaign Ini</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body text-center">

            <button class="btn btn-success m-2" id="btnShareWa">
              <i class="bi bi-whatsapp"></i> WhatsApp
            </button>

            <button class="btn btn-primary m-2" id="btnShareFb">
              <i class="bi bi-facebook"></i> Facebook
            </button>

            <button class="btn btn-info text-white m-2" id="btnShareTw">
              <i class="bi bi-twitter"></i> Twitter
            </button>

            <div class="mt-4 mb-3">
              <div class="input-group" style="max-width: 500px; margin: 0 auto;">
                <input type="text" class="form-control" id="shareLink" readonly>
                <button class="btn btn-outline-secondary" id="btnSalin">Salin</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <style>
      @keyframes gradientMove {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        .description img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 10px auto;
        }
        
        .card-header {
            background: transparent;
            padding: 2rem 2rem 1rem;
            border: none;
            text-align: center;
        }
        
        .card-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 0.5rem;
        }
        
        .card-subtitle {
            color: #718096;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .stats-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2rem;
            gap: 1rem;
        }
        
        .stat-item {
            flex: 1;
            text-align: center;
            padding: 1.5rem;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 16px;
            border: 1px solid rgba(226, 232, 240, 0.8);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .stat-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
            transition: left 0.5s ease;
        }
        
        .stat-item:hover::before {
            left: 100%;
        }
        
        .stat-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .stat-label {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748b;
            margin-bottom: 0.5rem;
        }
        
        .stat-value {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.25rem;
        }
        
        .stat-collected .stat-value {
            color: #059669;
        }
        
        .stat-target .stat-value {
            color: #3b82f6;
        }
        
        .stat-icon {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            opacity: 0.7;
        }
        
        .stat-collected .stat-icon {
            color: #059669;
        }
        
        .stat-target .stat-icon {
            color: #3b82f6;
        }
        
        .progress-section {
            margin-bottom: 2rem;
        }
        
        .progress-label {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .progress-percentage {
            font-size: 1.5rem;
            font-weight: 700;
            color: #2d3748;
        }
        
        .progress-text {
            font-size: 0.9rem;
            color: #64748b;
            font-weight: 500;
        }
        
        .custom-progress {
            height: 16px;
            background: #e2e8f0;
            border-radius: 20px;
            overflow: hidden;
            position: relative;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #059669);
            border-radius: 20px;
            position: relative;
            transition: width 2s cubic-bezier(0.4, 0, 0.2, 1);
            animation: progressPulse 2s infinite;
        }
        
        .progress-fill::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            background-size: 50% 100%;
            animation: progressShine 3s infinite;
        }
        
        @keyframes progressPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
            50% { box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
        }
        
        @keyframes progressShine {
            0% { background-position: -50% 0; }
            100% { background-position: 150% 0; }
        }
        
        .achievement-badge {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
            animation: badgePulse 2s infinite;
        }
        
        @keyframes badgePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .supporters-count {
            text-align: center;
            margin-top: 1.5rem;
            padding: 1rem;
            background: rgba(59, 130, 246, 0.1);
            border-radius: 12px;
            border: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        .supporters-count .number {
            font-size: 1.5rem;
            font-weight: 700;
            color: #3b82f6;
            display: block;
        }
        
        .supporters-count .label {
            font-size: 0.9rem;
            color: #64748b;
            margin-top: 0.25rem;
        }
        
        .floating-elements {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            overflow: hidden;
        }
        
        .floating-heart {
            position: absolute;
            color: rgba(239, 68, 68, 0.6);
            font-size: 1.5rem;
            animation: floatUp 4s infinite linear;
        }
        
        @keyframes floatUp {
            0% {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }
        
        .card-body {
            padding: 0 2rem 2rem;
        }
        
        @media (max-width: 768px) {
            .stats-container {
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .stat-item {
                padding: 1rem;
            }
        }
    </style>
  `;

  window.btnKembali = function(){
      return history.back();
  }

  // Animate numbers counting up
  function animateNumber(element, start, end, duration) {
    const startTime = Date.now();
    const startValue = start;
    const endValue = end;
    
    function updateNumber() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeProgress);
        
        if (element.id === 'collected-amount') {
            element.textContent = 'Rp' + currentValue.toLocaleString('id-ID');
        } else if (element.id === 'target-amount') {
            element.textContent = 'Rp' + currentValue.toLocaleString('id-ID');
        } else if (element.id === 'supporters-count') {
            element.textContent = currentValue.toLocaleString('id-ID');
        } else if (element.id === 'percentage') {
            element.textContent = currentValue + '%';
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    updateNumber();
  }

  // Animate the numbers
  animateNumber(document.getElementById('collected-amount'), 0, parseInt(campaign.total_donasi), 3500);
  animateNumber(document.getElementById('target-amount'), 0, parseInt(campaign.target_amount), 4000);
  // animateNumber(document.getElementById('supporters-count'), 0, parseInt(campaign.totalDonatur), 3500);
  animateNumber(document.getElementById('percentage'), 0, parseInt(persentase), 3500);

  // Animate progress bar
  setTimeout(() => {
      document.getElementById('progress-fill').style.width = persentase + '%';
  }, 1500);

  window.openShareModal = function (campaignId) {
    const shareUrl = `${donation_url}share/${campaignId}/${btoa(localStorage.getItem("username"))}`;

    // Set value input dan tombol share
    document.getElementById('shareLink').value = shareUrl;

    document.getElementById('btnShareWa').onclick = () => {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    document.getElementById('btnShareFb').onclick = () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    document.getElementById('btnShareTw').onclick = () => {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    document.getElementById('btnSalin').onclick = () => {
      const input = document.getElementById('shareLink');
      input.select();
      document.execCommand('copy');

      Swal.fire({
        icon: 'success',
        title: 'Link disalin!',
        timer: 2000,
        showConfirmButton: false
      });
    };

    // Tampilkan modal
    const modal = new bootstrap.Modal(document.getElementById('modalShareCampaign'));
    modal.show();
  }

}