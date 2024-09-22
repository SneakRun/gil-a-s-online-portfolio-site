document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const headerHeight = header.offsetHeight;

    function checkScroll() {
        const scrollPosition = window.scrollY;

        if (scrollPosition > headerHeight) {
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