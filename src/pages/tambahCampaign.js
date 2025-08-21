import renderHeader from '../components/header.js';
import renderFooter from '../components/footer.js';
import { url } from './conf/baseurl.js';
import { checkLogin } from './conf/auth.js';

export default async function tambahCampaignPage(app) {
  window.scrollTo(0, 0);
  setPageTitle('Tambah Campaign');
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

  app.innerHTML = `
    ${renderHeader(false)}
    <main class="py-5 mt-5">
      <div class="container mt-2">
        <h5 class="mb-4">Tambah Campaign Baru</h5>
        <span><i class="bi bi-house-fill"></i> <a href="/dashboard">Dashboard</a> / <strong>Buat Campaign</strong></span>
        <hr>
        <span class="text-muted d-block  mb-4">
          Buat campaign baru untuk menggalang dana bagi kebutuhan sosial, pendidikan, medis, dan lainnya.
        </span>
        <p class="mb-4">
        <i class="bi bi-info-circle-fill"></i>
        Isi form berikut untuk membuat campaign baru.</p>

        <form id="formTambah" class="bg-white p-4 rounded border border-2 shadow">

          <div class="mb-3">
            <label for="gambar" class="form-label">Unggah Gambar</label>
            <input type="file" class="form-control" id="gambar" name="gambar" accept="image/*" required>
            <div class="mt-3">
              <img id="preview-gambar" src="" alt="Preview Gambar" class="img-fluid rounded d-none" style="max-height: 200px;" />
            </div>
          </div>

          <div class="mb-3">
            <label for="judul" class="form-label">Judul Campaign</label>
            <input type="text" class="form-control" id="judul" name="judul" required>
          </div>

          <div class="mb-3">
            <label for="alamat" class="form-label">Alamat</label>
            <input type="text" class="form-control" id="alamat" name="alamat" required>
          </div>

          <div class="mb-3">
            <label for="kategori" class="form-label">Kategori</label>
            <select class="form-select" id="kategori" name="kategori" required>
              <option value="Sosial" selected>Sosial</option>
              <option value="Pendidikan">Pendidikan</option>
              <option value="Religi">Religi</option>
              <option value="Medis">Medis</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="status" class="form-label">Status Campaign</label>
            <select class="form-select" id="status" name="status" required>
              <option value="draft" selected>Draft</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="target" class="form-label">Target Donasi (Rp)</label>
            <input type="number" class="form-control" id="target" name="target" min="1000" required>
          </div>

          <div class="mb-3">
            <label for="url" class="form-label">url Landing Page:</label>
            <input type="text" class="form-control" id="url" name="url" required>
          </div>

          <div class="d-grid">
            <button type="submit" class="btn btn-success">Buat Campaign</button>
          </div>
        </form>
      </div>
    </main>
    ${renderFooter()}
  `;

  // Ambil semua elemen setelah HTML sudah di-render
  const form = document.getElementById('formTambah');
  const inputFile = document.getElementById('gambar');
  const preview = document.getElementById('preview-gambar');

  // Preview base64
  inputFile.addEventListener('change', () => {
    const file = inputFile.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.classList.remove('d-none');
    };
    reader.readAsDataURL(file);
  });

  // Submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = inputFile.files[0];
    if (!file) {
      alert('Silakan pilih gambar terlebih dahulu.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async function () {
      const base64 = reader.result;

      const data = {
        judul: form.judul.value,
        kategori: form.kategori.value,
        alamat: form.alamat.value,
        status: form.status.value,
        target: parseInt(form.target.value),
        url: form.url.value,
        imageBase64: base64
      };

      try {
        const res = await fetch(url + '/campaign/campaign-save', {
          method: 'POST',
          headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('token')  
                  },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          Swal.fire({
            title: "Berhasil!",
            text: "Campaign berhasil ditambahkan.",
            icon: "success"
          });
          // history.pushState(null, '', '/dashboard');
          window.dispatchEvent(new Event('popstate'));
        } else {
          const err = await res.json();
            Swal.fire({
            title: "Galat!",
            text: err.message || 'Gagal menambahkan campaign',
            icon: "error"
          });
        }
      } catch (err) {
        Swal.fire({
          title: "Galat!",
          text: "Campaign gagal ditambahkan.",
          icon: "error"
        });
      }
    };

    reader.readAsDataURL(file);
  });
}