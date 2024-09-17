document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const contentArea = document.querySelector('.content-area');
  
    function checkScroll() {
      const headerHeight = header.offsetHeight;
      const scrollPosition = window.pageYOffset;
      const contentTop = contentArea.offsetTop;
  
      if (scrollPosition > contentTop - headerHeight) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  
    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
  
    // Initial check in case the page is loaded scrolled down
    checkScroll();
  });