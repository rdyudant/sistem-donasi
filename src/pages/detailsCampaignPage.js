import renderHeader from '../components/header.js';
import { url } from './conf/baseurl.js';
import { checkLogin } from './conf/auth.js';

export default async function detailsCampaignPage(app) {
  window.scrollTo(0, 0);
  setPageTitle('Detail Keuangan');
  const result = await checkLogin();
  if (result.status !== 200 || localStorage.getItem('token') == null) {
    console.log('token expired');
    window.location.href = '/';
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const id_campaign = params.get("id_campaign");
  const res = await fetch(url + '/campaign/daftar-campaign/'+id_campaign, {
    method: 'GET',
    headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')  
            }
  });

  const respons = await res.json();
  const campaign = respons.data[0];
  console.log(campaign);
  app.innerHTML = `
    ${renderHeader(false, true)}
    <style>
      .highlight-nominal {
        font-size: 2rem;
        font-weight: bold;
        color: #28a745; /* hijau agar menonjol */
        background: rgba(40, 167, 69, 0.1);
        padding: 10px 20px;
        border-radius: 12px;
        display: inline-block;
        box-shadow: 0 4px 10px rgba(40, 167, 69, 0.3);
        transition: transform 0.3s ease, background 0.3s ease;
      }

      .highlight-nominal:hover {
        transform: scale(1.05);
        background: rgba(40, 167, 69, 0.2);
      }
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }

      .animate-pulse {
        animation: pulse 0.5s ease;
      }

    </style>
    <main class="py-5 mt-5">
      <div class="container mt-2">
        <h2 class="mb-4 text-center">Managemen Campaign<br>${ campaign.title }</h2>
        <button type="button" id="btnKembali" class="btn btn-secondary btn-sm mb-4">
          <i class="bi bi-arrow-left"></i> Kembali
        </button>
        <div class="p-2"></div>
        <div class="row">
          <div class="col-md-6">
            <canvas id="donationChart" height="120"></canvas>
          </div>
          <div class="col-md-6">
            <div class="p-3"></div>
            <div class="card p-3 shadow-sm text-center">
              <h5>Total Donasi Masuk :</h5>
              <p id="totalDonasi" class="highlight-nominal">Rp 0</p>
              <p>Target: <span id="targetAmount">Rp 0</span></p>
              <p>Persentase: <span id="persentase">0%</span></p>
            </div>
          </div>
        </div>

        <div class="mt-5">
          <h4>Daftar Transaksi</h4>
          <div class="table-responsive">
            <table class="table table-striped" id="transactionTable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Donatur</th>
                  <th>Jumlah</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </div>

        <!-- Form input donasi manual -->
        <div class="mt-5">
          <h4>Tambah Donasi Manual</h4>
          <form id="formDonasiManual" class="card p-3 shadow-sm">
            <div class="mb-3">
              <label class="form-label">Nama Donatur</label>
              <input type="text" class="form-control" id="manualNama" placeholder="Nama Donatur">
            </div>
            <div class="mb-3">
              <label class="form-label">Jumlah Donasi</label>
              <input type="number" class="form-control" id="manualJumlah" placeholder="Masukkan jumlah">
            </div>
            <button type="button" onclick="saveFunc()" class="btn btn-primary">
              <i class="bi bi-plus-circle"></i> Tambah Donasi
            </button>
          </form>
        </div>
      </div>
    </main>
  `;

  // Tombol kembali
  document.getElementById('btnKembali').addEventListener('click', () => history.back());

  document.getElementById('btnLogout')?.addEventListener('click', logout);

  // Load data pertama kali
  loadData();

  // Reload tabel transaksi setiap 10 detik
  setInterval(loadData, 50000);
  
  window.saveFunc = async function() {
      const nama = document.getElementById("manualNama").value.trim();
      const jumlah = parseInt(document.getElementById("manualJumlah").value);
      if (!nama || !jumlah || jumlah <= 0) {
        alert("Isi nama dan jumlah donasi dengan benar!");
        return;
      }
      try {
        const res = await fetch(`${url}/campaign/manual-donation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
          },
          body: JSON.stringify({ nama_donatur: nama, jumlah_donasi: jumlah, id_campaign: id_campaign })
        });
        const data = await res.json();
        if (res.ok) {
          alert("Donasi manual berhasil ditambahkan!");
          document.getElementById("formDonasiManual").reset();
          loadData(); // reload tabel dan chart
        } else {
          alert("Gagal menambahkan donasi: " + data.message);
        }
    }catch (err) {
        console.error("Error tambah donasi manual:", err);
        alert("Terjadi kesalahan server.");
    }
}

  async function loadData() {
    try {
      const res = await fetch(`${url}/campaign/${id_campaign}/list`, {
        headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
      });
      const data = await res.json();
      console.log(data);

      // Update info total
      document.getElementById("totalDonasi").innerText = `Rp ${formatRupiah(data.totalDonasi)}`;

      const totalDonasiElem = document.getElementById("totalDonasi");
      totalDonasiElem.classList.add("animate-pulse");

      setTimeout(() => {
        totalDonasiElem.classList.remove("animate-pulse");
      }, 500);


      document.getElementById("targetAmount").innerText = `Rp ${formatRupiah(data.targetAmount)}`;
      document.getElementById("persentase").innerText = `${data.persentase.toFixed(2)}%`;

      // Update chart
      renderChart(data.transaksi);

      // Update tabel
      renderTable(data.transaksi);
    } catch (err) {
      console.error("Gagal load data:", err);
    }
  }

  function renderTable(transaksi) {
    const tbody = document.querySelector("#transactionTable tbody");
    tbody.innerHTML = "";

    transaksi.forEach(trx => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${trx.id}</td>
        <td>${trx.cust_name || '-'}</td>
        <td>Rp ${formatRupiah(trx.bill_total)}</td>
        <td>${new Date(trx.createdAt).toLocaleString()}</td>
        <td>${trx.status == 1 ? '<span style="background-color: green; padding: 5px; border-radius: 10px; color: white;">Sukses</span>' : 'Pending'}</td>
      `;
      tbody.appendChild(tr);
    });

    // Hapus instance lama agar tidak error
    if ($.fn.DataTable.isDataTable('#transactionTable')) {
      $('#transactionTable').DataTable().destroy();
    }

    // Aktifkan DataTables
    $('#transactionTable').DataTable({
      paging: true,
      searching: true,
      ordering: true,
      pageLength: 5,
      language: {
        search: "Cari:",
        lengthMenu: "Tampilkan _MENU_ data",
        info: "Menampilkan _START_ - _END_ dari _TOTAL_ data",
        paginate: {
          first: "Awal",
          last: "Akhir",
          next: "›",
          previous: "‹"
        }
      }
    });
  }


  let chart;
  function renderChart(transaksi) {
    const ctx = document.getElementById("donationChart");
    const labels = transaksi.map(t => new Date(t.createdAt).toLocaleDateString());
    const amounts = transaksi.map(t => t.bill_total);

    if (chart) chart.destroy(); // reset chart

    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Jumlah Donasi',
          data: amounts,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
          tension: 0.3
        }]
      }
    });
  }

  function formatRupiah(num) {
    return new Intl.NumberFormat("id-ID").format(num);
  }

  // Event listener untuk form donasi manual
  document.getElementById("formDonasiManual").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nama = document.getElementById("manualNama").value.trim();
    const jumlah = parseInt(document.getElementById("manualJumlah").value);

    if (!nama || !jumlah || jumlah <= 0) {
      alert("Isi nama dan jumlah donasi dengan benar!");
      return;
    }

    try {
      const res = await fetch(`${url}/campaigns/${id_campaign}/manual-donation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ nama_donatur: nama, bill_total: jumlah })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Donasi manual berhasil ditambahkan!");
        document.getElementById("formDonasiManual").reset();
        loadData(); // reload tabel dan chart
      } else {
        alert("Gagal menambahkan donasi: " + data.message);
      }
    } catch (err) {
      console.error("Error tambah donasi manual:", err);
      alert("Terjadi kesalahan server.");
    }
  });
}

function logout() {
  localStorage.clear();
  window.location.href = '/';
}

window.navigate = function (event, path) {
  event.preventDefault();
  history.pushState(null, '', `/${path}`);
  window.dispatchEvent(new Event('popstate'));
};