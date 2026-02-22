# Refactor Plan — Wedding Portfolio (UI/UX + SEO + Multi-page)

## 1. CTA ayırması
- **"Every love story deserves to be beautifully told."** bio hissəsindən çıxarılır.
- Ayrıca **CTA section** (id=`cta-quote`) testimonials və FAQ-dan sonra, contact-dan əvvəl yerləşir.
- Vertical rhythm: section padding vahid spacing ilə.

## 2. Struktur (semantik HTML5)
- Hər səhifə: `<header>`, `<main>`, `<footer>`.
- Section-lar: `id` + `aria-labelledby`, heading iyerarxiyası H1→H2→H3.
- Şəkillər: `loading="lazy"`, `width`/`height`, `alt` (hero üçün lazy yox).

## 3. Menyu (desktop + mobil)
- Global `<header class="site-header">`: logo, nav (Home, About, Services, Portfolio, Testimonials, FAQ, Contact).
- Mobil: hamburger düyməsi, `aria-expanded`, `aria-controls="nav-menu"`, klaviatura + focus.
- Aktiv səhifə: `aria-current="page"`.

## 4. Multi-page
| Səhifə | Fayl | Məzmun |
|--------|------|--------|
| Home | index.html | Hero, bio (quote olmadan), trust-bar, about/services/process preview, portfolio link, testimonials preview, CTA quote, final-cta, contact link |
| About | about.html | Bio + philosophy + stats |
| Services | services.html | Why choose + services grid + process |
| Portfolio | portfolio.html | **Yalnız gallery section** — dizayn/JS/CSS toxunulmaz |
| Testimonials | testimonials.html | Testimonials slider |
| FAQ | faq.html | FAQ accordion |
| Contact | contact.html | Form + əlaqə |

## 5. SEO
- Hər səhifə: unikal `<title>`, `<meta name="description">`, Open Graph, Twitter Card, `<link rel="canonical">`.
- Schema.org JSON-LD: Person (fotoqraf) + Service/Offer.
- robots.txt, sitemap.xml.
- Daxili linklər: breadcrumb lazım olsa sadə.

## 6. UI/UX & performans
- Spacing: SCSS dəyişənləri (section padding).
- Typography: clamp, line-height, max-width.
- Button/link: hover, focus, active vahid.
- Şəkillər: lazy (hero istisna), ölçülər CLS üçün.
- `prefers-reduced-motion`: animasiyaları yumşalt/disable.
- Script: `defer`.

## 7. SCSS modul
- base: variables, reset, typography
- layout: header, footer, sections
- components: buttons, cards, nav, accordion, forms
- pages: home, about, services, contact, faq, testimonials
- **Portfolio (gallery)**: mövcud class/CSS dəyişməz.

## 8. Qəbul kriteriyaları
- Lighthouse: Performance, Accessibility, Best Practices, SEO ≥ 95.
- Portfolio section: görünüş və JS eyni qalır.
- Nav: klaviatura + mobil işlək.
