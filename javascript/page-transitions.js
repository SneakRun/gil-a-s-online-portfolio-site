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
      window.location = url;
    }, 300); // 300ms matches the transition duration in the CSS
  }

  // Add click event listeners to all links on the page
  document.body.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.hostname === window.location.hostname && !link.getAttribute('href').startsWith('#')) {
      e.preventDefault();
      handlePageTransition(link.href);
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function() {
    handlePageTransition(window.location.href);
  });
});

