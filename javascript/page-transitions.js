/* page-transitions.js */

// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
  // Add the fade-in class to the body to create an initial fade-in effect
  document.body.classList.add('fade-in');

  // Add click event listeners to all links on the page
  document.body.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.hostname === window.location.hostname && !link.getAttribute('href').startsWith('#')) {
      // Prevent the default link behavior
      e.preventDefault();
      
      // Remove the fade-in class and add the fade-out class to create a fade-out effect
      document.body.classList.remove('fade-in');
      document.body.classList.add('fade-out');
      
      // Wait for the fade-out animation to complete before navigating to the new page
      setTimeout(() => {
        window.location = link.href;
      }, 300); // 300ms matches the transition duration in the CSS
    }
  });

  window.addEventListener('popstate', function(event) {
    if (event.state) {
      navigateTo(document.location.href, false);
    }
  });
});

function navigateTo(url, addToHistory = true) {
  document.body.classList.remove('fade-in');
  document.body.classList.add('fade-out');

  setTimeout(() => {
    if (addToHistory) {
      history.pushState({ url: url }, '', url);
    }
    window.location = url;
  }, 300);
}

