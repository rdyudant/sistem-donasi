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

  const getChannels = await fetch(url + '/share/list-channels', {
    method: 'GET',
    headers: { 
                'Content-Type': 'application/json'
            }
  });
  const channels = await getChannels.json();
  console.log(channels);
  const channelList = channels.payment_channel;
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
                    <input type="tel" class="form-control" id="hpDonatur" readonly value="${ user }" required>
                  </div>
                </form>
              </div>

              <!-- Instruksi Pembayaran -->
              <div class="bg-white p-4 rounded shadow-sm mb-4">
                <h5 class="fw-semibold mb-3">Instruksi Pembayaran</h5>
                <p>Silakan pilih metode pembayaran yang Anda inginkan:</p>
                
                <div class="form-check mb-2">
                  <select class="form-select" id="channelSelect">
                    <option value="" selected disabled>Pilih Metode Pembayaran</option>
                    ${channelList.map(channel => `
                      <option value="${channel.pg_code}">${channel.pg_name}</option>
                    `).join('')}
                  </select>
                </div>
                <button class="btn btn-primary" id="btnInstruksi" type="button">Tampilkan Instruksi</button>
              </div>
              <!-- Tombol CTA -->
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-success w-100">Donasi</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}