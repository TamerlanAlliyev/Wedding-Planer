# Motion Audit & Premium Motion System

## 1. INVENTORY — Animasiya növləri və yerləri

### CSS / SCSS


| Növ                          | Harada                                                                                                                                                                                                                                                                                                                                                                                                                                    | Parametrlər                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Transition (hover/focus)** | Site header (logo, link, toggle), Navbar (cta, nav), Hero (bg img 0.1s linear, content opacity 0.1s), Badge/btn-primary, About CTA, Quote CTA, Why-choose card, Services (cta, card, card-img, card-foot, card-body slide), Process, Gallery (item, overlay, zoom), Testimonials (card, dot), FAQ (accordion, question), Final CTA, Inquiry submit, Lightbox (overlay, img, close), Bio (avatar, social-link, nav), Pricing/feature cards | Durations: 0.1s–1.4s; mix of --ease-out, --ease-emotional, linear, no easing |
| **Reveal (scroll)**          | .reveal (translateY 32px, opacity, 0.8s), .reveal-left (-40px, 0.9s), .reveal-right (40px, 0.9s); data-delay 1–8 → 0.1s step                                                                                                                                                                                                                                                                                                              | SCSS: ease-out; CSS: --ease-emotional, 1s, 28px/32px                         |
| **Keyframes**                | fadeUp (hero badge, title, sub, actions), fadeIn (hero scroll), scrollPulse (hero scroll line, ease-in-out infinite)                                                                                                                                                                                                                                                                                                                      | 0.7s–0.9s, delays 0.2s–0.7s; scrollPulse 1.5s infinite                       |
| **Transform hover**          | translateY(-1px to -4px), translateX(3px), scale(1.02–1.05), scale(0.92→1) lightbox                                                                                                                                                                                                                                                                                                                                                       | Çox qısa (0.2s) və ya orta (0.35s–0.6s)                                      |
| **Opacity only**             | Hero content fade (JS), Lightbox open/close, card-foot hover hide, gallery overlay, filter .visible                                                                                                                                                                                                                                                                                                                                       | 0.1s–0.35s                                                                   |
| **JS-driven**                | Hero parallax (scroll → scale + translateY, content opacity), countUp (rAF, 1600ms, ease cubic), lightbox img swap (opacity 0→1, 150ms), testimonials scroll-snap + IO                                                                                                                                                                                                                                                                    | Scroll listener passive; observers for reveal, stats, testimonials           |


### JS


| Modul         | Nə edir                                                                                |
| ------------- | -------------------------------------------------------------------------------------- |
| Hero parallax | scroll → heroBg transform scale(1.1) translateY(progress*20%), heroContent opacity 1→0 |
| Reveal        | IntersectionObserver threshold 0.12, rootMargin -60px → .visible                       |
| Stats         | IntersectionObserver → countUp 1600ms, ease 1-(1-t)^3                                  |
| Gallery       | Filter → classList visible/hide; lightbox open/close, nav opacity transition 150ms     |
| Testimonials  | Scroll-snap, IO “50% visible”, dots, autoplay, resize rAF                              |
| FAQ           | classList open/is-open → CSS max-height + opacity                                      |
| Form          | classList has-error, submitting, show                                                  |


---

## 2. ISSUES — Premium hissini zəiflədən nöqtələr

- **SCSS vs CSS uyğunsuzluğu:** Reveal SCSS-də 0.8s/0.9s + ease-out, CSS-də 1s + --ease-emotional və 28px/32px. İki mənbə fərqli davranır.
- **Çox sürətli / kəskin:** Hero bg 0.1s linear, hero content 0.1s — çox “tez”; scrollPulse ease-in-out infinite — “cheap” pulse.
- **“Transition: all”:** Bir çox yerdə `transition: all 0.2s/0.3s` — layout/box-shadow də daxil ola bilər, performans və nəzarət aşağı.
- **Qarışıq duration:** 0.1s, 0.2s, 0.25s, 0.35s, 0.4s, 0.6s, 0.7s, 0.8s, 0.9s, 1s, 1.2s, 1.4s — vahid temp yoxdur.
- **Qarışıq easing:** ease-out, ease-emotional, linear, ease (keyframes), ease-in-out (scrollPulse) — vahid dil yoxdur.
- **Böyük translate:** reveal 32–40px — mobilde “atılma” hissi; 24–28px daha premium.
- **prefers-reduced-motion yoxdur** — accessibility gap.
- **Lightbox img:** JS-də 150ms sabit — token ilə uyğunlaşdırıla bilər.

---

## 3. OPPORTUNITIES — Vahid sistemlə düzələcək

- Bütün duration/easing/distance tokenlaşdırma (SCSS :root + CSS sync).
- Reveal: vahid distance (24px), vahid duration (0.7s), vahid ease; delay stagger 0.08s.
- Hover: yalnız transform + opacity (və lazımda box-shadow); property-specific transition; duration 0.28s–0.38s.
- Hero: entrance keyframes bir az yavaş (0.85s, 1s); parallax davam etsin amma reduced-motion-da dayansın.
- scrollPulse: daha yumşaq, daha yavaş (2s), və ya reduced-motion-da dayandırma.
- prefers-reduced-motion: multiplier 0 (instant) və ya çox qısa; reveal/hover/parallax/countUp uyğunlaşsın.

---

## 4. MOTION SYSTEM TOKENS (premium, cinematic)


| Token                      | Dəyər                            | İstifadə                      |
| -------------------------- | -------------------------------- | ----------------------------- |
| --motion-ease-out          | cubic-bezier(0.19, 1, 0.36, 1)   | Girişlər, hover-in, reveal    |
| --motion-ease-in           | cubic-bezier(0.5, 0, 0.75, 0)    | Çıxışlar (optional)           |
| --motion-ease-smooth       | cubic-bezier(0.25, 0.1, 0.25, 1) | Symmetric, lightbox           |
| --motion-duration-instant  | 120ms                            | Toggle, focus ring            |
| --motion-duration-fast     | 280ms                            | Link color, icon nudge        |
| --motion-duration-normal   | 380ms                            | Btn hover, card hover         |
| --motion-duration-slow     | 520ms                            | Card lift, overlay            |
| --motion-duration-entrance | 720ms                            | Reveal, scroll-in             |
| --motion-distance-sm       | 8px                              | Icon translateX               |
| --motion-distance-md       | 24px                             | Reveal translateY/X           |
| --motion-distance-lg       | 32px                             | Panel slide (services body)   |
| --motion-stagger           | 0.08s                            | data-delay step               |
| --motion-reduced           | 1                                | 0 when prefers-reduced-motion |


---

## 5. SECTION PLAN (struktur)

**[Section: HERO]**  

- Trigger: page load.  
- Elements: badge, title, sub, actions, scroll hint.  
- Intent: calm, confident, premium open.  
- Sequence: 1 badge → 2 title → 3 sub → 4 actions → 5 scroll (stagger).  
- Properties: opacity 0→1, translateY 24px→0.  
- Timing: entrance 720ms, delays 0.2s, 0.36s, 0.52s, 0.68s, 0.88s.  
- Easing: --motion-ease-out.  
- Notes: scrollPulse daha yavaş (2s) və ya reduced-da off.

**[Section: REVEAL (global)]**  

- Trigger: IntersectionObserver (threshold 0.12).  
- Elements: .reveal, .reveal-left, .reveal-right.  
- Intent: content appears without “pop”, subtle.  
- Sequence: data-delay 1–8 → stagger 0.08s.  
- Properties: opacity, translateY 24px / translateX ±24px.  
- Timing: duration 720ms, delay = index * 0.08s.  
- Easing: --motion-ease-out.  
- Notes: vahid 24px distance; SCSS və CSS eyni.

**[Section: CARDS (why-choose, services, gallery, testimonials, pricing)]**  

- Trigger: hover.  
- Elements: card, card img, card-foot, card-body (services).  
- Intent: premium lift, no bounce.  
- Properties: transform translateY(-4px), scale(1.03–1.05) img, box-shadow.  
- Timing: 380ms (normal) və ya 520ms (slow) for lift.  
- Easing: --motion-ease-out.  
- Notes: “transition: all” → explicit transform, box-shadow, opacity.

**[Section: BUTTONS / LINKS]**  

- Trigger: hover, focus.  
- Elements: .btn-primary, .site-header__link, .bio__nav-link, .services__cta, .card-cta.  
- Intent: snappy but not instant.  
- Properties: color, transform translateY(-1px) or translateX(3px) icon.  
- Timing: 280ms (fast).  
- Easing: --motion-ease-out.

**[Section: LIGHTBOX]**  

- Trigger: open/close, nav.  
- Elements: overlay, img.  
- Intent: smooth, controlled.  
- Properties: opacity; img scale(0.96→1).  
- Timing: overlay 280ms, img 380ms.  
- Easing: --motion-ease-smooth.

**[Section: FAQ ACCORDION]**  

- Trigger: click.  
- Elements: .faq__answer (max-height, opacity), .faq__question icon.  
- Intent: clear open/close.  
- Timing: 380ms.  
- Easing: --motion-ease-out.

**[Section: HERO PARALLAX (JS)]**  

- Trigger: scroll (passive).  
- Intent: depth, calm.  
- Notes: reduced-motion-da disable (no transform/opacity change).

---

## 6. FAYLLAR (refaktor sonrası)

- **Yaradıldı:** `docs/motion-audit.md` (bu sənəd).
- **Dəyişdirildi:**
  - **styles.scss:** `:root`-a motion tokenları (--motion-ease-out, --motion-duration-*, --motion-distance-*, --motion-stagger, --motion-reduced); `@media (prefers-reduced-motion: reduce)` ilə duration 0 və html scroll-behavior auto; `.reveal` / `.reveal-left` / `.reveal-right` token əsaslı (24px, 720ms, stagger 0.08s); hero badge/title/sub/actions/scroll keyframes və transition-lar token əsaslı; scrollPulse 2s + reduced-da animation: none; navbar, services card/img/foot/body/cta transition-lar token əsaslı.
  - **styles.css:** Eyni motion tokenları `:root`-da; reduced-motion media query; `.reveal` / `.reveal-left` / `.reveal-right` token əsaslı; data-delay 5–8 əlavə.
  - **main.js:** `prefersReducedMotion()`; hero parallax reduced-da skip; countUp duration reduced-da 0 (ani), normalda 2000ms; lightbox opacity 0.28s və setTimeout 280.

---

## 7. BEFORE / AFTER (qısa)


| Sahə                       | Əvvəl                                                            | Sonra                                                                    |
| -------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Reveal**                 | SCSS 0.8s ease-out 32px, CSS 1s ease-emotional 28px — uyğunsuz   | Vahid 720ms, 24px, motion-ease-out, stagger 0.08s; reduced-da 0ms        |
| **Hero**                   | 0.1s linear bg, 0.7–0.9s keyframes, scrollPulse 1.5s ease-in-out | Token əsaslı entrance 720ms, scrollPulse 2s smooth, reduced-da pulse yox |
| **Hover (services/cards)** | 0.35s, 0.2s qarışıq                                              | 380ms (normal) / 280ms (fast) token, vahid ease-out                      |
| **Parallax**               | Həmişə aktiv                                                     | reduced-motion-da dayandırılır                                           |
| **CountUp**                | 1600ms sabit                                                     | 2000ms normal, 0ms reduced                                               |
| **Accessibility**          | prefers-reduced-motion yox idi                                   | Bütün duration-lar 0, parallax/countUp uyğun, scroll-behavior auto       |
| **Temp**                   | Daha tez, bəzi yerdə kəskin                                      | Bir az yavaş (720ms entrance, 380ms hover), kontrollu, premium           |

---

## 8. İCRA ÇEKİİSTİ (hamısı tətbiq olunmalıdır)

- [x] **:root** — Motion tokenları (--motion-ease-out, ease-smooth, duration-*, distance-*, stagger, reduced); --motion-ease-in optional.
- [x] **prefers-reduced-motion** — Bütün duration 0; --motion-reduced: 0; html { scroll-behavior: auto }.
- [x] **.reveal / .reveal-left / .reveal-right** — Token əsaslı (24px, 720ms, stagger 0.08s); data-delay 1–8.
- [x] **Hero** — Badge, title, sub, actions, scroll: keyframes token əsaslı; bg img və content transition token; scrollPulse 2s + reduced-da animation: none.
- [x] **Navbar** — background, border-color, box-shadow: motion-duration-slow; nav link/cta: motion-duration-fast; "transition: all" → explicit.
- [x] **Badge / btn-primary** — transform, box-shadow: motion-duration-normal; "transition: all" → explicit.
- [x] **About CTA, Quote CTA** — motion-duration-normal, motion-ease-out.
- [x] **Why-choose card** — transform, box-shadow, border-color: motion-duration-slow.
- [x] **Services** — card: transform, box-shadow motion-duration-normal; img motion-duration-slow; foot opacity motion-duration-slow; body slide motion-duration-normal; cta gap/color motion-duration-fast.
- [x] **Gallery** — item img transform, overlay opacity: motion token; zoom: motion-duration-normal.
- [x] **Lightbox** — overlay opacity motion-duration-fast; img transform motion-duration-normal, scale(0.96→1); ease-smooth.
- [x] **FAQ** — answer max-height, opacity: motion-duration-normal; question icon transform motion-duration-normal.
- [x] **Final CTA, Inquiry submit** — transform, box-shadow, background: motion token.
- [x] **Bio** — avatar, social-link, nav: motion token.
- [x] **Site header** — logo, link, toggle: motion-duration-fast.
- [x] **"transition: all"** — Hamısı property-specific (transform, opacity, box-shadow, border-color, background, color) + token.
- [x] **main.js** — prefersReducedMotion(); parallax skip when reduced; countUp 2000ms/0ms; lightbox 280ms; scroll-behavior CSS ilə idarə olunur.

