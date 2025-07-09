export default function renderFooter() {
  return `
    <footer class="bg-dark text-white">
    <!-- Main Footer Content -->
    <div class="container py-4">
      <div class="row g-4">
        <!-- Brand Section -->
        <div class="col-lg-4 col-md-6">
          <h5 class="fw-bold mb-3">DonasiKita</h5>
          <p class="text-light mb-3">Platform donasi terpercaya yang menghubungkan para dermawan dengan mereka yang membutuhkan bantuan.</p>
          
          <!-- Social Media -->
          <div class="d-flex gap-2">
            <a href="#" class="btn btn-outline-light btn-sm rounded-circle" style="width: 36px; height: 36px;">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="btn btn-outline-light btn-sm rounded-circle" style="width: 36px; height: 36px;">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="btn btn-outline-light btn-sm rounded-circle" style="width: 36px; height: 36px;">
              <i class="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        
        <!-- Quick Links -->
        <div class="col-lg-2 col-md-6">
          <h6 class="fw-bold mb-3">Menu</h6>
          <ul class="list-unstyled footer-links">
            <li><a href="/" class="text-light text-decoration-none">Beranda</a></li>
            <li><a href="javascript:void(0)" class="text-light text-decoration-none">Kampanye</a></li>
            <li><a href="javascript:void(0)" class="text-light text-decoration-none">Tentang Kami</a></li>
            <li><a href="javascript:void(0)" class="text-light text-decoration-none">Kontak</a></li>
          </ul>
        </div>
        
        <!-- Categories -->
        <div class="col-lg-2 col-md-6">
          <h6 class="fw-bold mb-3">Kategori</h6>
          <ul class="list-unstyled footer-links">
            <li><a href="javascript:void(0)" class="text-light text-decoration-none">Pendidikan</a></li>
            <li><a href="javascript:void(0)" class="text-light text-decoration-none">Kesehatan</a></li>
            <li><a href="javascript:void(0)" class="text-light text-decoration-none">Bencana Alam</a></li>
            <li><a href="javascript:void(0)" class="text-light text-decoration-none">Sosial</a></li>
          </ul>
        </div>
        
        <!-- Contact Info -->
        <div class="col-lg-4 col-md-6">
          <h6 class="fw-bold mb-3">Hubungi Kami</h6>
          <div class="contact-info">
            <div class="d-flex align-items-center mb-2">
              <i class="fas fa-envelope me-2 text-primary"></i>
              <small class="text-light">info@donasikita.com</small>
            </div>
            <div class="d-flex align-items-center mb-2">
              <i class="fas fa-phone me-2 text-primary"></i>
              <small class="text-light">+62 21 1234 5678</small>
            </div>
            <div class="d-flex align-items-center">
              <i class="fas fa-map-marker-alt me-2 text-primary"></i>
              <small class="text-light">Jakarta, Indonesia</small>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Copyright -->
    <div class="border-top border-secondary">
      <div class="container py-3">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="text-center text-md-start mb-0">
              &copy; ${new Date().getFullYear()} DonasiKita.
            </p>
          </div>
          <div class="col-md-6">
            <div class="d-flex justify-content-center justify-content-md-end gap-3 mt-2 mt-md-0">
              <a href="javascript:void(0)" class="text-light text-decoration-none small">Privacy Policy</a>
              <a href="javascript:void(0)" class="text-light text-decoration-none small">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
  `;
}