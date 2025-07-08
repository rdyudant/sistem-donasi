import campaignPage from './pages/campaign.js';
import loginPage from './pages/login.js';
import signupPage from './pages/signup.js';
import detailCampaignPage from './pages/detailCampaign.js';

const routes = {
  '/': campaignPage,
  '/login': loginPage,
  '/signup': signupPage,
  '/campaign/:id': detailCampaignPage,
};

function matchRoute(path) {
  // Khusus untuk route dinamis campaign
  if (path.startsWith('/campaign/')) {
    return '/campaign/:id';
  }

  // Route statis biasa
  return path;
}

export default function router() {
  const path = window.location.pathname;
  const app = document.getElementById('app');

  const matched = matchRoute(path);
  const render = routes[matched];

  if (render) {
    render(app);
  } else {
    app.innerHTML = `<h1 class="text-center mt-5">404 - Halaman tidak ditemukan</h1>`;
  }
}