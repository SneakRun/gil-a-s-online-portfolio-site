/* page-transitions.js */

// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
  // Add the fade-in class to the body to create an initial fade-in effect
  document.body.classList.add('fade-in');

  // Function to handle page transitions
  function handlePageTransition(url, isPopState = false) {
    const currentPath = window.location.pathname;
    const newPath = new URL(url, window.location.origin).pathname;

    if (currentPath === newPath && url.includes('#')) {
      const sectionId = url.split('#')[1];
      showSection(sectionId + '-section');
      if (!isPopState) {
        history.pushState({ section: sectionId }, '', url);
      }
      return;
    }

    document.body.classList.add('fade-out');

    if (!isPopState) {
      // Start loading the new page immediately
      fetch(url)
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const newDoc = parser.parseFromString(html, 'text/html');
          document.body.innerHTML = newDoc.body.innerHTML;
          document.title = newDoc.title;
          
          // Update the URL
          history.pushState({}, '', url);
          
          // Re-attach event listeners and initialize scripts
          initializeScripts();
          
          document.body.classList.remove('fade-out');
          document.body.classList.add('fade-in');
        })
        .catch(error => {
          console.error('Error loading new page:', error);
          window.location = url; // Fallback to traditional navigation
        });
    } else {
      document.body.classList.remove('fade-out');
      document.body.classList.add('fade-in');
    }
  }

  function initializeScripts() {
    if (typeof initializeNavigation === 'function') {
      initializeNavigation();
    }
    if (typeof loadProjectContent === 'function') {
      const urlParams = new URLSearchParams(window.location.search);
      const projectId = urlParams.get('id');
      if (projectId) {
        loadProjectContent(projectId);
      }
    }
    // Add other initialization functions as needed
  }

  // Add click event listeners to all links on the page
  document.body.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.hostname === window.location.hostname) {
      e.preventDefault();
      handlePageTransition(link.href);
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function(event) {
    const url = window.location.href;
    handlePageTransition(url, true);
  });
});

