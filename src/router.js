import loginPage from './pages/login.js';
import signupPage from './pages/signup.js';
import dashboardPage from './pages/dashboard.js';
import campaignPage from './pages/campaign.js';
import detailCampaignPage from './pages/detailCampaign.js';

const routes = {
  '/': campaignPage,
  '/login': loginPage,
  '/signup': signupPage,
  '/dashboard': dashboardPage,
  '/campaign/:id': detailCampaignPage,
};

function parseRoute(path) {
  if (path.startsWith('/campaign/')) {
    return '/campaign/:id';
  }
  return path;
}

export default function router() {
  const path = parseRoute(window.location.pathname);
  const app = document.getElementById('app');
  const render = routes[path];
  if (render) {
    render(app);
  } else {
    app.innerHTML = '<h1>404 - Not Found</h1>';
  }
}