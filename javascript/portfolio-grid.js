// Portfolio grid
const portfolioItems = [
  {
    id: 'titus-lempereur',
    title: 'Titus L\'Empereur: Opera Backdrop Design',
    description: 'Designed in Blender for the Carl Maria von Webern Theatre in Munich, Germany, 2024',
    image: 'videos/titus.webp',
    width: 480,
    height: 270
  },
  {
    id: 'john-hardy',
    title: 'R/GA Contract: John Hardy \'Moment Maker\'',
    description: 'Web-based procedural flower interface for user-end shopping experience, 2024',
    image: 'videos/john-hardy.webp',
    width: 480,
    height: 270
  },
  {
    id: 'gasoline-valley',
    title: 'It Took Three Weeks To Scroll Through The Gasoline Valley',
    description: 'Digital world made for Central Saint Martins Virtual Group Show, made in Blender, 2022',
    image: 'videos/gasoline-valley.webp',
    width: 480,
    height: 270
  },
  {
    id: 'zeta-angel',
    title: 'Zeta_Angel',
    description: 'Unity-based interactive game environment, made for Hypha Studios\' \'HARD WIRED\' Exhibition, London, 2024',
    image: 'videos/zeta-angel-cover.webp',
    width: 480,
    height: 270
  },
  {
    id: 'neo-starcadia',
    title: 'Neo-Starcadia',
    description: 'Unity-based interactive illustration experience, made for Creative Computing Institute Grad Show, 2022',
    image: 'videos/neo-starcadia.webp',
    width: 480,
    height: 270
  },
  {
    id: 'dream-eater',
    title: 'Dream Eater',
    description: 'Unity-based interactive game environment, made for Central Saint Martins Degree Show, 2023',
    image: 'videos/dream-eater.webp',
    width: 480,
    height: 270
  },
  {
    id: 'online-portfolio',
    title: 'Online Portfolio Website',
    description: 'Made in HTML, CSS, and Javascript, rebuilt completely for 2024',
    image: 'videos/online-portfolio.webp',
    width: 480,
    height: 270
  },
  {
    id: 'pulse-out',
    title: 'Pulse-Out!',
    description: 'AI-assisted web-based arcade game, made in Javascript, 2024',
    image: 'videos/pulse-out.webp',
    width: 480,
    height: 270
  },
  {
    id: 'cubitts',
    title: 'Sunglasses Design Commission for Cubitts',
    description: 'Designed and manufactured as part of Cubitts\' \'Artists of Hampstead\' Collection, 2022',
    image: 'images/cubitts.webp',
    width: 480,
    height: 270
  },
  {
    id: 'plant-growth-visualiser',
    title: 'Plant Growth Visualiser',
    description: 'Arduino x p5.js product prototype for human-centred digital design, 2022',
    image: 'images/plant-growth-vis.webp',
    width: 480,
    height: 270
  },
  {
    id: 'remesh',
    title: 'Remesh',
    description: 'Procedurally generated typeface, made in Blender, 2023',
    image: 'videos/remesh.webp',
    width: 480,
    height: 270
  }
];

function createPortfolioItem(item) {
  return `
    <div class="portfolio-item">
      <a href="project-template.html?id=${item.id}" class="portfolio-item-link">
        <div class="portfolio-item-media">
          <img src="${item.image}" alt="${item.title}" loading="lazy" width="${item.width}" height="${item.height}">
        </div>
        <div class="portfolio-item-text">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      </a>
    </div>
  `;
}

function renderPortfolioGrid() {
  const gridContainer = document.querySelector('.portfolio-grid');
  const gridContent = portfolioItems.map(createPortfolioItem).join('');
  gridContainer.innerHTML = gridContent;
}

document.addEventListener('DOMContentLoaded', renderPortfolioGrid);
