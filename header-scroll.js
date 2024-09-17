document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const headerAsciiCanvas = document.getElementById('header-ascii-canvas');
    const contentArea = document.querySelector('.content-area') || document.querySelector('.subpage-content-area');

    function checkScroll() {
        const headerHeight = header.offsetHeight;
        const scrollPosition = window.pageYOffset;
        const contentTop = contentArea.offsetTop;

        if (scrollPosition > contentTop - headerHeight) {
            header.classList.add('scrolled');
            if (headerAsciiCanvas) {
                headerAsciiCanvas.style.opacity = '1';
            }
        } else {
            header.classList.remove('scrolled');
            if (headerAsciiCanvas) {
                headerAsciiCanvas.style.opacity = '0';
            }
        }
    }

    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    // Initial check in case the page is loaded scrolled down
    checkScroll();
});