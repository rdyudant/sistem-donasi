import renderHeader from '../components/header.js';
import renderFooter from '../components/footer.js';
import { url, url_images } from './conf/baseurl.js';
import { checkLogin } from './conf/auth.js';

export default async function daftarCampaignPage(app) {
  window.scrollTo(0, 0);
  setPageTitle('Dashboard Admin');
  const result = await checkLogin();
  if (result.status !== 200 || localStorage.getItem('token') == null) {
    console.log('token expired');
    window.location.href = '/';
    return;
  }

  const res = await fetch(url + '/campaign/daftar', {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')  
    }
  });

  const respons = await res.json();
  const campaigns = respons.data;
  console.log(campaigns);

  function getStatusBadgeClass(status) {
    switch (status) {
      case 'active': return 'success';
      case 'closed':
      case 'cancelled': return 'danger';
      case 'draft':
      default: return 'secondary';
    }
  }

  function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  }

  let searchValue = "";

  function renderCampaigns(filteredCampaigns) {
    return filteredCampaigns.map(c => `
      <div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${url_images}${c.image_thumb}" class="card-img-top" alt="${c.title}" style="height: 200px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title">${c.title}</h5>
            <p class="card-text"><i class="bi bi-geo-alt"></i> ${c.alamat}</p>
            <p class="card-text fw-bold text-success">${formatRupiah(c.target_amount)}</p>
            <span class="badge bg-${getStatusBadgeClass(c.status)}">${c.status}</span>
          </div>
          <div class="card-footer text-end">
            <a onclick="Gabung(${c.id})" class="btn btn-sm btn-primary">
              <i class="bi bi-share"></i> Bergabung Sebagai Pencari Donatur
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }

  app.innerHTML = `
    ${renderHeader(false, true)}
    <main class="py-5 mt-5">
      <div class="container mt-2">
        <h5 class="mb-4">Daftar Campaign</h5>
        <span><i class="bi bi-house-fill"></i> <a href="/dashboard">Dashboard</a> / <strong>Daftar Campaign</strong></span>
        <hr>
        <div class="mb-3">
          <input type="text" id="searchCampaign" class="form-control" placeholder="Cari judul atau lokasi campaign...">
        </div>
        <div class="mb-3">
          <span class="text-muted">Temukan berbagai campaign yang sedang berjalan. Anda dapat bergabung sebagai pencari donatur untuk membantu mengumpulkan dana.</span>
        </div>
        <div class="row" id="campaignGrid">
          ${renderCampaigns(campaigns)}
        </div>
      </div>
    </main>
  `;

  // Pencarian dinamis
  document.getElementById('searchCampaign').addEventListener('input', function(e) {
    searchValue = e.target.value.toLowerCase();
    const filtered = campaigns.filter(c =>
      c.title.toLowerCase().includes(searchValue) ||
      (c.alamat && c.alamat.toLowerCase().includes(searchValue))
    );
    document.getElementById('campaignGrid').innerHTML = renderCampaigns(filtered);
  });

  document.getElementById('btnLogout')?.addEventListener('click', logout);
}

window.Gabung = async function (id){
    const credentials = {
        id_campaign: id
    }
    const res = await fetch(url+'/campaign/request-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify(credentials)
    });
    const result = await res.json();
    if (result.status === 200) {
        Swal.fire({
          icon: 'success',
          title: result.msg,
          timer: 2000,
          showConfirmButton: false
        })
    }else{
        Swal.fire({
          icon: 'error',
          title: "Internal Server Error",
          timer: 2000,
          showConfirmButton: false
        })
    }
}

function logout() {
  localStorage.clear();
  window.location.href = '/';
}

window.btnKembali = function(){
    return history.back();
}
