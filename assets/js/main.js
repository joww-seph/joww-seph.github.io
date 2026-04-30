// ── 1. Theme Toggle ──────────────────────────────────────────
const ThemeManager = {
  STORAGE_KEY: 'portfolio-theme',

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    this.apply(theme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.apply(e.matches ? 'dark' : 'light');
      }
    });
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};

// ── 2. Navigation ─────────────────────────────────────────────
const NavManager = {
  init() {
    this.nav          = document.querySelector('.nav');
    this.mobileToggle = document.querySelector('.nav-mobile-toggle');
    this.mobileDrawer = document.querySelector('.nav-mobile-drawer');

    if (!this.nav) return;

    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.onScroll();
    this.setActiveLink();

    if (this.mobileToggle && this.mobileDrawer) {
      this.mobileToggle.addEventListener('click', () => this.toggleMobile());
      this.mobileDrawer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => this.closeMobile());
      });
      document.addEventListener('click', e => {
        if (!this.nav.contains(e.target)) this.closeMobile();
      });
    }
  },

  onScroll() {
    this.nav.classList.toggle('scrolled', window.scrollY > 10);
  },

  setActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  },

  toggleMobile() {
    this.mobileDrawer.classList.contains('open') ? this.closeMobile() : this.openMobile();
  },

  openMobile() {
    this.mobileDrawer.classList.add('open');
    this.mobileToggle.setAttribute('aria-expanded', 'true');
    this.mobileToggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
      </svg>`;
  },

  closeMobile() {
    this.mobileDrawer.classList.remove('open');
    this.mobileToggle.setAttribute('aria-expanded', 'false');
    this.mobileToggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>`;
  }
};

// ── 3. Scroll-to-Top ─────────────────────────────────────────
const ScrollTopManager = {
  init() {
    this.btn = document.querySelector('.scroll-top');
    if (!this.btn) return;

    window.addEventListener('scroll', () => {
      this.btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    this.btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

// ── 4. Scroll Animations ──────────────────────────────────────
const AnimationManager = {
  init() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(el => observer.observe(el));
  }
};

// ── 5. Project Asset Loader ───────────────────────────────────

const ProjectAssetManager = {
  EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],

  init() {
    const gallery = document.querySelector('#doc-gallery');
    if (!gallery) return;

    const slug = gallery.dataset.docProject;
    if (!slug) return;

    const inProjects = window.location.pathname.replace(/\\/g, '/').includes('/projects/');
    const base = inProjects ? '../assets/images/' : 'assets/images/';

    this.loadLogo(`${base}${slug}/logo`);
    this.loadHeader(`${base}${slug}/header`);
  },

  loadLogo(pathBase) {
    this.probe(pathBase, 0, img => {
      if (!img) return;

      const hero = document.querySelector('.project-detail-hero');
      if (!hero) return;
      const h1 = hero.querySelector('h1');
      if (!h1) return;

      const heroLogo = img.cloneNode(true);
      heroLogo.style.cssText = 'width:64px;height:64px;object-fit:contain;flex-shrink:0;border-radius:var(--radius-md)';

      const wrapper = document.createElement('div');
      const mb = h1.style.marginBottom || 'var(--space-4)';
      wrapper.style.cssText = `display:flex;align-items:center;gap:var(--space-4);margin-bottom:${mb}`;
      h1.style.marginBottom = '0';
      h1.parentNode.insertBefore(wrapper, h1);
      wrapper.appendChild(heroLogo);
      wrapper.appendChild(h1);
    });
  },

  loadHeader(pathBase) {
    this.probe(pathBase, 0, img => {
      if (!img) return;
      const placeholder = document.querySelector('.project-detail-image-placeholder');
      if (!placeholder) return;
      img.style.cssText = 'width:100%;border-radius:var(--radius-lg);display:block;border:1px solid var(--color-border)';
      img.className = 'fade-in visible';
      placeholder.replaceWith(img);
    });
  },

  loadCardImage(slug, card) {
    const imgDiv = card.querySelector('.project-card-image');
    if (!imgDiv) return;
    this.probe(`assets/images/${slug}/header`, 0, img => {
      if (!img) return;
      img.alt = slug;
      img.loading = 'lazy';
      const placeholder = imgDiv.querySelector('.project-card-image-placeholder');
      if (placeholder) placeholder.replaceWith(img);
    });
  },

  probe(pathBase, extIndex, callback) {
    if (extIndex >= this.EXTENSIONS.length) { callback(null); return; }
    const img = new Image();
    img.onload = () => callback(img);
    img.onerror = () => this.probe(pathBase, extIndex + 1, callback);
    img.src = `${pathBase}.${this.EXTENSIONS[extIndex]}`;
  }
};

// ── 6. Project Card Renderer ──────────────────────────────────
const ProjectsRenderer = {
  containerSelector: '#projects-grid',

  init() {
    this.container = document.querySelector(this.containerSelector);
    if (!this.container) return;

    if (typeof PROJECTS_CONFIG === 'undefined') {
      this.showError('PROJECTS_CONFIG not found. Make sure projects/config.js is included.');
      return;
    }

    this.projects = PROJECTS_CONFIG;
    this.render();
  },

  render() {
    this.container.innerHTML = '';

    if (!this.projects.length) {
      this.container.innerHTML = `
        <div class="empty-state">
          <p>No projects yet.</p>
        </div>`;
      return;
    }

    this.projects.forEach((project, index) => {
      this.container.appendChild(this.createCard(project, index));
    });

    document.querySelectorAll('.fade-in:not(.visible)').forEach(el => {
      setTimeout(() => el.classList.add('visible'), 50);
    });
  },

  createCard(project, index) {
    const imageHTML = project.image
      ? `<img src="${this.escapeHTML(project.image)}" alt="${this.escapeHTML(project.title)}" loading="lazy">`
      : `<div class="project-card-image-placeholder">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
             <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
           </svg>
         </div>`;

    const featuredBadge = project.featured
      ? `<span class="project-card-featured">Featured</span>`
      : '';

    const wipBadge = project.wip
      ? `<span class="project-card-wip">Work In Progress</span>`
      : '';

    const projectLink = project.file ? `projects/${project.file}` : '#';

    const card = document.createElement('article');
    card.className = 'project-card fade-in';
    card.style.transitionDelay = `${index * 0.05}s`;
    card.innerHTML = `
      <div class="project-card-image" style="position:relative">
        ${imageHTML}
        ${featuredBadge}
        ${wipBadge}
      </div>
      <div class="project-card-body">
        <h3 class="project-card-title">${this.escapeHTML(project.title)}</h3>
        <p class="project-card-description">${this.escapeHTML(project.description)}</p>
        <div class="project-card-footer">
          <a href="${projectLink}" class="project-card-link" aria-label="View ${this.escapeHTML(project.title)}">
            View
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" width="14" height="14">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </a>
        </div>
      </div>`;

    card.style.cursor = 'pointer';
    card.addEventListener('click', e => {
      if (!e.target.closest('a')) window.location.href = projectLink;
    });

    if (!project.image && project.file) {
      const slug = project.file.replace('.html', '');
      ProjectAssetManager.loadCardImage(slug, card);
    }

    return card;
  },

  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = String(str || '');
    return div.innerHTML;
  },

  showError(msg) {
    this.container.innerHTML = `
      <div class="empty-state">
        <p style="color:var(--color-error)">${msg}</p>
      </div>`;
  }
};

// ── 7. Documentation Gallery ──────────────────────────────────

const DocGalleryManager = {
  EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  MAX_IMAGES: 20,

  init() {
    const section = document.querySelector('#doc-gallery');
    if (!section) return;

    const slug = section.dataset.docProject;
    if (!slug) return;

    const grid = document.getElementById('doc-grid');
    if (!grid) return;

    const inProjects = window.location.pathname.replace(/\\/g, '/').includes('/projects/');
    const base = inProjects ? '../assets/images/' : 'assets/images/';
    const dir = `${base}${slug}/documentation/`;

    this.initLightbox();
    this.loadImages(dir, grid, section);
  },

  loadImages(dir, grid, section) {
    for (let n = 1; n <= this.MAX_IMAGES; n++) {
      this.probeImage(dir, n, 0, (img, num) => {
        if (!img) return;

        img.dataset.n = num;
        img.style.cssText = 'width:100%;height:220px;object-fit:cover;border-radius:8px;cursor:zoom-in;display:block;border:1px solid var(--color-border)';
        img.addEventListener('click', () => this.openLightbox(img.src));

        const children = grid.querySelectorAll('img');
        let inserted = false;
        for (const el of children) {
          if (parseInt(el.dataset.n) > num) {
            grid.insertBefore(img, el);
            inserted = true;
            break;
          }
        }
        if (!inserted) grid.appendChild(img);

        if (grid.children.length === 1) section.style.display = '';
      });
    }
  },

  probeImage(dir, n, extIndex, callback) {
    if (extIndex >= this.EXTENSIONS.length) { callback(null, n); return; }
    const img = new Image();
    img.onload = () => callback(img, n);
    img.onerror = () => this.probeImage(dir, n, extIndex + 1, callback);
    img.src = `${dir}${n}.${this.EXTENSIONS[extIndex]}`;
  },

  initLightbox() {
    const overlay = document.createElement('div');
    overlay.id = 'doc-lightbox';
    overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;cursor:zoom-out;align-items:center;justify-content:center';
    overlay.innerHTML = '<img style="max-width:90vw;max-height:90vh;object-fit:contain;border-radius:8px">';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => { overlay.style.display = 'none'; });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') overlay.style.display = 'none';
    });

    this._lightbox = overlay;
    this._lightboxImg = overlay.querySelector('img');
  },

  openLightbox(src) {
    this._lightboxImg.src = src;
    this._lightbox.style.display = 'flex';
  }
};

// ── 8. Contact Form Handler ───────────────────────────────────
const ContactFormManager = {
  init() {
    this.form = document.querySelector('#contact-form');
    if (!this.form) return;
    this.form.addEventListener('submit', e => this.onSubmit(e));
  },

  onSubmit(e) {
    let valid = true;

    this.form.querySelectorAll('[required]').forEach(field => {
      const group = field.closest('.form-group');
      if (!field.value.trim()) {
        group && group.classList.add('has-error');
        valid = false;
      } else {
        group && group.classList.remove('has-error');
      }
    });

    const emailField = this.form.querySelector('[type="email"]');
    if (emailField && emailField.value && !this.isValidEmail(emailField.value)) {
      emailField.closest('.form-group')?.classList.add('has-error');
      valid = false;
    }

    if (!valid) e.preventDefault();
  },

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
};

// ── 9. Initialization ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  NavManager.init();
  ScrollTopManager.init();
  AnimationManager.init();
  ProjectsRenderer.init();
  ProjectAssetManager.init();
  DocGalleryManager.init();
  ContactFormManager.init();

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => ThemeManager.toggle());
  });
});
