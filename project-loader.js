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
          document.getElementById('project-description').innerHTML = data.description.replace(/\n/g, '<br>');

          const mediaContainer = document.querySelector('.project-media');
          console.log('Media container:', mediaContainer);
          data.media.forEach(item => {
              console.log('Processing media item:', item);
              if (item.type === 'image') {
                  console.log('Creating image element for:', item.src);
                  const img = document.createElement('img');
                  img.src = item.src;
                  img.alt = item.alt;
                  console.log('Image element created:', img);
                  mediaContainer.appendChild(img);
              } else if (item.type === 'video') {
                  const video = document.createElement('video');
                  video.src = item.src;
                  video.controls = true;
                  mediaContainer.appendChild(video);
              } else if (item.type === 'vimeo') {
                  const wrapper = document.createElement('div');
                  wrapper.className = 'vimeo-wrapper';
                  
                  const iframe = document.createElement('iframe');
                  iframe.src = `https://player.vimeo.com/video/${item.src.split('/').pop()}`;
                  iframe.frameBorder = '0';
                  iframe.allow = 'autoplay; fullscreen; picture-in-picture';
                  iframe.allowFullscreen = true;
                  
                  wrapper.appendChild(iframe);
                  mediaContainer.appendChild(wrapper);
              }
          });

          const tagsContainer = document.getElementById('project-tags');
          if (data.details && data.details.technologies) {
              data.details.technologies.forEach((tech, index) => {
                  const span = document.createElement('span');
                  span.textContent = tech;
                  tagsContainer.appendChild(span);
              });
          }

          // Load additional details if needed
      })
      .catch(error => console.error('Error loading project data:', error));
}