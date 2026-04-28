/* ================================================
   STHEFANY — main.js
================================================ */

/* ---- LENIS SMOOTH SCROLL (opcional — não bloqueia o site se falhar) ---- */
try {
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ duration: 1.35, touchMultiplier: 2 });
    if (typeof gsap !== 'undefined') {
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      (function tick(t) { lenis.raf(t); requestAnimationFrame(tick); })(performance.now());
    }
  }
} catch (e) { /* Lenis falhou — scroll nativo continua funcionando */ }

const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navMenu     = document.getElementById('nav-menu');
const navOverlay  = document.getElementById('nav-overlay');
const backTop     = document.getElementById('back-top');
const progressBar = document.getElementById('scroll-progress');

/* ---- SCROLL UNIFICADO (navbar + progress + active-nav) ---- */
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');

window.addEventListener('scroll', () => {
  const y   = window.scrollY;
  const doc = document.documentElement;

  navbar.classList.toggle('scrolled', y > 55);
  backTop?.classList.toggle('visible', y > 400);

  if (progressBar) {
    progressBar.style.width = (y / (doc.scrollHeight - doc.clientHeight) * 100) + '%';
  }

  const pos = y + navbar.offsetHeight + 10;
  let activeId = null;
  sections.forEach(s => {
    if (s.offsetTop <= pos && s.offsetTop + s.offsetHeight > pos) activeId = s.id;
  });
  if (activeId) {
    navLinks.forEach(l => l.classList.toggle('active-section', l.getAttribute('href') === '#' + activeId));
  }
}, { passive: true });

/* ---- MENU MOBILE ---- */
function openMenu() {
  navMenu.classList.add('open');
  hamburger.classList.add('open');
  navOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  navMenu.classList.remove('open');
  hamburger.classList.remove('open');
  navOverlay.classList.remove('active');
  document.body.style.overflow = '';
}
hamburger.addEventListener('click', () => navMenu.classList.contains('open') ? closeMenu() : openMenu());
navOverlay.addEventListener('click', closeMenu);
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 8, behavior: 'smooth' });
  });
});

/* ---- TABS (genérico — unifica repertório e portfólio) ---- */
function initTabs(dataAttr, panePrefix, paneSelector) {
  document.querySelectorAll('[data-' + dataAttr + ']').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-' + dataAttr + ']').forEach(b => b.classList.remove('active'));
      document.querySelectorAll(paneSelector).forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const pane = document.getElementById(panePrefix + btn.dataset[dataAttr]);
      if (pane) pane.classList.add('active');
    });
  });
}
initTabs('tab',  'tab-',  '.tab-pane');
initTabs('ptab', 'ptab-', '.ptab-pane');

/* ---- FAQ ACCORDION ---- */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ---- TESTIMONIALS SLIDER ---- */
(function () {
  const track    = document.getElementById('slider-track');
  const dotsWrap = document.getElementById('sl-dots');
  if (!track) return;

  const slides = track.querySelectorAll('.tcard');
  let current  = 0;
  let autoTimer;
  let touchStartX = 0;

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Depoimento ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });

  function goTo(n) {
    current = (n + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dotsWrap.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 6000); }
  function stopAuto()  { clearInterval(autoTimer); }

  document.getElementById('prev-btn')?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  document.getElementById('next-btn')?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { stopAuto(); goTo(current + (dx < 0 ? 1 : -1)); startAuto(); }
  });

  startAuto();
})();

/* ---- SCROLL REVEAL ---- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

/* ---- BACK TO TOP ---- */
backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


/* ---- COUNTER ANIMADO — STATS (rAF, pausa em abas ocultas) ---- */
(function () {
  const statsEl = document.querySelector('.about-stats');
  if (!statsEl) return;

  function animateCounter(el) {
    const text  = el.textContent.trim();
    /* suporta "1M+", "5+", "100%" — extrai número, prefixo-M e sufixo */
    const match = text.match(/^([\d.]+)(M?)(.*)$/);
    if (!match) return;
    const raw    = parseFloat(match[1]);
    const milli  = match[2] === 'M';   /* flag para valores em milhões */
    const suffix = (match[2] || '') + (match[3] || '');
    const end    = milli ? raw * 1000000 : raw;
    const dur    = 1800;
    let startTime = null;

    el.textContent = '0' + suffix;
    function step(ts) {
      if (!startTime) startTime = ts;
      const t   = Math.min((ts - startTime) / dur, 1);
      const cur = Math.floor(t * end);
      /* exibe compacto: ≥1M → "1M+", valores normais direto */
      el.textContent = milli
        ? (cur / 1000000).toFixed(cur < 1000000 ? 0 : 0) + 'M' + (match[3] || '')
        : cur + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        statsEl.querySelectorAll('.stat-num').forEach(animateCounter);
        obs.disconnect();
      }
    });
  }, { threshold: 0.4 }).observe(statsEl);
})();

/* ---- FORMULÁRIO (Formspree) ---- */
const form      = document.getElementById('cform');
const submitBtn = document.getElementById('submit-btn');

if (form && submitBtn) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (form.action.includes('SEU_ID_FORMSPREE')) {
      alert('Configure o Formspree: substitua SEU_ID_FORMSPREE no index.html\nAcesse: https://formspree.io');
      return;
    }

    const orig = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled  = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
        submitBtn.style.background  = '#2ecc71';
        submitBtn.style.borderColor = '#2ecc71';
        form.reset();
      } else {
        throw new Error('erro');
      }
    } catch {
      submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erro — tente pelo WhatsApp';
      submitBtn.style.background  = '#e74c3c';
      submitBtn.style.borderColor = '#e74c3c';
    } finally {
      setTimeout(() => {
        submitBtn.innerHTML = orig;
        submitBtn.style.background  = '';
        submitBtn.style.borderColor = '';
        submitBtn.disabled = false;
      }, 4500);
    }
  });
}

/* ================================================
   LUXURY LAYER — GSAP · Cursor · Magnetic · Parallax
   Todos os efeitos são opcionais — falha silenciosa
================================================ */
try {
  if (typeof gsap === 'undefined') throw new Error('GSAP não carregou');

  /* ScrollTrigger opcional */
  const hasST = typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  /* ---- HERO CINEMATIC ENTRANCE ---- */
  const heroEls = ['.hero-pre', '.hero-name', '.hero-tagline', '.hero-btns', '.hero-scroll'];
  gsap.set(heroEls, { opacity: 0, y: 20 });

  gsap.timeline({ delay: 0.2 })
    .to('.hero-pre',     { opacity: 1, y: 0, duration: 0.8,  ease: 'power3.out' })
    .to('.hero-name',    { opacity: 1, y: 0, duration: 1.1,  ease: 'power3.out', scale: 1 }, '-=0.4')
    .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.7,  ease: 'power2.out' }, '-=0.5')
    .to('.hero-btns',    { opacity: 1, y: 0, duration: 0.7,  ease: 'power2.out' }, '-=0.45')
    .to('.hero-scroll',  { opacity: 0.65, y: 0, duration: 0.5 }, '-=0.3');

  /* ---- HERO PARALLAX ---- */
  if (hasST) {
    gsap.to('.hero-slideshow', {
      yPercent: 20, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  /* ---- MAGNETIC BUTTONS (desktop only) ---- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn-primary, .btn-church, .nav-cta').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - r.left - r.width  / 2) * 0.28,
          y: (e.clientY - r.top  - r.height / 2) * 0.28,
          duration: 0.4, ease: 'power2.out', overwrite: true,
        });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, 0.5)', overwrite: true });
      });
    });
  }

  /* ---- CUSTOM CURSOR (desktop only) ---- */
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mx = -200, my = -200, rx = -200, ry = -200;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      gsap.to(dot, { left: mx, top: my, duration: 0.08, ease: 'none' });
    });
    gsap.ticker.add(() => {
      rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
      gsap.set(ring, { left: rx, top: ry });
    });
    document.querySelectorAll('a, button, .btn, .faq-q, .media-item').forEach(el => {
      el.addEventListener('mouseenter', () => { dot.classList.add('is-hover');    ring.classList.add('is-hover'); });
      el.addEventListener('mouseleave', () => { dot.classList.remove('is-hover'); ring.classList.remove('is-hover'); });
    });
  }

} catch (e) {
  /* GSAP falhou — garante que o hero fica visível */
  document.querySelectorAll('.hero-pre,.hero-name,.hero-tagline,.hero-btns,.hero-scroll')
    .forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
}
