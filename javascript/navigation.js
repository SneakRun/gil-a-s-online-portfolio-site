let currentSection = 'work';

function showSection(sectionId) {
  if (sectionId === currentSection + '-section') return;

  document.getElementById('work-section').style.display = 'none';
  document.getElementById('about-section').style.display = 'none';
  document.getElementById('contact-section').style.display = 'none';
  document.getElementById(sectionId).style.display = 'block';

  if (sectionId === 'work-section') {
    document.querySelector('.portfolio-grid').style.display = 'grid';
    renderPortfolioGrid(); // Re-render the grid when showing the work section
  }

  currentSection = sectionId.replace('-section', '');
  updateActiveNavLink();
  history.pushState({ section: currentSection }, '', `#${currentSection}`);
}

function handleSubpageTransition() {
  const hash = window.location.hash.slice(1);
  if (hash) {
    showSection(`${hash}-section`);
  } else {
    showSection('work-section');
  }
  document.body.classList.remove('fade-out');
  document.body.classList.add('fade-in');
}

function updateActiveNavLink() {
  const navLinks = document.querySelectorAll('.header nav a');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

function initializeNavigation() {
  document.querySelector('.main-title a').addEventListener('click', function(e) {
    e.preventDefault();
    showSection('work-section');
  });

  document.querySelector('a[href="#about"]').addEventListener('click', function(e) {
    e.preventDefault();
    showSection('about-section');
  });

  document.querySelector('a[href="#contact"]').addEventListener('click', function(e) {
    e.preventDefault();
    showSection('contact-section');
  });

  updateActiveNavLink();
  showSection('work-section'); // Ensure work section is visible by default
  renderPortfolioGrid(); // Call this function to render the grid
}

document.addEventListener('DOMContentLoaded', initializeNavigation);

window.addEventListener('popstate', function(event) {
  const url = window.location.href;
  if (url.includes('#')) {
    handleSubpageTransition();
  } else {
    handleMainPageTransition();
  }
});