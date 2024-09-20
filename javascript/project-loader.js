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
          if (data.media && data.media.length > 0) {
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
                      iframe.src = `https://player.vimeo.com/video/${item.src.split('/').pop()}?loop=1&autoplay=1&muted=1`;
                      iframe.frameBorder = '0';
                      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
                      iframe.allowFullscreen = true;
                      
                      wrapper.appendChild(iframe);
                      mediaContainer.appendChild(wrapper);
                  } else if (item.type === 'youtube') {
                      const wrapper = document.createElement('div');
                      wrapper.className = 'youtube-wrapper';
                      
                      const iframe = document.createElement('iframe');
                      iframe.src = `https://www.youtube.com/embed/${item.src}`;
                      iframe.frameBorder = '0';
                      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
                      iframe.allowFullscreen = true;
                      
                      wrapper.appendChild(iframe);
                      mediaContainer.appendChild(wrapper);
                  } else if (item.type === 'sideBySide') {
                      const sideBySideContainer = document.createElement('div');
                      sideBySideContainer.className = 'side-by-side-container';
                      item.images.forEach(image => {
                          const img = document.createElement('img');
                          img.src = image.src;
                          img.alt = image.alt;
                          sideBySideContainer.appendChild(img);
                      });
                      mediaContainer.appendChild(sideBySideContainer);
                  }
              });
          } else {
              // Handle case where there are no media items
              const noMediaMessage = document.createElement('p');
              noMediaMessage.textContent = 'No media available for this project.';
              mediaContainer.appendChild(noMediaMessage);
          }

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