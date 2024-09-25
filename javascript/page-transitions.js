/* page-transitions.js */

// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
  // Add the fade-in class to the body to create an initial fade-in effect
  document.body.classList.add('fade-in');

  // Function to handle page transitions
  function handlePageTransition(url) {
    document.body.classList.remove('fade-in');
    document.body.classList.add('fade-out');

    setTimeout(() => {
      if (url.includes('#')) {
        const sectionId = url.split('#')[1];
        showSection(sectionId + '-section');
        history.pushState({ section: sectionId }, '', url);
      } else {
        window.location = url;
      }
      document.body.classList.remove('fade-out');
      document.body.classList.add('fade-in');
    }, 300);
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
  window.addEventListener('popstate', function() {
    handleSubpageTransition();
  });
});

