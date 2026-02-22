// ============================================================
// Elena Voss — Wedding Photography Portfolio
// Main JavaScript
// ============================================================

'use strict';

// ── Scroll-to helper ─────────────────────────────────────────
function scrollTo(id) {
  const el = document.getElementById(id) || document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// BIO NAV (main navigation)
// ============================================================
document.querySelectorAll('.bio__nav-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      document.querySelectorAll('.bio__nav-link').forEach(l => l.classList.remove('is-active'));
      link.classList.add('is-active');
      if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        scrollTo(href);
      }
    }
  });
});

// Scroll-da aktiv bio menu linkini yenilə
function updateBioMenuActive() {
  const links = document.querySelectorAll('.bio__nav-link');
  const sections = [];
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#') {
      const el = document.querySelector(href);
      if (el) sections.push({ id: href, el, link });
    }
  });
  const y = window.scrollY + 120;
  let activeLink = document.querySelector('.bio__nav-link[href="#"]');
  for (const { id, el, link } of sections) {
    if (el.offsetTop <= y) activeLink = link;
  }
  links.forEach(l => l.classList.remove('is-active'));
  if (activeLink) activeLink.classList.add('is-active');
}
window.addEventListener('scroll', () => { requestAnimationFrame(updateBioMenuActive); }, { passive: true });
window.addEventListener('load', updateBioMenuActive);

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
// GALLERY FILTER + MASONRY + LIGHTBOX
// ============================================================
const galleryItems = document.querySelectorAll('.gallery__item');
const filterBtns = document.querySelectorAll('.gallery__filter-btn');

// Init: show all
galleryItems.forEach(item => item.classList.add('visible'));

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

// Lightbox
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

lightboxImg.style.transition = 'opacity 0.15s';

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => {
    visibleItems = getVisibleItems();
    const visibleIndex = visibleItems.indexOf(item);
    openLightbox(visibleIndex);
  });
});

document.querySelector('.lightbox__close')?.addEventListener('click', closeLightbox);
document.querySelector('.lightbox__prev')?.addEventListener('click', e => { e.stopPropagation(); lightboxNav(-1); });
document.querySelector('.lightbox__next')?.addEventListener('click', e => { e.stopPropagation(); lightboxNav(1); });

lightbox?.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
});

// ============================================================
// TESTIMONIALS SLIDER
// ============================================================
const testimonialSlider = document.querySelector('.testimonials__slider');
const testimonialTrack = document.querySelector('.testimonials__track');
const testimonialSlides = document.querySelectorAll('.testimonials__slide');
const testimonialDots = document.querySelectorAll('.testimonials__dot');
const prevBtn = document.querySelector('.testimonials__nav-btn.prev');
const nextBtn = document.querySelector('.testimonials__nav-btn.next');

let currentSlide = 0;
let testimonialsAutoplay;
const isMobile = () => window.innerWidth < 768;

function getSlideWidth() {
  if (!testimonialSlides.length) return 0;
  return testimonialSlides[0].offsetWidth + 24; // gap = 1.5rem = 24px
}

function goToSlide(index) {
  const total = testimonialSlides.length;
  currentSlide = (index + total) % total;

  if (isMobile()) {
    const offset = currentSlide * getSlideWidth();
    testimonialTrack.style.transform = `translateX(-${offset}px)`;
  } else {
    // Desktop: show 3 at a time, highlight middle
    const offset = currentSlide * getSlideWidth();
    testimonialTrack.style.transform = `translateX(-${offset}px)`;

    testimonialSlides.forEach((slide, i) => {
      const card = slide.querySelector('.testimonials__card');
      const relPos = (i - currentSlide + total) % total;
      if (relPos === 1) {
        card.classList.add('featured');
      } else {
        card.classList.remove('featured');
      }
    });
  }

  testimonialDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

prevBtn?.addEventListener('click', () => {
  clearInterval(testimonialsAutoplay);
  goToSlide(currentSlide - 1);
  startAutoplay();
});

nextBtn?.addEventListener('click', () => {
  clearInterval(testimonialsAutoplay);
  goToSlide(currentSlide + 1);
  startAutoplay();
});

testimonialDots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    clearInterval(testimonialsAutoplay);
    goToSlide(i);
    startAutoplay();
  });
});

function startAutoplay() {
  testimonialsAutoplay = setInterval(() => goToSlide(currentSlide + 1), 6000);
}

// Init
if (testimonialSlides.length) {
  goToSlide(0);
  startAutoplay();
  window.addEventListener('resize', () => goToSlide(currentSlide));
}

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
// SMOOTH CTA SCROLL BUTTONS
// ============================================================
document.querySelectorAll('[data-scroll-contact]').forEach(btn => {
  btn.addEventListener('click', () => scrollTo('#contact'));
});
document.querySelectorAll('[data-scroll-gallery]').forEach(btn => {
  btn.addEventListener('click', () => scrollTo('#gallery'));
});

// Logo / başlıq üçün yuxarı scroll (lazım olsa: .bio__name)
document.querySelector('.bio__name')?.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
