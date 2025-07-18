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
        <h2 class="mb-4 text-center">Tambah Campaign Baru</h2>
        <div class="mb-3">
          <button type="button" id="btnKembali" class="btn btn-secondary">
            <i class="bi bi-arrow-left"></i> Kembali
          </button>
        </div>

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
            <label for="deskripsi" class="form-label">Deskripsi</label>
            <textarea id="deskripsi" name="deskripsi" rows="5"></textarea>
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

          <div class="d-grid">
            <button type="submit" class="btn btn-success">Simpan Campaign</button>
          </div>
        </form>
      </div>
    </main>
    ${renderFooter()}
  `;

  // Event listener untuk tombol kembali
  document.getElementById('btnKembali').addEventListener('click', () => {
    history.back(); // kembali ke halaman sebelumnya
  });

  // Inisialisasi TinyMCE untuk editor deskripsi
  tinymce.init({
    selector: '#deskripsi',
    height: 300,
    menubar: false,
    plugins: 'lists link image preview',
    toolbar: 'undo redo | bold italic underline | bullist numlist | link image | preview',
    branding: false,
    image_dimensions: false,
    image_caption: true,
    image_class_list: [
      { title: 'Responsif', value: 'img-fluid' }
    ],
    content_style: `
      img {
        max-width: 100%;
        height: auto;
      }
    `
  });

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
        deskripsi: tinymce.get('deskripsi').getContent(),
        kategori: form.kategori.value,
        status: form.status.value,
        target: parseInt(form.target.value),
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
          alert('Campaign berhasil ditambahkan!');
          history.pushState(null, '', '/dashboard');
          window.dispatchEvent(new Event('popstate'));
        } else {
          const err = await res.json();
          alert(err.message || 'Gagal menambahkan campaign');
        }
      } catch (err) {
        alert('Gagal mengirim data.');
      }
    };

    reader.readAsDataURL(file);
  });
}