import router from './router.js';

window.addEventListener('DOMContentLoaded', router);
window.addEventListener('popstate', router);

function toggleSearchBar(show = true) {
  const searchBar = document.getElementById('search-bar');
  if (searchBar) {
    searchBar.style.display = show ? 'block' : 'none';
  }
}

// Function to handle search
function handleSearch(event) {
  event.preventDefault();
  const searchTerm = document.getElementById('searchInput').value.trim();
  
  if (searchTerm) {
    // Here you can implement your search logic
    console.log('Searching for:', searchTerm);
    
    // Example: You can navigate to a search results page
    // window.navigate(event, `search?q=${encodeURIComponent(searchTerm)}`);
    
    // Or filter campaigns on the current page
    filterCampaigns(searchTerm);
  }
}

// Example function to filter campaigns (you can customize this)
function filterCampaigns(searchTerm) {
  // This is a basic example - you'll need to implement the actual filtering logic
  // based on your app structure
  
  const campaigns = document.querySelectorAll('.campaign-card');
  searchTerm = searchTerm.toLowerCase();
  
  campaigns.forEach(campaign => {
    const title = campaign.querySelector('.card-title').textContent.toLowerCase();
    const description = campaign.querySelector('.card-text').textContent.toLowerCase();
    
    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      campaign.style.display = 'block';
    } else {
      campaign.style.display = 'none';
    }
  });
  
  // Show search results message
  showSearchResults(searchTerm);
}

// Function to show search results message
function showSearchResults(searchTerm) {
  // Remove existing search message
  const existingMessage = document.querySelector('.search-results-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create new search message
  const campaignSection = document.querySelector('.container h2');
  if (campaignSection) {
    const searchMessage = document.createElement('div');
    searchMessage.className = 'alert alert-info search-results-message';
    searchMessage.innerHTML = `
      <div class="d-flex align-items-center justify-content-between">
        <span>Hasil pencarian untuk: <strong>"${searchTerm}"</strong></span>
        <button type="button" class="btn-close" onclick="clearSearch()" aria-label="Clear search"></button>
      </div>
    `;
    campaignSection.parentNode.insertBefore(searchMessage, campaignSection.nextSibling);
  }
}

// Function to clear search and show all campaigns
function clearSearch() {
  document.getElementById('searchInput').value = '';
  
  // Show all campaigns
  const campaigns = document.querySelectorAll('.campaign-card');
  campaigns.forEach(campaign => {
    campaign.style.display = 'block';
  });
  
  // Remove search message
  const searchMessage = document.querySelector('.search-results-message');
  if (searchMessage) {
    searchMessage.remove();
  }
}

// Optional: Add real-time search (search as you type)
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      const searchTerm = this.value.trim();
      
      if (searchTerm.length >= 2) {
        searchTimeout = setTimeout(() => {
          filterCampaigns(searchTerm);
        }, 300); // Delay 300ms for better performance
      } else if (searchTerm.length === 0) {
        clearSearch();
      }
    });
  }
});