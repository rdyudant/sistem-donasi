import renderHeader from '../components/header.js';
import renderFooter from '../components/footer.js';
import { url, url_images } from './conf/baseurl.js';
import { checkLogin } from './conf/auth.js';

export default async function donasiFormPage(app) {
  window.scrollTo(0, 0);

  const url_ = window.location.href.split('/');
  const donation_url = `${url_[0]}//${url_[2]}/`;
  const campaignId = url_[4];
  const user = atob(url_[6]);
  
  if (!url_[6]) return window.location.href = '/login';

  const res = await fetch(url + '/campaign/share-campaign/' + campaignId, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const respons = await res.json();
  const campaign = respons.data;

  setPageTitle(`${campaign.title}`);

  app.innerHTML = `
    <main>
      <!-- Hero -->
      <section class="position-relative" style="height: 320px; background-image: url('${url_images}${campaign.image_thumb}'); background-size: cover; background-position: center;">
        <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"></div>
        <div class="container h-100 d-flex flex-column justify-content-center text-white position-relative">
          <h1 class="fw-bold">${campaign.title}</h1>
          <p class="lead">Bantu wujudkan harapan mereka melalui kontribusi Anda.</p>
        </div>
      </section>

      <!-- Form Donasi -->
      <section class="py-5">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-8">
              <!-- Data Donatur -->
              <div class="bg-white p-4 rounded shadow-sm mb-4">
                <h5 class="fw-semibold mb-3">Data Donatur</h5>
                <form id="donaturForm">
                  <div class="mb-3">
                    <label class="form-label">Nama Lengkap</label>
                    <input type="text" class="form-control" id="namaDonatur" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" id="emailDonatur" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">No. HP</label>
                    <input type="tel" class="form-control" id="hpDonatur" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Pesan / Doa</label>
                    <textarea class="form-control" id="pesanDonatur" rows="3" placeholder="Tulis doa atau dukungan..."></textarea>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Reff</label>
                    <input type="tel" class="form-control" id="reff" readonly value="${ user }" required>
                  </div>
                </form>
              </div>

              <!-- Instruksi Pembayaran -->
              <div class="bg-white p-4 rounded shadow-sm mb-4">
                <h5 class="fw-semibold mb-3">Nominal Donasi</h5>
                <label for="channelSelect" class="form-label">Jumlah Nominal :</label>
                <input type="text" class="form-control mb-3" placeholder="0" id="nominalDonasi">
              </div>
              <!-- Tombol CTA -->
              <div class="d-flex gap-2">
                <button type="button" onclick="generatePayment()" class="btn btn-success w-100">Donasi</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;

  window.generatePayment = async function() {
    const namaDonatur = document.getElementById('namaDonatur').value;
    const emailDonatur = document.getElementById('emailDonatur').value;
    const hpDonatur = document.getElementById('hpDonatur').value;
    const pesanDonatur = document.getElementById('pesanDonatur').value;
    const nominalDonasi = document.getElementById('nominalDonasi').value;
    const reff = document.getElementById('reff').value;
    if(!namaDonatur || !emailDonatur || !hpDonatur || !nominalDonasi) {
      alert('Lengkapi data donatur terlebih dahulu.');
      return;
    }
    const no_bill = `DONASI${Date.now()}-${reff}-${campaignId}`;
    const bill_total = nominalDonasi;
    const cust_name = namaDonatur;
    const cust_email = emailDonatur;
    const cust_hp = hpDonatur;
    const cust_no = `CUST${Date.now()}`;

    const createTransaction = await fetch(url + '/share/create-transaction', {
      method: 'post', 
      body: JSON.stringify({
        bill_no: no_bill,
        bill_total: bill_total,
        cust_name: cust_name,
        cust_email: cust_email,
        cust_hp: cust_hp,
        cust_no: cust_no
      }),
      headers: { 
                  'Content-Type': 'application/json'
              }
    })
    const transaction = await createTransaction.json();
    if(transaction.response_code == "00") {
      Swal.fire({
          icon: 'success',
          title: 'Transaksi berhasil dibuat. Silakan lanjutkan ke metode pembayaran.',
          showConfirmButton: false
        })
      window.location.href = transaction.redirect_url;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Transaksi berhasil dibuat. Silakan lanjutkan ke metode pembayaran.',
        showConfirmButton: false
      })
    }
  }

  window.getPayment = async function() {
    const channel_code = document.getElementById('channelSelect').value;
    const namaDonatur = document.getElementById('namaDonatur').value;
    const emailDonatur = document.getElementById('emailDonatur').value;
    const hpDonatur = document.getElementById('hpDonatur').value;
    const pesanDonatur = document.getElementById('pesanDonatur').value;
    const nominalDonasi = document.getElementById('nominalDonasi').value;
    const reff = document.getElementById('reff').value;

    if (!channel_code) {
      alert('Pilih metode pembayaran terlebih dahulu.');
      return;
    }

    if(!namaDonatur || !emailDonatur || !hpDonatur || !nominalDonasi) {
      alert('Lengkapi data donatur terlebih dahulu.');
      return;
    }

    const getPayment = await fetch(url + '/share/pay-method', {
      method: 'post',
      body: JSON.stringify({
        nama: namaDonatur,
        email: emailDonatur,
        hp: hpDonatur,
        ref: reff,
        amount: nominalDonasi,
        channel_code: channel_code,
        order_id: `DONASI${Date.now()}`,
        product_description: `Donasi untuk ${campaign.title}`
      }),
      headers: { 
                  'Content-Type': 'application/json'
              }
    })
    const payment = await getPayment.json();
    console.log(payment);
  };
}