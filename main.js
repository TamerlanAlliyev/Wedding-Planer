// ============================================================
// Farida Eyubova — Toy Təşkilatçısı
// Əsas JavaScript
// ============================================================

'use strict';

// ── Scroll-to helper ─────────────────────────────────────────
function scrollTo(id) {
  const el = document.getElementById(id) || document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// SITE HEADER — Hamburger (mobile) + keyboard
// ============================================================
const navToggle = document.querySelector('.site-header__toggle');
const mainNav = document.getElementById('main-nav');
const navMenu = document.getElementById('nav-menu');

function openNav() {
  if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
  if (mainNav) mainNav.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  if (mainNav) mainNav.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    if (open) closeNav();
    else openNav();
  });
  mainNav.querySelectorAll('.site-header__link').forEach(link => {
    link.addEventListener('click', () => closeNav());
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
  document.addEventListener('click', (e) => {
    if (navToggle.getAttribute('aria-expanded') !== 'true') return;
    const header = navToggle.closest('.site-header');
    if (header && !header.contains(e.target)) closeNav();
  });
}

// Optional: legacy bio nav (single-page scroll) — only when present
document.querySelectorAll('.bio__nav-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#') && href !== '#') {
      e.preventDefault();
      scrollTo(href);
    }
  });
});

// ============================================================
// HERO PARALLAX
// ============================================================
const heroBg = document.querySelector('.hero__bg img');
const heroContent = document.querySelector('.hero__content');
const heroSection = document.querySelector('.hero');

function handleHeroParallax() {
  if (!heroBg || !heroSection) return;
  const scrollY = window.scrollY;
  const heroH = heroSection.offsetHeight;
  const progress = scrollY / heroH;
  heroBg.style.transform = `scale(1.1) translateY(${progress * 20}%)`;
  if (heroContent) heroContent.style.opacity = Math.max(0, 1 - progress * 1.4);
}

window.addEventListener('scroll', handleHeroParallax, { passive: true });

// CTA buttons in hero
document.querySelectorAll('[data-scroll-to]').forEach(btn => {
  btn.addEventListener('click', () => {
    scrollTo(btn.dataset.scrollTo);
  });
});

// ============================================================
// SCROLL REVEAL (Intersection Observer)
// ============================================================
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ============================================================
// STATS COUNTER
// ============================================================
function countUp(el, target, duration = 1600) {
  let start = null;
  const suffix = el.dataset.suffix || '';

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(step);
}

const statsSection = document.querySelector('.stats');
let statsStarted = false;

const statsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !statsStarted) {
    statsStarted = true;
    document.querySelectorAll('.stats__value').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      countUp(el, target);
    });
  }
}, { threshold: 0.3 });

if (statsSection) statsObserver.observe(statsSection);

// ============================================================
// GALLERY FILTER + MASONRY + LIGHTBOX (only when gallery present)
// ============================================================
const galleryItems = document.querySelectorAll('.gallery__item');
const filterBtns = document.querySelectorAll('.gallery__filter-btn');

if (galleryItems.length) galleryItems.forEach(item => item.classList.add('visible'));

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.category;
    galleryItems.forEach(item => {
      if (cat === 'all' || item.dataset.category === cat) {
        item.classList.add('visible');
        item.style.display = '';
      } else {
        item.classList.remove('visible');
        item.style.display = 'none';
      }
    });
  });
});

// Lightbox (only when lightbox and gallery exist)
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox__img');
const lightboxCounter = document.querySelector('.lightbox__counter');
let currentLightboxIndex = 0;
let visibleItems = [];

function getVisibleItems() {
  return Array.from(galleryItems).filter(item => item.style.display !== 'none');
}

function openLightbox(index) {
  visibleItems = getVisibleItems();
  currentLightboxIndex = index;
  const item = visibleItems[currentLightboxIndex];
  if (!item) return;
  lightboxImg.src = item.querySelector('img').src;
  lightboxImg.alt = item.querySelector('img').alt;
  lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${visibleItems.length}`;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxNav(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + visibleItems.length) % visibleItems.length;
  const item = visibleItems[currentLightboxIndex];
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = item.querySelector('img').src;
    lightboxImg.alt = item.querySelector('img').alt;
    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${visibleItems.length}`;
    lightboxImg.style.opacity = '1';
  }, 150);
}

if (lightboxImg) lightboxImg.style.transition = 'opacity 0.15s';

if (galleryItems.length && lightbox) {
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      visibleItems = getVisibleItems();
      const visibleIndex = visibleItems.indexOf(item);
      openLightbox(visibleIndex);
    });
  });
  document.querySelector('.lightbox__close')?.addEventListener('click', closeLightbox);
  document.querySelector('.lightbox__prev')?.addEventListener('click', e => { e.stopPropagation(); lightboxNav(-1); });
  document.querySelector('.lightbox__next')?.addEventListener('click', e => { e.stopPropagation(); lightboxNav(1); });
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
  });
}

// ============================================================
// TESTIMONIALS — CSS Scroll-Snap + IntersectionObserver
// ============================================================
(function () {
  const section  = document.querySelector('.testimonials');
  if (!section) return;

  const viewport = section.querySelector('.testimonials__slider');
  const track    = section.querySelector('.testimonials__track');
  const slides   = Array.from(section.querySelectorAll('.testimonials__slide'));
  const dots     = Array.from(section.querySelectorAll('.testimonials__dot'));
  if (!viewport || !track || !slides.length) return;

  /* ── Config ────────────────────────────────────────────── */
  const AUTOPLAY_MS    = 5500;
  const WHEEL_COOLDOWN = 650;

  /* ── State ─────────────────────────────────────────────── */
  let activeIdx  = 0;
  let autoplayId = null;
  let wheelLock  = false;
  let isDragging = false;
  let dragX      = 0;
  let dragLeft   = 0;
  let touchX     = 0;

  /* ── snapPad: track padding-left === scroll-padding-inline-start.
     Using track.paddingLeft is always reliable (set directly in CSS).  */
  function snapPad() {
    return parseFloat(getComputedStyle(track).paddingLeft) || 0;
  }

  /* ── lastReachable: highest slide index that has a valid snap point.
     A snap point requires scrollLeft ≤ maxScrollLeft.
     slides[i].offsetLeft works correctly because viewport has
     position:relative, making it the offsetParent for all slides. ── */
  function lastReachable() {
    const maxL = viewport.scrollWidth - viewport.clientWidth;
    const sp   = snapPad();
    for (let i = slides.length - 1; i >= 0; i--) {
      if (slides[i].offsetLeft - sp <= maxL + 1) return i;
    }
    return 0;
  }

  /* ── slideTo: scrolls to exact snap position for slide N.
     Uses offsetLeft (layout value, animation-safe) — not
     getBoundingClientRect which changes mid-animation and
     causes overshoot on rapid successive calls. ─────────── */
  function slideTo(n) {
    const last = lastReachable();
    const idx  = Math.max(0, Math.min(n, last));
    const left = Math.max(0, slides[idx].offsetLeft - snapPad());
    setDots(idx);
    viewport.scrollTo({ left, behavior: 'smooth' });
  }

  /* ── setDots: updates active dot + clamps activeIdx.
     Also hides dots for positions that can never be snapped to
     (unreachable because scroll container hits its max before
     the slide could centre-align). ──────────────────────── */
  function setDots(idx) {
    const last    = lastReachable();
    const clamped = Math.max(0, Math.min(idx, last));
    activeIdx = clamped;
    dots.forEach((d, i) => {
      const on = i === clamped;
      d.classList.toggle('active', on);
      d.setAttribute('aria-selected', String(on));
      d.hidden = i > last; // hide unreachable dots
    });
  }

  /* ── setCard: applies is-active (dark) to the active card ── */
  function setCard(idx) {
    slides.forEach((s, i) => {
      s.querySelector('.testimonials__card')
       .classList.toggle('is-active', i === idx);
    });
  }

  /* ── IntersectionObserver: "leftmost slide ≥ 50% visible wins"
     Using 50% threshold means the card that occupies more than
     half the visible area is the current one. Map insertion order
     equals DOM order, so the first entry ≥ 0.5 is the leftmost. ── */
  const ratioMap = new Map(slides.map(s => [s, 0]));

  const slideIO = new IntersectionObserver(entries => {
    entries.forEach(e => ratioMap.set(e.target, e.intersectionRatio));

    let winner = null;
    for (const [slide, r] of ratioMap) {
      if (r >= 0.5) { winner = slide; break; } // first (leftmost) ≥ 50%
    }

    if (winner) {
      const idx = slides.indexOf(winner);
      if (idx !== -1) {
        if (idx !== activeIdx) setDots(idx);
        setCard(idx);
      }
    }
  }, { root: viewport, threshold: [0, 0.25, 0.5, 0.75, 1.0] });

  slides.forEach(s => slideIO.observe(s));

  /* ── Autoplay ───────────────────────────────────────────── */
  function startAutoplay() {
    stopAutoplay();
    autoplayId = setInterval(() => {
      const last = lastReachable();
      slideTo(activeIdx >= last ? 0 : activeIdx + 1);
    }, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    clearInterval(autoplayId);
    autoplayId = null;
  }

  /* ── Dots click ─────────────────────────────────────────── */
  dots.forEach((d, i) => {
    d.addEventListener('click', () => { slideTo(i); startAutoplay(); });
  });

  /* ── Keyboard (slider must be focused via tabindex) ─────── */
  viewport.setAttribute('tabindex', '0');
  viewport.addEventListener('keydown', e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    slideTo(activeIdx + (e.key === 'ArrowRight' ? 1 : -1));
    startAutoplay();
  });

  /* ── Vertical wheel → step one slide ───────────────────── */
  viewport.addEventListener('wheel', e => {
    // Horizontal wheel (trackpad swipe) = let browser handle natively
    if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
    if (Math.abs(e.deltaY) < 8) return;
    if (wheelLock) { e.preventDefault(); return; }
    e.preventDefault();
    wheelLock = true;
    slideTo(activeIdx + (e.deltaY > 0 ? 1 : -1));
    startAutoplay();
    setTimeout(() => { wheelLock = false; }, WHEEL_COOLDOWN);
  }, { passive: false });

  /* ── Mouse drag ─────────────────────────────────────────── */
  viewport.addEventListener('mousedown', e => {
    isDragging = true;
    dragX      = e.clientX;
    dragLeft   = viewport.scrollLeft;
    viewport.style.scrollBehavior = 'auto'; // 1:1 tracking during drag
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    viewport.scrollLeft = dragLeft - (e.clientX - dragX);
  });

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    viewport.style.scrollBehavior = '';
    // Find the reachable snap point nearest to current scrollLeft
    const sp   = snapPad();
    const last = lastReachable();
    let nearest = 0, minDist = Infinity;
    slides.forEach((s, i) => {
      if (i > last) return;
      const dist = Math.abs((s.offsetLeft - sp) - viewport.scrollLeft);
      if (dist < minDist) { minDist = dist; nearest = i; }
    });
    slideTo(nearest);
    startAutoplay();
  }

  document.addEventListener('mouseup', endDrag);
  viewport.addEventListener('mouseleave', e => { if (e.buttons & 1) endDrag(); });

  /* ── Touch (scroll-snap handles animation natively) ─────── */
  viewport.addEventListener('touchstart', e => {
    touchX = e.changedTouches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  viewport.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 30) {
      // Optimistic dot step — IO will confirm once card settles
      const last = lastReachable();
      setDots(Math.max(0, Math.min(activeIdx + (diff > 0 ? 1 : -1), last)));
    }
    startAutoplay();
  }, { passive: true });

  /* ── Pause autoplay when section leaves viewport ─────────── */
  new IntersectionObserver(([e]) => {
    e.isIntersecting ? startAutoplay() : stopAutoplay();
  }, { threshold: 0.1 }).observe(section);

  /* ── Resize: lastReachable changes, re-snap + refresh dots ─ */
  let resizeRaf;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      const last = lastReachable();
      const idx  = Math.min(activeIdx, last);
      const left = Math.max(0, slides[idx].offsetLeft - snapPad());
      viewport.scrollTo({ left, behavior: 'auto' });
      setDots(idx);
      setCard(idx);
    });
  });

  /* ── Init ───────────────────────────────────────────────── */
  setDots(0);
  setCard(0);
  startAutoplay();
}());

// ============================================================
// FAQ ACCORDION
// ============================================================
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const answer = item.querySelector('.faq__answer');
    const isOpen = answer.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq__answer').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq__question').forEach(q => q.classList.remove('open'));

    if (!isOpen) {
      answer.classList.add('open');
      btn.classList.add('open');
    }
  });
});

// Open first FAQ by default
const firstFaqBtn = document.querySelector('.faq__question');
const firstFaqAnswer = document.querySelector('.faq__answer');
if (firstFaqBtn && firstFaqAnswer) {
  firstFaqBtn.classList.add('open');
  firstFaqAnswer.classList.add('open');
}

// ============================================================
// INQUIRY FORM
// ============================================================
const inquiryForm = document.getElementById('inquiry-form');
const formSuccess = document.querySelector('.inquiry__success');

function validateField(field) {
  const fieldWrap = field.closest('.inquiry__field');
  if (!fieldWrap) return true;
  const errorMsg = fieldWrap.querySelector('.error-msg');
  let valid = true;

  if (field.required && !field.value.trim()) {
    valid = false;
    if (errorMsg) errorMsg.textContent = 'This field is required.';
  } else if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
    valid = false;
    if (errorMsg) errorMsg.textContent = 'Please enter a valid email address.';
  }

  fieldWrap.classList.toggle('has-error', !valid);
  return valid;
}

inquiryForm?.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    const fieldWrap = field.closest('.inquiry__field');
    if (fieldWrap?.classList.contains('has-error')) validateField(field);
  });
});

inquiryForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const fields = inquiryForm.querySelectorAll('input[required], select[required], textarea[required]');
  let allValid = true;
  fields.forEach(field => { if (!validateField(field)) allValid = false; });
  if (!allValid) return;

  const submitBtn = inquiryForm.querySelector('.inquiry__submit');
  const spinner = inquiryForm.querySelector('.inquiry__spinner');
  const btnText = inquiryForm.querySelector('.inquiry__submit-text');

  submitBtn.disabled = true;
  submitBtn.classList.add('submitting');
  spinner.style.display = 'block';
  if (btnText) btnText.textContent = 'Sending...';

  // Simulate async submission
  await new Promise(r => setTimeout(r, 1400));

  inquiryForm.style.display = 'none';
  formSuccess.classList.add('show');
});

// ============================================================
// SMOOTH CTA — scroll to #contact on same page, else go to contact.html
// ============================================================
document.querySelectorAll('[data-scroll-contact]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      e.preventDefault();
      scrollTo('contact');
    }
    // else: let default href (contact.html) work
  });
});
document.querySelectorAll('[data-scroll-gallery]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const galleryEl = document.getElementById('gallery');
    if (galleryEl) {
      e.preventDefault();
      scrollTo('gallery');
    }
  });
});

// Logo / başlıq üçün yuxarı scroll (lazım olsa: .bio__name)
document.querySelector('.bio__name')?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
