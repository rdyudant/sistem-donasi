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

  const campaignId = window.location.pathname.split('/').pop();
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
  const campaign = respons.data;
  console.log(respons.data)
  const persentase = Math.round((campaign.collected_amount / campaign.target_amount) * 100);
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

  const donationData = [
    { id: 1, name: "Ahmad Rahmat", date: "2024-08-25", address: "Jakarta Selatan", message: "Semoga berkah dan bermanfaat", amount: 500000 },
    { id: 2, name: "Siti Nurhaliza", date: "2024-08-24", address: "Bandung", message: "Untuk kebaikan bersama", amount: 250000 },
    { id: 3, name: "Budi Santoso", date: "2024-08-23", address: "Surabaya", message: "Barakallahu fiikum", amount: 1000000 },
    { id: 4, name: "Dewi Kusuma", date: "2024-08-22", address: "Yogyakarta", message: "Semoga membantu yang membutuhkan", amount: 750000 },
    { id: 5, name: "Rizki Pratama", date: "2024-08-21", address: "Medan", message: "Berbagi kebahagiaan", amount: 300000 },
    { id: 6, name: "Maya Sari", date: "2024-08-20", address: "Denpasar", message: "Untuk pendidikan anak yatim", amount: 2000000 },
    { id: 7, name: "Andi Wijaya", date: "2024-08-19", address: "Makassar", message: "Semoga bermanfaat", amount: 150000 },
    { id: 8, name: "Lina Marlina", date: "2024-08-18", address: "Palembang", message: "Berbagi rezeki", amount: 400000 },
    { id: 9, name: "Hendra Gunawan", date: "2024-08-17", address: "Balikpapan", message: "Untuk kemanusiaan", amount: 600000 },
    { id: 10, name: "Kartini Sari", date: "2024-08-16", address: "Semarang", message: "Mudah-mudahan berkah", amount: 350000 },
  ];

  let currentPage = 1;
  let itemsPerPage = 10;
  let filteredData = [...donationData];
  app.innerHTML = `
    ${renderHeader(false, true)} <!-- pakai button -->
    <main>

      <!-- Konten Detail -->
      <section class="py-5 mt-5">
        <div class="container">
          <div class="row justify-content-center">
            <div class="row mb-4">
                <div class="col-md-8">
                    <h4 class="mb-1">Donatur (738)</h4>
                    <div class="text-muted">
                        <i class="far fa-calendar-alt me-2"></i>
                        31 Jan 2022 - 1 Mar 2022
                    </div>
                </div>
                <div class="col-md-4 text-md-end">
                    <button class="btn btn-primary">
                        Download Donatur
                    </button>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="row mb-4">
                <div class="col-md-4 mb-3">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="text-warning me-3">
                                    <i class="fas fa-chart-bar fa-2x"></i>
                                </div>
                                <div>
                                    <small class="text-muted d-block">Total Donasi</small>
                                    <h5 class="mb-0" id="totalDonation">Rp 42.441.699</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-3">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body">
                            <div class="d-flex align-items-center">
                                <div class="text-info me-3">
                                    <i class="fas fa-users fa-2x"></i>
                                </div>
                                <div>
                                    <small class="text-muted d-block">Jumlah Donasi</small>
                                    <h5 class="mb-0" id="totalDonors">520</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Table -->
            <div class="card border-0 shadow-sm">
                <div class="table-responsive">
                    <table class="table table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th scope="col">NAMA</th>
                                <th scope="col">TANGGAL</th>
                                <th scope="col">ALAMAT</th>
                                <th scope="col">PESAN</th>
                                <th scope="col">NOMINAL</th>
                            </tr>
                        </thead>
                        <tbody id="donationTableBody">
                            <!-- Data akan diisi oleh JavaScript -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Pagination -->
            <nav class="mt-4">
                <ul class="pagination justify-content-center" id="pagination">
                    <!-- Pagination akan diisi oleh JavaScript -->
                </ul>
            </nav>
          </div>
        </div>
      </section>

    </main>
    ${renderFooter()}
  `;

  window.btnKembali = function(){
      return history.back();
  }

  // Langsung render setelah HTML selesai di-render
  renderTable();
  updateStats();

  // Format rupiah
  function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  }

  // Format tanggal
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // Update statistik
  function updateStats() {
    const totalDonation = donationData.reduce((sum, item) => sum + item.amount, 0);
    const totalDonors = donationData.length;
    const netDonation = donationData.reduce((sum, item) => sum + item.net, 0);

    document.getElementById('totalDonation').textContent = formatRupiah(totalDonation);
    document.getElementById('totalDonors').textContent = totalDonors.toLocaleString('id-ID');
    document.getElementById('netDonation').textContent = formatRupiah(netDonation);
  }

  // Render tabel
  function renderTable() {
    const tbody = document.getElementById('donationTableBody');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredData.slice(start, end);

    tbody.innerHTML = pageData.map((item, index) => `
      <tr>
        <td>
          <div class="fw-medium">${item.name}</div>
        </td>
        <td>${formatDate(item.date)}</td>
        <td>${formatRupiah(item.address)}</td>
        <td>${formatRupiah(item.message)}</td>
        <td>${formatRupiah(item.amount)}</td>
      </tr>
    `).join('');

    updatePagination();
  }

  // Update pagination
  function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
      
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
      <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">
          <i class="fas fa-chevron-left"></i>
        </a>
      </li>
    `;
      
    // Page numbers (show max 5 pages)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
        </li>
      `;
    }
      
    // Next button
    paginationHTML += `
      <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">
          <i class="fas fa-chevron-right"></i>
        </a>
      </li>
    `;
    
    pagination.innerHTML = paginationHTML;
  }

  // Change page
  function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      renderTable();
    }
  }

  // Search functionality
  document.getElementById('searchInput').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    filteredData = donationData.filter(item => 
      item.name.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    renderTable();
  });

}