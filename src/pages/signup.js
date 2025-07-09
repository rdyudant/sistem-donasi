import renderHeader from '../components/header.js';
import renderFooter from '../components/footer.js';
import { url } from './conf/baseurl.js';

export default function signupPage(app) {
  setPageTitle('Daftar Akun');
  app.innerHTML = `
    ${renderHeader(false)} <!-- tidak pakai button -->
    <main>
      <section class="py-5 mt-4">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-6">
              <h2 class="mb-4 text-center">Buat Akun Baru</h2>
              <form id="signupForm" class="shadow-lg p-4 bg-light rounded">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input type="text" class="form-control" id="username" name="username" required>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" name="password" required>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" name="email" required>
                </div>

                <div class="mb-3">
                  <label for="nama" class="form-label">Nama Lengkap</label>
                  <input type="text" class="form-control" id="nama" name="nama" required>
                </div>

                <div class="mb-3">
                  <label for="alamat" class="form-label">Alamat</label>
                  <textarea class="form-control" id="alamat" name="alamat" rows="3" required></textarea>
                </div>
                <div class="mb-3">
                  <label for="nohp" class="form-label">Nomor HP</label>
                  <input type="tel" class="form-control" id="nohp" name="nohp" required>
                </div>

                <div class="d-grid">
                  <button type="submit" class="btn btn-primary">Daftar Sekarang</button>
                </div>
              </form>
              <p class="mt-3 text-center">Sudah punya akun? <a href="/login" onclick="navigate(event, 'login')">Masuk di sini</a></p>
            </div>
          </div>
        </div>
      </section>
    </main>
    ${renderFooter()}
  `;

  // Event listener submit
  const form = document.getElementById('signupForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validasi username hanya boleh huruf dan angka
    const username = form.username.value;
      if (!/^[a-zA-Z0-9]+$/.test(username)) {
        Swal.fire({
        icon: 'warning',
        title: 'Username tidak valid',
        text: 'Hanya boleh huruf dan angka tanpa spasi atau simbol.',
        confirmButtonColor: '#3085d6'
      });
      return;
      }

    const data = {
      username: form.username.value,
      password: form.password.value,
      email: form.email.value,
      fullname: form.nama.value,
      alamat: form.alamat.value,
      nomor_hp: form.nohp.value
    };

    try {
      const res = await fetch(url+ '/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      
      if (result.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Pendaftaran Berhasil!',
          timer: 2000,
          showConfirmButton: false
        })
        // Redirect setelah 1 detik (1000 ms)
        setTimeout(() => {
          history.pushState(null, '', '/login');
          window.dispatchEvent(new Event('popstate'));
        }, 1000);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Daftar',
          text: result.message || 'Terjadi kesalahan.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan koneksi.');
    }
  });
}

// Navigasi SPA
window.navigate = function (event, path) {
  event.preventDefault();
  history.pushState(null, '', `/${path}`);
  window.dispatchEvent(new Event('popstate'));
};