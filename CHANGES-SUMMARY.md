# Refactor — Changes Summary & QA Checklist

## 1. CTA ayırması ✅
- **"Every love story deserves to be beautifully told."** bio hissəsindən çıxarıldı.
- Ayrıca **CTA section** (`#cta-quote`) əlavə edildi: FAQ-dan sonra, Final CTA-dan əvvəl.
- `.cta-quote` üçün CSS (spacing, mətn, düymə) əlavə edildi.

## 2. Struktur (semantik HTML) ✅
- **Site header** (global): `<header class="site-header">` — logo, nav, hamburger. Hər səhifədə təkrarlanır.
- **Main**: `<main id="main-content">` index üzərində; digər səhifələrdə də istifadə olunur.
- Section-lar: `id` və `aria-labelledby` saxlanılıb və ya əlavə edilib.
- Footer linkləri səhifə linklərinə çevrildi (index.html, about.html, …).

## 3. Menyu ✅
- **Desktop**: `.site-header__nav` — Home, About, Services, Portfolio, Testimonials, FAQ, Contact.
- **Mobil**: Hamburger (`.site-header__toggle`) — `aria-expanded`, `aria-controls="nav-menu"`. Açılanda nav aşağıda göstərilir.
- **Klaviatura**: Focus visible (outline), Escape menyunu bağlayır.
- **Aktiv səhifə**: Hər səhifədə uyğun nav linkində `aria-current="page"`.

## 4. Multi-page ✅
| Səhifə | Fayl | Vəziyyət |
|--------|------|----------|
| Home | index.html | Hero, bio (quote olmadan), trust-bar, about, quote, why-choose, stats, services, process, gallery, testimonials, FAQ, **cta-quote**, final-cta, contact |
| About | about.html | Bio + stats |
| Services | services.html | *(Yaradılmalı — why-choose + services + process)* |
| Portfolio | portfolio.html | **Yalnız gallery section** — HTML/CSS/JS toxunulmayıb |
| Testimonials | testimonials.html | *(Yaradılmalı)* |
| FAQ | faq.html | *(Yaradılmalı)* |
| Contact | contact.html | Inquiry form + əlaqə |

**Qeyd:** services.html, testimonials.html, faq.html üçün əsas struktur və nav artıq hazırdır; bu səhifələrin məzmunu index-dən kopyalanaraq ayrı fayllara da əlavə edilə bilər (istəsəniz növbəti addımda edək).

## 5. SEO ✅
- **index.html**: `<link rel="canonical">`, Open Graph, Twitter Card, JSON-LD (Person + ProfessionalService).
- **about, portfolio, contact**: Unikal `<title>`, `<meta name="description">`, `<link rel="canonical">`.
- **robots.txt**: `Allow: /`, Sitemap URL.
- **sitemap.xml**: index, about, services, portfolio, testimonials, faq, contact + service detail səhifələri.

## 6. JS ✅
- **Hamburger**: Aç/bağla, Escape, link klikində bağlanma (mobil).
- **Gallery/Lightbox**: Yalnız `.gallery__item` və `.lightbox` mövcud olduqda işləyir (səhifələr üçün uyğundur).
- **data-scroll-contact**: Eyni səhifədə `#contact` varsa scroll, yoxdursa default href (contact.html) işləyir.
- **Script**: `defer` ilə yüklənir.

## 7. CSS ✅
- `.site-header`, `.site-header__toggle`, `.nav-toggle__bar`, mobil nav (`.is-open`).
- `.cta-quote` section.
- Focus visible: `.site-header__logo:focus-visible`, `.site-header__link:focus-visible`, `.site-header__toggle:focus-visible`.

---

## QA Checklist (yoxlanılacaqlar)

- [ ] **Lighthouse** (Chrome): Performance, Accessibility, Best Practices, SEO — hər biri ≥ 95 (lokal və ya deploy-da test edin).
- [ ] **Heading iyerarxiyası**: Hər səhifədə tək H1, sonra H2/H3 ardıcıl.
- [ ] **Nav**: Desktop-da bütün linklər işləyir; mobil hamburger açılır/bağlanır; klaviatura ilə Tab və Enter/Space işləyir; Escape menyunu bağlayır.
- [ ] **Portfolio**: portfolio.html-də gallery filter və lightbox index-dəki kimi işləyir; CSS/JS dəyişməyib.
- [ ] **Hər səhifə**: Unikal title, description; OG/Twitter (ən azı index); canonical (mümkün olan yerdə).
- [ ] **sitemap.xml / robots.txt**: Düzgün URL-lər; domaini deploy-da əvəz edin (https://www.faridaeyubova.com).
- [ ] **Daxili linklər**: Footer və header linkləri heç bir səhifədə qırıq deyil (services.html, testimonials.html, faq.html yaradılandan sonra).
- [ ] **Form**: contact.html (və index #contact) üzərində label, required, error mesajları və submit sonrası success state işləyir.
- [ ] **prefers-reduced-motion**: *(İstəsəniz CSS-də `@media (prefers-reduced-motion: reduce)` əlavə edə bilərsiniz.)*

---

## Növbəti addımlar (istəsəniz)

1. **services.html** tam məzmun: index-dən why-choose, services, process bölmələrini kopyalayıb services.html-ə yapışdırmaq (header/footer artıq şablon kimi about/contact ilə eyni).
2. **testimonials.html** və **faq.html**: Eyni üsulla index-dən uyğun section-ları kopyalayıb yeni səhifələr yaratmaq.
3. **SCSS modul**: styles.css-i scss/base, layout, components, pages-ə bölmək və main.scss-dən import etmək.
4. **Spacing scale**: SCSS dəyişənləri (məs. `--section-padding-y`) və typography (clamp, line-height) vahid şkala ilə tətbiq etmək.
5. **prefers-reduced-motion**: Animasiya və transition üçün `@media (prefers-reduced-motion: reduce)` qaydaları əlavə etmək.
