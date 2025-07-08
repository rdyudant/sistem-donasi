export default function signupPage(app) {
  app.innerHTML = `
    <main>
      <section class="py-5 mt-4">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-6">
              <h2 class="mb-4 text-center">Buat Akun Baru</h2>
              <form id="signupForm" class="shadow p-4 bg-light rounded">
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
  `;

  // Event listener submit
  const form = document.getElementById('signupForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      username: form.username.value,
      password: form.password.value,
      email: form.email.value,
      nama: form.nama.value,
      alamat: form.alamat.value,
      nohp: form.nohp.value
    };

    try {
      const res = await fetch('http://localhost:3000/api/daftar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (res.ok) {
        alert('Pendaftaran berhasil!');
        history.pushState(null, '', '/login');
        window.dispatchEvent(new Event('popstate'));
      } else {
        alert(result.message || 'Pendaftaran gagal.');
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