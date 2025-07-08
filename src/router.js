import campaignPage from './pages/campaign.js';
import signupPage from './pages/signup.js';
import loginPage from './pages/login.js';
import detailCampaignPage from './pages/detailCampaign.js';

const routes = {
  '/': campaignPage,
  '/daftar': signupPage,
  '/masuk': loginPage,
  '/campaign/:id': detailCampaignPage
};

function parseRoute(path) {
  if (path.startsWith('/campaign/')) {
    return '/campaign/:id';
  }
  return path;
}

export default function router() {
  const path = window.location.pathname;
  const app = document.getElementById('app');

  const page = routes[path];
  if (page) {
    page(app);
  } else {
    app.innerHTML = '<h1>404 - Halaman tidak ditemukan</h1>';
  }
}