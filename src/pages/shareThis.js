import renderHeader from '../components/header.js';
import renderFooter from '../components/footer.js';
import { url } from './conf/baseurl.js';
import { checkLogin } from './conf/auth.js';

export default async function shareThisPage(app) {
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

  setPageTitle(`Share This Campaign`);
  app.innerHTML = `
    ${renderHeader(false, true)} <!-- pakai button -->
    <main class="py-5 mt-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8">

            <h2 class="text-center mb-4">Bagikan Campaign Ini</h2>

            <div class="text-center mb-4">
              <button class="btn btn-success m-2" onclick="window.open('https://wa.me/?text=URL_SHARE', '_blank')">
                <i class="bi bi-whatsapp"></i> WhatsApp
              </button>

              <button class="btn btn-primary m-2" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=URL_SHARE', '_blank')">
                <i class="bi bi-facebook"></i> Facebook
              </button>

              <button class="btn btn-info text-white m-2" onclick="window.open('https://twitter.com/intent/tweet?url=URL_SHARE', '_blank')">
                <i class="bi bi-twitter"></i> Twitter
              </button>

              <div class="mt-4 mb-4">
                <div class="input-group" style="max-width: 500px; margin: 0 auto;">
                  <input type="text" class="form-control" id="shareLink" readonly value="URL_SHARE">
                  <button class="btn btn-outline-secondary" onclick="salinLink()">Salin</button>
                </div>
              </div>

              <button type="button" id="btnKembali" class="btn btn-secondary mt-5">
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>

    </main>
    ${renderFooter()}
  `;

  document.getElementById('btnKembali').addEventListener('click', () => {
    history.back(); // kembali ke halaman sebelumnya
  });

  function salinLink() {
    const input = document.getElementById('shareLink');
    input.select();
    document.execCommand('copy');

    Swal.fire({
      icon: 'success',
      title: 'Link disalin!',
      text: 'Silakan bagikan ke mana saja.',
      timer: 2000,
      showConfirmButton: false
    });
  }
  const campaignId = window.location.pathname.split('/').pop();
  const shareUrl = `${url}/share-campaign/${campaignId}`;
  document.getElementById('shareLink').value = shareUrl;

  // Update the buttons with the actual share URL
  const whatsappButton = document.querySelector('button[onclick*="wa.me"]');
  whatsappButton.setAttribute('onclick', `window.open('https://wa.me/?text=${encodeURIComponent(shareUrl)}', '_blank')`);

  const facebookButton = document.querySelector('button[onclick*="facebook.com"]');
  facebookButton.setAttribute('onclick', `window.open('https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}', '_blank')`);

  const twitterButton = document.querySelector('button[onclick*="twitter.com"]');
  twitterButton.setAttribute('onclick', `window.open('https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}', '_blank')`);
}