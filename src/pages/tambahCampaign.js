import renderHeader from '../components/header.js';
import renderFooter from '../components/footer.js';

export default function tambahCampaignPage(app) {
  setPageTitle('Tambah Campaign');

  app.innerHTML = `
    ${renderHeader(false)}
    <main class="py-5 mt-5">
      <div class="container">
        <h2 class="mb-4 text-center">Tambah Campaign Baru</h2>

        <form id="formTambah" class="bg-white p-4 rounded shadow-sm">

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
            <textarea id="deskripsi" name="deskripsi" rows="5" required></textarea>
          </div>

          <div class="mb-3">
            <label for="kategori" class="form-label">Kategori</label>
            <input type="text" class="form-control" id="kategori" name="kategori" required>
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

  // Inisialisasi TinyMCE untuk editor deskripsi
  tinymce.init({
    selector: '#deskripsi',
    height: 300,
    menubar: false,
    plugins: 'lists link image preview',
    toolbar: 'undo redo | bold italic underline | bullist numlist | link image | preview',
    branding: false
  });

  // 🟢 Ambil semua elemen setelah HTML sudah di-render
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
        target: parseInt(form.target.value),
        imageName: file.name,
        imageBase64: base64
      };

      try {
        const res = await fetch('http://localhost:3000/api/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
        console.error(err);
        alert('Gagal mengirim data.');
      }
    };

    reader.readAsDataURL(file);
  });
}