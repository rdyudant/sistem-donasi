export default function renderHeader(showButton = true, showLogout = false) {
  return `
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top">
    <div class="container">
      <a class="navbar-brand fw-bold" href="/">DonasiKita</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="d-flex ms-auto align-items-center gap-2 mt-1">
          ${showButton ? `
          <a class="btn btn-primary" href="/login">Masuk</a>
          <a class="btn btn-info text-white" href="/signup">Daftar</a>
          ` : ''}
          ${showLogout ? `
          <button class="btn btn-danger" id="btnLogout">Logout</button>
          ` : ''}
        </div>
      </div>
    </div>
  </nav>
  `;
}