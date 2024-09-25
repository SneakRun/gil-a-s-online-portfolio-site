let currentSection = 'work';

function showSection(sectionId) {
  if (sectionId === currentSection) return;

  document.getElementById('work-section').style.display = 'none';
  document.getElementById('about-section').style.display = 'none';
  document.getElementById('contact-section').style.display = 'none';
  document.getElementById(sectionId).style.display = 'block';

  if (sectionId === 'work-section') {
    document.querySelector('.portfolio-grid').style.display = 'grid';
  }

  currentSection = sectionId.replace('-section', '');
  updateActiveNavLink();
  history.pushState({ section: currentSection }, '', `#${currentSection}`);
}

// Add this function to handle transitions from subpages
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

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.main-title a').addEventListener('click', function(e) {
    e.preventDefault();
    if (currentSection !== 'work') {
      document.body.classList.remove('fade-out');
      document.body.classList.add('fade-in');
      showSection('work-section');
    }
  });

  document.querySelector('a[href="#about"]').addEventListener('click', function(e) {
    e.preventDefault();
    document.body.classList.remove('fade-out');
    document.body.classList.add('fade-in');
    showSection('about-section');
  });

  document.querySelector('a[href="#contact"]').addEventListener('click', function(e) {
    e.preventDefault();
    document.body.classList.remove('fade-out');
    document.body.classList.add('fade-in');
    showSection('contact-section');
  });

  updateActiveNavLink();

  // Add this line to handle initial load or refresh
  handleSubpageTransition();
});

window.addEventListener('popstate', function(event) {
  if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
    handleSubpageTransition();
  }
});