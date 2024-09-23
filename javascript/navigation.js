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
});