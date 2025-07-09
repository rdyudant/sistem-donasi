import campaignPage from './pages/campaign.js';
import signupPage from './pages/signup.js';
import loginPage from './pages/login.js';
import detailCampaignPage from './pages/detailCampaign.js';
import dashboardPage from './pages/dashboard.js';
import tambahCampaignPage from './pages/tambahCampaign.js';
import editCampaignPage from './pages/editCampaign.js';

const routes = {
  '/': campaignPage,
  '/signup': signupPage,
  '/login': loginPage,
  '/campaign/:id': detailCampaignPage,
  '/dashboard': dashboardPage,
  '/tambah-campaign': tambahCampaignPage,
  '/edit-campaign/:id': editCampaignPage
};

function parseRoute(path) {
  if (path.startsWith('/campaign/')) {
    return '/campaign/:id';
  }
  if (path.startsWith('/edit-campaign/')) {
    return '/edit-campaign/:id';
  }
  return path;
}

export default function router() {
  const path = window.location.pathname;
  const matchedPath = parseRoute(path);
  const app = document.getElementById('app');

  const page = routes[matchedPath];
  if (page) {
    page(app);
  } else {
    app.innerHTML = '<h1 class="text-center mt-5">404 - Halaman tidak ditemukan</h1>';
  }
}