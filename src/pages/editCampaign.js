import renderHeader from '../components/header.js';
import renderFooter from '../components/footer.js';

export default function editCampaignPage(app) {
  window.scrollTo(0, 0);
  const campaignId = window.location.pathname.split('/').pop();

  // Data dummy (gantilah dengan fetch API di tahap selanjutnya)
  const campaign = {
    id: campaignId,
    title: "Bantu Renovasi Sekolah",
    description: "<p>Bantu renovasi sekolah rusak agar anak-anak bisa belajar dengan nyaman.</p>",
    category: "Pendidikan",
    goal: 50000000,
    status: "active",
    imageName: "renovasi.jpg",
    imageBase64: "" // kosongkan dulu karena tidak akan ditampilkan
  };

  setPageTitle(`Edit Campaign`);

  app.innerHTML = `
    ${renderHeader(false)}
    <main class="py-5 mt-5">
      <div class="container">
        <h2 class="mb-4 text-center">${campaign.title}</h2>

        <form id="formEdit" class="bg-white p-4 rounded border border-2 shadow">

          <input type="hidden" name="id" value="${campaign.id}" />

          <div class="mb-3">
            <label for="gambar" class="form-label">Ubah Gambar (kosongkan jika tidak diubah)</label>
            <input type="file" class="form-control" id="gambar" name="gambar" accept="image/*">
            <div class="mt-3">
              <img id="preview-gambar" src="" class="img-fluid rounded d-none" style="max-height: 200px;" />
            </div>
          </div>

          <div class="mb-3">
            <label for="judul" class="form-label">Judul Campaign</label>
            <input type="text" class="form-control" id="judul" name="judul" value="${campaign.title}" required>
          </div>

          <div class="mb-3">
            <label for="deskripsi" class="form-label">Deskripsi</label>
            <textarea id="deskripsi" name="deskripsi" rows="4" required>${campaign.description}</textarea>
          </div>

          <div class="mb-3">
            <label for="kategori" class="form-label">Kategori</label>
            <select class="form-select" id="kategori" name="kategori" required>
              ${['Sosial', 'Pendidikan', 'Religi', 'Medis', 'Lainnya'].map(kat => `
                <option value="${kat}" ${kat === campaign.category ? 'selected' : ''}>${kat}</option>
              `).join('')}
            </select>
          </div>

          <div class="mb-3">
            <label for="status" class="form-label">Status Campaign</label>
            <select class="form-select" id="status" name="status" required>
              ${['draft', 'active', 'closed', 'cancelled'].map(stat => `
                <option value="${stat}" ${stat === campaign.status ? 'selected' : ''}>${stat}</option>
              `).join('')}
            </select>
          </div>

          <div class="mb-3">
            <label for="target" class="form-label">Target Donasi (Rp)</label>
            <input type="number" class="form-control" id="target" name="target" min="1000" value="${campaign.goal}" required>
          </div>

          <div class="d-flex justify-content-between">
            <button type="button" class="btn btn-secondary" id="btnKembali">
              <i class="bi bi-arrow-left"></i> Kembali
            </button>
            <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
          </div>

        </form>
      </div>
    </main>
    ${renderFooter()}
  `;

  // Preview gambar
  const inputFile = document.getElementById('gambar');
  const preview = document.getElementById('preview-gambar');
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

  // Tombol kembali
  document.getElementById('btnKembali').addEventListener('click', () => {
    history.pushState(null, '', '/dashboard');
    window.dispatchEvent(new Event('popstate'));
  });

  // Inisialisasi TinyMCE
  tinymce.init({
    selector: '#deskripsi',
    height: 300,
    menubar: false,
    plugins: 'lists link image preview',
    toolbar: 'undo redo | bold italic underline | bullist numlist | link image | preview',
    branding: false
  });

  // Submit form
  const form = document.getElementById('formEdit');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = inputFile.files[0];
    let imageBase64 = null;
    let imageName = campaign.imageName;

    if (file) {
      const reader = new FileReader();
      reader.onload = async function () {
        imageBase64 = reader.result;
        imageName = file.name;
        submitUpdate();
      };
      reader.readAsDataURL(file);
    } else {
      submitUpdate(); // tanpa ubah gambar
    }

    async function submitUpdate() {
      const updated = {
        id: campaign.id,
        title: form.judul.value,
        description: tinymce.get('deskripsi').getContent(),
        category: form.kategori.value,
        goal: parseInt(form.target.value),
        status: form.status.value,
        imageName: imageName,
        imageBase64: imageBase64
      };

      console.log('Data update:', updated);

      try {
        const res = await fetch(`http://localhost:3000/api/campaigns/${campaign.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });

        if (res.ok) {
          alert('Campaign berhasil diperbarui!');
          history.pushState(null, '', '/dashboard');
          window.dispatchEvent(new Event('popstate'));
        } else {
          const err = await res.json();
          alert(err.message || 'Gagal update campaign');
        }
      } catch (err) {
        console.error(err);
        alert('Koneksi ke server gagal.');
      }
    }
  });
}
