// Achieve Academy Gallery JS

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilter();
  initLightbox();
});

function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length === 0 || galleryItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle Active States on Buttons
      filterBtns.forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white shadow-md');
        b.classList.add('bg-white', 'dark:bg-slate-900', 'text-slate-600', 'dark:text-slate-400', 'border', 'border-slate-200', 'dark:border-slate-800');
      });
      btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');
      btn.classList.remove('bg-white', 'dark:bg-slate-900', 'text-slate-600', 'dark:text-slate-400', 'border', 'border-slate-200', 'dark:border-slate-800');

      const filterValue = btn.getAttribute('data-filter');

      // Filter gallery cards
      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          // Force a tiny reflow for transition
          setTimeout(() => {
            item.classList.add('scale-100', 'opacity-100');
            item.classList.remove('scale-95', 'opacity-0');
          }, 10);
        } else {
          item.classList.add('scale-95', 'opacity-0');
          item.classList.remove('scale-100', 'opacity-100');
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item img');
  if (galleryItems.length === 0) return;

  // Create Lightbox Markup and append to body
  const lightbox = document.createElement('div');
  lightbox.id = 'gallery-lightbox';
  lightbox.className = 'fixed inset-0 z-50 bg-slate-950/90 flex flex-col items-center justify-center p-4 hidden opacity-0 transition-opacity duration-300';
  lightbox.innerHTML = `
    <!-- Close button -->
    <button id="lightbox-close" class="absolute top-6 right-6 text-white hover:text-blue-400 transition-colors p-2" aria-label="Close Lightbox">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>

    <!-- Navigation -->
    <button id="lightbox-prev" class="absolute left-6 text-white hover:text-blue-400 transition-colors p-2" aria-label="Previous Image">
      <svg class="w-8 h-8 rtl-flip" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
    </button>
    
    <button id="lightbox-next" class="absolute right-6 text-white hover:text-blue-400 transition-colors p-2" aria-label="Next Image">
      <svg class="w-8 h-8 rtl-flip" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
    </button>

    <!-- Content -->
    <div class="max-w-4xl max-h-[80vh] w-full flex items-center justify-center">
      <img id="lightbox-img" src="" alt="Lightbox View" class="max-w-full max-h-[75vh] object-contain rounded shadow-2xl transition-transform duration-300">
    </div>

    <!-- Title / Caption -->
    <div class="mt-4 text-center">
      <p id="lightbox-caption" class="text-white text-base font-medium tracking-wide"></p>
      <p id="lightbox-counter" class="text-slate-400 text-xs mt-1"></p>
    </div>
  `;
  
  document.body.appendChild(lightbox);

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  let activeImages = [];
  let currentIndex = 0;

  // Open Lightbox
  const openLightbox = (imgSrc, imgAlt, index, currentSet) => {
    activeImages = Array.from(currentSet);
    currentIndex = index;

    updateLightboxContent();

    lightbox.classList.remove('hidden');
    setTimeout(() => {
      lightbox.classList.remove('opacity-0');
    }, 10);
  };

  const updateLightboxContent = () => {
    const currentImg = activeImages[currentIndex];
    if (!currentImg) return;

    lightboxImg.src = currentImg.src;
    lightboxCaption.textContent = currentImg.alt || 'Gallery View';
    lightboxCounter.textContent = `${currentIndex + 1} of ${activeImages.length}`;
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % activeImages.length;
    updateLightboxContent();
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + activeImages.length) % activeImages.length;
    updateLightboxContent();
  };

  const closeLightbox = () => {
    lightbox.classList.add('opacity-0');
    setTimeout(() => {
      lightbox.classList.add('hidden');
    }, 300);
  };

  // Add click handlers on active images
  document.querySelectorAll('.gallery-item img').forEach((img, idx) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      // Find all visible images at time of click
      const visibleImgs = Array.from(document.querySelectorAll('.gallery-item'))
        .filter(item => item.style.display !== 'none')
        .map(item => item.querySelector('img'));
      
      const matchIdx = visibleImgs.indexOf(img);
      openLightbox(img.src, img.alt, matchIdx !== -1 ? matchIdx : 0, visibleImgs);
    });
  });

  // Action Triggers
  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  // Close on background click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.id === 'lightbox-img' || e.target.parentElement.id === 'lightbox-img') {
      if (e.target.id !== 'lightbox-img') {
        closeLightbox();
      }
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}
