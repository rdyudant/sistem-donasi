import renderHeader from '../components/header.js';
import renderFooter from '../components/footer.js';
import { url } from './conf/baseurl.js';

export default function loginPage(app) {
  setPageTitle('Masuk Akun');
  app.innerHTML = `
    ${renderHeader(false)} <!-- tidak pakai button -->
    <main>
      <section class="py-5 mt-4">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-md-5">
              <h2 class="mb-4 text-center">Masuk Akun</h2>
              <form id="loginForm" class="shadow-lg p-4 bg-light rounded">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input type="text" class="form-control" id="username" name="username" required>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-group">
                    <input type="password" class="form-control" id="password" name="password" required>
                    <span class="input-group-text" id="togglePassword" style="cursor: pointer;">
                      <i class="bi bi-eye-slash" id="eyeIcon"></i>
                    </span>
                  </div>
                </div>

                <div class="d-grid">
                  <button type="submit" class="btn btn-primary">Masuk</button>
                </div>
              </form>
              <p class="mt-3 text-center">Belum punya akun? <a href="/signup" onclick="navigate(event, 'signup')">Daftar di sini</a></p>
            </div>
          </div>
        </div>
      </section>
    </main>
    ${renderFooter()}
  `;

  // Hide password input
  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const eyeIcon = document.getElementById('eyeIcon');

  togglePassword.addEventListener('click', () => {
    const isVisible = passwordInput.type === 'text';
    passwordInput.type = isVisible ? 'password' : 'text';
    eyeIcon.classList.toggle('bi-eye');
    eyeIcon.classList.toggle('bi-eye-slash');
  });

  // Event listener submit
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const credentials = {
      username: form.username.value,
      password: form.password.value,
    };

    try {
      const res = await fetch(url+'/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const result = await res.json();
      
      if (result.status === 200) {
        localStorage.setItem('token', result.refreshToken); // Simpan token ke localStorage
        Swal.fire({
          icon: 'success',
          title: 'Login Berhasil!',
          timer: 2000,
          showConfirmButton: false
        })
        // Redirect setelah 1 detik (1000 ms)
        setTimeout(() => {
          history.pushState(null, '', '/dashboard');
          window.dispatchEvent(new Event('popstate'));
        }, 1000);
      } else if( result.status === 202 ){
        Swal.fire({
          icon: 'error',
          title: 'Gagal Login',
          text: 'Password atau Username salah.',
          timer: 2000,
          showConfirmButton: false
        });
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Gagal Login',
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