/* page-transitions.js */

// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
  // Add the fade-in class to the body to create an initial fade-in effect
  document.body.classList.add('fade-in');

  // Add click event listeners to all links on the page
  document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function(e) {
      // Check if the link is to a page on the same domain and not an internal navigation link
      if (this.hostname === window.location.hostname && !this.getAttribute('href').startsWith('#')) {
        // Prevent the default link behavior
        e.preventDefault();
        
        // Remove the fade-in class and add the fade-out class to create a fade-out effect
        document.body.classList.remove('fade-in');
        document.body.classList.add('fade-out');
        
        // Wait for the fade-out animation to complete before navigating to the new page
        setTimeout(() => {
          window.location = this.href;
        }, 300); // 300ms matches the transition duration in the CSS
      }
    });
  });
});

