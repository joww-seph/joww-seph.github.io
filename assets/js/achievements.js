/* ──────────────────────────────────────────
   CAROUSEL CONFIGURATION
   Drop images named 1.jpg, 2.jpg, … into the folder.
   No code changes needed.
────────────────────────────────────────── */
const GALLERIES = [
  {
    id:           'gcd4fe',
    basePath:     'assets/images/achievements/gcd4fe/',
    extensions:   ['jpg', 'jpeg', 'png', 'webp'],
    maxImages:    20,
    autoDelay:    3500,
  },
  {
    id:           'hack4gov',
    basePath:     'assets/images/achievements/hack4gov/',
    extensions:   ['jpg', 'jpeg', 'png', 'webp'],
    maxImages:    20,
    autoDelay:    3500,
  },
];

function probeImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload  = () => resolve(src);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function findImage(basePath, n, extensions) {
  for (const ext of extensions) {
    const src = `${basePath}${n}.${ext}`;
    const result = await probeImage(src);
    if (result) return result;
  }
  return null;
}

/* ──────────────────────────────────────────
   CAROUSEL CLASS
────────────────────────────────────────── */
class Carousel {
  constructor({ id, srcs, autoDelay }) {
    this.id        = id;
    this.srcs      = srcs;
    this.total     = srcs.length;
    this.visible   = 3;
    this.current   = 0;
    this.autoDelay = autoDelay;
    this.timer     = null;
    this.paused    = false;

    this.track   = document.getElementById(`carousel-track-${id}`);
    this.dotsEl  = document.getElementById(`carousel-dots-${id}`);
    this.prevBtn = document.getElementById(`carousel-prev-${id}`);
    this.nextBtn = document.getElementById(`carousel-next-${id}`);

    this._buildSlides();
    this._buildDots();
    this._updateState();
    this._bindEvents();
    this._startAuto();
  }

  _slideWidth() {
    const first = this.track.querySelector('.carousel-slide');
    if (!first) return 0;
    return first.getBoundingClientRect().width + 12;
  }

  _buildSlides() {
    this.srcs.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.dataset.index = i;

      const img = document.createElement('img');
      img.src = src;
      img.alt = `Photo ${i + 1}`;
      img.loading = 'lazy';
      img.decoding = 'async';

      slide.appendChild(img);
      slide.addEventListener('click', () => this._openLightbox(i));
      this.track.appendChild(slide);
    });
  }

  _buildDots() {
    const steps = Math.max(0, this.total - this.visible + 1);
    this.dotsEl.innerHTML = '';
    for (let i = 0; i < steps; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to position ${i + 1}`);
      dot.addEventListener('click', () => this._goTo(i));
      this.dotsEl.appendChild(dot);
    }
  }

  _updateState() {
    const maxIndex = Math.max(0, this.total - this.visible);
    const offset   = this.current * this._slideWidth();
    this.track.style.transform = `translateX(-${offset}px)`;

    [...this.dotsEl.children].forEach((dot, i) => {
      dot.classList.toggle('is-active', i === this.current);
    });

    this.prevBtn.disabled = this.current === 0;
    this.nextBtn.disabled = this.current >= maxIndex;
  }

  _goTo(index) {
    const maxIndex = Math.max(0, this.total - this.visible);
    this.current = Math.max(0, Math.min(index, maxIndex));
    this._updateState();
  }

  _prev() { this._goTo(this.current - 1); }
  _next() { this._goTo(this.current + 1); }

  _startAuto() {
    this.timer = setInterval(() => {
      if (this.paused) return;
      const maxIndex = Math.max(0, this.total - this.visible);
      if (this.current >= maxIndex) {
        this._goTo(0);
      } else {
        this._next();
      }
    }, this.autoDelay);
  }

  _pause()  { this.paused = true; }
  _resume() { this.paused = false; }

  _bindEvents() {
    this.prevBtn.addEventListener('click', () => { this._prev(); this._resetAutoTimer(); });
    this.nextBtn.addEventListener('click', () => { this._next(); this._resetAutoTimer(); });

    const section = document.getElementById(`carousel-section-${this.id}`);
    section.addEventListener('mouseenter', () => this._pause());
    section.addEventListener('mouseleave', () => this._resume());

    let touchStartX = 0;
    this.track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      this._pause();
    }, { passive: true });
    this.track.addEventListener('touchend', (e) => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 40) {
        dx > 0 ? this._next() : this._prev();
        this._resetAutoTimer();
      }
      this._resume();
    });

    const section2 = document.getElementById(`carousel-section-${this.id}`);
    section2.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { this._prev(); this._resetAutoTimer(); }
      if (e.key === 'ArrowRight') { this._next(); this._resetAutoTimer(); }
    });
  }

  _resetAutoTimer() {
    clearInterval(this.timer);
    this._startAuto();
  }

  _openLightbox(index) {
    currentLightboxSrcs  = this.srcs;
    currentLightboxIndex = index;
    renderLightbox();
    document.getElementById('lightbox').classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
}

/* ──────────────────────────────────────────
   BUILD ALL GALLERIES
────────────────────────────────────────── */
async function buildGallery(config) {
  const { id, basePath, extensions, maxImages, autoDelay } = config;

  /* Probe all slots in parallel instead of sequentially */
  const probes = Array.from({ length: maxImages }, (_, i) =>
    findImage(basePath, i + 1, extensions).then(src => ({ n: i + 1, src }))
  );
  const results = await Promise.all(probes);

  /* Keep found images in order, stopping at the first gap */
  const found = [];
  for (const { src } of results) {
    if (!src) break;
    found.push(src);
  }

  const placeholder = document.getElementById(`carousel-placeholder-${id}`);
  const section     = document.getElementById(`carousel-section-${id}`);

  if (found.length === 0) return;

  placeholder.style.display = 'none';
  section.style.display     = '';

  const carousel = new Carousel({ id, srcs: found, autoDelay });

  requestAnimationFrame(() => {
    carousel._updateState();
  });
}

GALLERIES.forEach(buildGallery);

/* ──────────────────────────────────────────
   LIGHTBOX
────────────────────────────────────────── */
let currentLightboxSrcs  = [];
let currentLightboxIndex = 0;

const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lightbox-img');
const lbCounter = document.getElementById('lightbox-counter');
const lbClose   = document.getElementById('lightbox-close');
const lbPrev    = document.getElementById('lightbox-prev');
const lbNext    = document.getElementById('lightbox-next');

function renderLightbox() {
  lbImg.src = currentLightboxSrcs[currentLightboxIndex];
  lbCounter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxSrcs.length}`;
  lbPrev.style.visibility = currentLightboxIndex === 0 ? 'hidden' : '';
  lbNext.style.visibility = currentLightboxIndex === currentLightboxSrcs.length - 1 ? 'hidden' : '';
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

lbPrev.addEventListener('click', () => {
  if (currentLightboxIndex > 0) {
    currentLightboxIndex--;
    renderLightbox();
  }
});

lbNext.addEventListener('click', () => {
  if (currentLightboxIndex < currentLightboxSrcs.length - 1) {
    currentLightboxIndex++;
    renderLightbox();
  }
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  lbPrev.click();
  if (e.key === 'ArrowRight') lbNext.click();
});
