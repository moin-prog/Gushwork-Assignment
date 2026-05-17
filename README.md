# Mangalam HDPE Pipes — Product Detail Page

A pixel-perfect, fully responsive product detail page built with vanilla HTML5, CSS3, and JavaScript. No frameworks, no libraries, no build tools required.

---

## Files

```
project/
├── index.html        Page structure and content
├── styles.css        Stylesheet — layout, components, responsive design
├── script.js         JavaScript — carousel, sticky header, forms, tabs, etc.
├── README.md         This file
└── assets/
    ├── images/       Product photos, hero images, application cards
    ├── fonts/        Self-hosted font files (if moving off Google Fonts CDN)
    └── icons/        Favicon, Open Graph image, app icons
```

---

## How to Run

Download all three files into the same folder and open `index.html` in any modern browser. No server or terminal needed.

---

## Page Sections

| Section | Description |
|---|---|
| Sticky Header | Announcement bar — slides in on scroll-down, hides on scroll-up |
| Navigation | Sticky navbar with dropdown, mobile hamburger drawer |
| Product Hero | Image carousel + product info, price, certification badges, CTAs |
| Trust Bar | Auto-scrolling client logo marquee |
| Technical Specs | Dark-themed data table with full pipe specifications |
| Features | 6-card grid — chemical resistance, durability, certifications, etc. |
| FAQ | Accordion with animated +/− icon, keyboard accessible |
| Applications | Draggable card carousel with peek of next card visible |
| Manufacturing Tabs | 8-stage process tabs, horizontally scrollable on mobile |
| Testimonials | Arrow-navigated testimonial cards with swipe support |
| Related Products | 3-card product grid with expert CTA strip |
| Resources | PDF download links for manuals and spec sheets |
| Contact Form | Quote request form with inline field validation |
| Footer | Logo card, 4-column links, contact details, social icons |

---

## Key Features

**Sticky Header** — Direction-aware scroll detection. Shows when scrolling down past 80px, hides when scrolling back up. Nav bar offsets automatically so nothing overlaps.

**Image Carousel** — Five slides with cross-fade, auto-play (pauses on hover), arrow buttons, thumbnail strip, touch swipe, keyboard navigation, and a slide counter.

**Zoom Preview (PiP)** — Hovering the carousel shows a picture-in-picture zoom panel in the bottom-right corner. Tracks cursor position in real time so the zoomed area matches exactly where the mouse is.

**Form Validation** — Both forms validate on submit. Invalid fields get a red border and an inline error message. Errors clear as the user types. Submit button shows loading and success states.

**Scroll Reveal** — IntersectionObserver animates elements into view as the page scrolls. Grid cards use staggered delays so they animate in sequence.

---

## Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| ≤ 1024px | Hero goes single column, features 2-col, footer 2-col |
| ≤ 768px | Hamburger nav, grids single column, CTAs full width |
| ≤ 480px | Reduced font sizes, carousel square ratio, footer single column |
| ≤ 360px | 16px side padding per Figma annotation spec |

---

## Accessibility

- Semantic HTML5 elements throughout
- ARIA attributes on all interactive components (carousel, tabs, accordion, forms)
- `role="alert"` on form error messages for screen readers
- `prefers-reduced-motion` disables all animations for users who prefer it
- Full keyboard navigation on carousel and tabs (arrow keys)

---

## Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. No polyfills needed.

---

## Design Credits

Based on a Figma design provided as part of the Gushwork assignment. Photography via Unsplash. Fonts: Playfair Display + Source Sans 3 via Google Fonts.
