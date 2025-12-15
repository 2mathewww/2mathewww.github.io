const galleryData = [
  {
    full: '/images/elaina.jpg',
    thumb: '/images/elaina.jpg',
    label: 'elaina.jpg',
    alt: 'Elaina'
  },
  {
    full: '/images/hanni.png',
    thumb: '/images/hanni.png',
    label: 'hanni.png',
    alt: 'Hanni'
  },
  {
    full: '/images/carmen.jpg',
    thumb: '/images/carmen.jpg',
    label: 'carmen.jpg',
    alt: 'Carmen'
  },
  {
    full: '/images/sagiri.jpg',
    thumb: '/images/sagiri.jpg',
    label: 'sagiri.jpg',
    alt: 'Sagiri Izumi'
  },
  {
    full: 'https://picsum.photos/seed/p5/800/800',
    thumb: 'https://picsum.photos/seed/p5/400/400',
    label: 'landing.png',
    alt: 'Project 5'
  },
  {
    full: 'https://picsum.photos/seed/p6/800/800',
    thumb: 'https://picsum.photos/seed/p6/400/400',
    label: 'admin.png',
    alt: 'Project 6'
  }
];

function fillGallery() {
  const grid = document.querySelector('.gallery-grid');

  galleryData.forEach(item => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.onclick = () => openLightbox(item.full);

    div.innerHTML = `
      <img src="${item.thumb}" alt="${item.alt}">
      <div class="gallery-label">${item.label}</div>
    `;

    grid.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', fillGallery);
