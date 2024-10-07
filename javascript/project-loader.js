const projectCache = new Map();

async function loadProjectContent(projectId) {

  if (window.projectLoaded) return;
  const mediaContainer = document.querySelector('.project-media');
  const tagsContainer = document.getElementById('project-tags');
  if (mediaContainer) mediaContainer.innerHTML = '';
  if (tagsContainer) tagsContainer.innerHTML = '';

  const loadingMessage = document.createElement('p');
  loadingMessage.textContent = 'Loading project data...';
  mediaContainer.appendChild(loadingMessage);

  try {
    let data;
    if (projectCache.has(projectId)) {
      data = projectCache.get(projectId);
    } else {
      const response = await fetch(`projects/${projectId}.json`);
      if (!response.ok) throw new Error('Failed to fetch project data');
      data = await response.json();
      projectCache.set(projectId, data);
    }

    mediaContainer.removeChild(loadingMessage);

    document.title = `${data.title} - Gil Altarace Sherman`;
    document.getElementById('project-title').textContent = data.title;
    document.getElementById('project-description').innerHTML = data.description.replace(/\n/g, '<br>');

    if (data.media && data.media.length > 0) {
      data.media.forEach(item => renderMediaItem(item, mediaContainer));
    } else {
      const noMediaMessage = document.createElement('p');
      noMediaMessage.textContent = 'No media available for this project.';
      mediaContainer.appendChild(noMediaMessage);
    }

    if (data.details && data.details.technologies) {
      data.details.technologies.forEach(tech => {
        const span = document.createElement('span');
        span.textContent = tech;
        tagsContainer.appendChild(span);
      });
    }

    window.projectLoaded = true;
  } catch (error) {
    console.error('Error loading project data:', error);
    mediaContainer.removeChild(loadingMessage);
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Failed to load project data. Please try again later.';
    mediaContainer.appendChild(errorMessage);
  }
}

function renderMediaItem(item, container) {
  switch (item.type) {
    case 'image':
      renderImage(item, container);
      break;
    case 'video':
      renderVideo(item, container);
      break;
    case 'vimeo':
      renderVimeo(item, container);
      break;
    case 'youtube':
      renderYoutube(item, container);
      break;
    case 'sideBySide':
      renderSideBySide(item, container);
      break;
    default:
      console.warn(`Unsupported media type: ${item.type}`);
  }
}

function renderImage(item, container) {
  const img = document.createElement('img');
  img.src = item.src;
  img.alt = item.alt;
  img.loading = 'lazy';
  container.appendChild(img);
}

function renderVideo(item, container) {
  const video = document.createElement('video');
  video.src = item.src;
  video.controls = true;
  container.appendChild(video);
}

function renderVimeo(item, container) {
  const wrapper = document.createElement('div');
  wrapper.className = 'video-wrapper';
  
  const iframe = document.createElement('iframe');
  let src = item.src;
  
  if (!src.includes('player.vimeo.com')) {
    const videoId = src.split('/').pop().split('?')[0];
    src = `https://player.vimeo.com/video/${videoId}`;
  }
  
  src += (src.includes('?') ? '&' : '?') + 'autoplay=1&loop=1&muted=1';
  
  iframe.src = src;
  iframe.frameBorder = '0';
  iframe.allow = 'autoplay; fullscreen; picture-in-picture';
  iframe.allowFullscreen = true;
  
  wrapper.appendChild(iframe);
  container.appendChild(wrapper);
}

function renderYoutube(item, container) {
  const wrapper = document.createElement('div');
  wrapper.className = 'youtube-wrapper video-wrapper';
  
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${item.src}?autoplay=1&mute=1`;
  iframe.frameBorder = '0';
  iframe.allow = 'autoplay; fullscreen; picture-in-picture';
  iframe.allowFullscreen = true;
  
  wrapper.appendChild(iframe);
  container.appendChild(wrapper);
}

function renderSideBySide(item, container) {
  const sideBySideContainer = document.createElement('div');
  sideBySideContainer.className = 'side-by-side-container';
  item.images.forEach(image => {
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.loading = 'lazy';
    sideBySideContainer.appendChild(img);
  });
  container.appendChild(sideBySideContainer);
}

window.addEventListener('popstate', function(event) {
  if (event.state && event.state.projectId) {
    window.projectLoaded = false;
    loadProjectContent(event.state.projectId);
  } else {
    handleMainPageTransition();
  }
});

function handleMainPageTransition() {
  window.projectLoaded = false;
  window.location.href = 'index.html';
}
