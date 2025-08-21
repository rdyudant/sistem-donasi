import renderHeader from '../components/header.js';
import renderFooter from '../components/footer.js';
import { url } from './conf/baseurl.js';
import { checkLogin } from './conf/auth.js';

export default async function daftarPermintaanPage(app) {
  window.scrollTo(0, 0);
  setPageTitle('Dashboard Admin');
  const result = await checkLogin();
  if (result.status !== 200 || localStorage.getItem('token') == null) {
    console.log('token expired');
    window.location.href = '/';
    return;
  }
  const campaignId = window.location.pathname.split('/').pop();
  const res = await fetch(url + '/campaign/permintaan-collab/'+campaignId, {
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
      case 1:
        return 'success';
      case 2:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  app.innerHTML = `
    ${renderHeader(false, true)}
    <main class="py-5 mt-5">
      <div class="container mt-2">
        <h2 class="mb-4 text-center">Kelola Data Campaign</h2>
        <button type="button" onclick="btnKembali()" class="btn btn-secondary">
          <i class="bi bi-arrow-left"></i> Kembali
        </button>
        <div class="p-2"></div>
        <div class="table-responsive">
          <table class="table table-bordered table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Judul</th>
                <th>Nama Pecari Donatur</th>
                <th>Alamat</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              ${campaigns.map((c, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${c.title}</td>
                  <td>${c.fullname}</td>
                  <td>Rp ${c.alamat}, Desa/Kelurahan ${ c.desa }, Kecamatan ${ c.kecamatan }, Kabupaten ${ c.kab }</td>
                  <td>
                    <span class="badge bg-${getStatusBadgeClass(c.status)}">${c.status == 1? 'Telah diterima':c.status == 2? 'Ditolak': 'Menunggu Persetujuan'}</span>
                  </td>
                  <td>
                    <div class="d-flex flex-wrap gap-1">
                      <a class="btn btn-sm btn-success" onclick="Stat(${ c.id }, 1)">
                        <i class="bi bi-pencil"></i> Terima
                      </a>
                      <a class="btn btn-sm btn-danger" onclick="Stat(${ c.id }, 2)">
                        <i class="bi bi-share"></i> Tolak
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

  document.getElementById('btnLogout')?.addEventListener('click', logout);
}

window.Stat = async function(id, status){
    console.log("aaa")
    const credentials = {
        status: status
    }
    const res = await fetch(url+'/campaign/request-action/'+id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify(credentials)
    });
    const result = await res.json();
    if (result.status === 200) {
        Swal.fire({
          icon: 'success',
          title: "Berhasil diubah",
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
  localStorage.clear()
  window.location.href = '/';
}

window.btnKembali = function(){
    return history.back();
}

// Navigasi SPA
window.navigate = function (event, path) {
  event.preventDefault();
  history.pushState(null, '', `/${path}`);
  window.dispatchEvent(new Event('popstate'));
};