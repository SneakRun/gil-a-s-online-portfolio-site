document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  if (projectId) {
      loadProjectContent(projectId);
  }
});

function loadProjectContent(projectId) {
  // Fetch project data from a JSON file or an API
  fetch(`projects/${projectId}.json`)
      .then(response => response.json())
      .then(data => {
          document.title = `${data.title} - Gil Altarace Sherman`;
          document.getElementById('project-title').textContent = data.title;
          document.getElementById('project-description').textContent = data.description;

          const mediaContainer = document.querySelector('.project-media');
          data.media.forEach(item => {
              if (item.type === 'image') {
                  const img = document.createElement('img');
                  img.src = item.src;
                  img.alt = item.alt;
                  mediaContainer.appendChild(img);
              } else if (item.type === 'video') {
                  const video = document.createElement('video');
                  video.src = item.src;
                  video.controls = true;
                  mediaContainer.appendChild(video);
              }
          });

          // Load additional details if needed
      })
      .catch(error => console.error('Error loading project data:', error));
}