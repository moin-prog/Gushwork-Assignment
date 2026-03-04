

(function () {
  'use strict';

  /* ── Utility: throttle ────────────────────────────────────── */
  function throttle(fn, ms) {
    let t = 0;
    return function (...a) {
      const now = Date.now();
      if (now - t >= ms) { t = now; fn.apply(this, a); }
    };
  }

  /* ── Utility: validate email ──────────────────────────────── */
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  /* ============================================================
     1. STICKY HEADER — direction-aware
        Shows when scrolling DOWN past 80px.
        Hides when scrolling back UP.
  ============================================================ */
  (function initStickyHeader() {
    const bar = document.getElementById('sticky-header');
    const header = document.getElementById('main-header');
    if (!bar || !header) return;

    let lastY = window.scrollY;
    let barH = bar.offsetHeight || 34;
    const THRESHOLD = 80;

    function update() {
      const y = window.scrollY;
      const down = y > lastY;

      if (y > THRESHOLD && down) {
        // Scrolling DOWN past threshold → show bar, push header down
        bar.classList.add('sh-visible');
        bar.removeAttribute('aria-hidden');
        document.body.classList.add('sh-body-offset');
      } else if (!down || y <= THRESHOLD) {
        // Scrolling UP or near top → hide bar
        bar.classList.remove('sh-visible');
        bar.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('sh-body-offset');
      }

      lastY = y;
    }

    window.addEventListener('scroll', throttle(update, 50), { passive: true });
    update();
  })();


  /* ============================================================
     2. MOBILE NAV HAMBURGER
  ============================================================ */
  (function initMobileNav() {
    const btn = document.getElementById('hamburger');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
      menu.setAttribute('aria-hidden', !open);
    });

    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
      }
    });
  })();


  /* ============================================================
     3. PRODUCT CAROUSEL + PiP ZOOM
  ============================================================ */
  (function initCarousel() {
    const carousel = document.getElementById('carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const thumbs = document.querySelectorAll('.thumb');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const pip = document.getElementById('zoom-pip');
    const pipImg = document.getElementById('zoom-pip-img');
    const curEl = document.getElementById('car-cur');
    const totEl = document.getElementById('car-tot');
    if (!carousel || !slides.length) return;

    const total = slides.length;
    let current = 0;
    let autoPlay;

    if (totEl) totEl.textContent = total;

    /* Go to slide index */
    function goTo(idx) {
      idx = ((idx % total) + total) % total;
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      thumbs.forEach((t, i) => {
        t.classList.toggle('active', i === idx);
        t.setAttribute('aria-pressed', i === idx);
      });
      if (curEl) curEl.textContent = idx + 1;
      current = idx;

      // Update PiP src if visible
      if (pip && pip.classList.contains('pip-visible') && pipImg) {
        const img = slides[idx].querySelector('.carousel-img');
        if (img) pipImg.src = img.src;
      }
    }

    prevBtn && prevBtn.addEventListener('click', () => { resetAutoPlay(); goTo(current - 1); });
    nextBtn && nextBtn.addEventListener('click', () => { resetAutoPlay(); goTo(current + 1); });
    thumbs.forEach(t => t.addEventListener('click', () => { resetAutoPlay(); goTo(Number(t.dataset.index)); }));

    /* Keyboard */
    carousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { resetAutoPlay(); goTo(current - 1); }
      if (e.key === 'ArrowRight') { resetAutoPlay(); goTo(current + 1); }
    });

    /* Auto-play */
    function startAutoPlay() {
      autoPlay = setInterval(() => goTo(current + 1), 4500);
    }
    function resetAutoPlay() {
      clearInterval(autoPlay);
      startAutoPlay();
    }
    startAutoPlay();
    carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
    carousel.addEventListener('mouseleave', startAutoPlay);

    /* Touch / swipe */
    let tx = 0;
    carousel.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 40) { resetAutoPlay(); goTo(dx < 0 ? current + 1 : current - 1); }
    });

    /* ── PiP Zoom on hover ────────────────────────────────── */
    if (!pip || !pipImg) return;

    function getActiveImg() {
      return slides[current] ? slides[current].querySelector('.carousel-img') : null;
    }

    carousel.addEventListener('mouseenter', () => {
      const img = getActiveImg();
      if (!img) return;
      pipImg.src = img.src;
      pip.classList.add('pip-visible');
    });

    carousel.addEventListener('mouseleave', () => {
      pip.classList.remove('pip-visible');
    });

    /* Update transform-origin so zoom tracks cursor position */
    carousel.addEventListener('mousemove', throttle(e => {
      const r = carousel.getBoundingClientRect();
      const xPct = (((e.clientX - r.left) / r.width) * 100).toFixed(1);
      const yPct = (((e.clientY - r.top) / r.height) * 100).toFixed(1);
      pipImg.style.transformOrigin = `${xPct}% ${yPct}%`;
    }, 16));
  })();


  /* ============================================================
     4. FAQ ACCORDION
  ============================================================ */
  (function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(item => {
      const btn = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (!btn || !answer) return;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all
        items.forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            const ob = other.querySelector('.faq-question');
            const oa = other.querySelector('.faq-answer');
            if (ob) ob.setAttribute('aria-expanded', 'false');
            if (oa) oa.hidden = true;
          }
        });

        // Toggle current
        item.classList.toggle('open', !isOpen);
        btn.setAttribute('aria-expanded', !isOpen);
        answer.hidden = isOpen;
      });
    });
  })();


  /* ============================================================
     5. APPLICATIONS CAROUSEL (drag + arrows + peek next card)
  ============================================================ */
  (function initAppsCarousel() {
    const track = document.getElementById('apps-track');
    const prevBtn = document.getElementById('apps-prev');
    const nextBtn = document.getElementById('apps-next');
    if (!track) return;

    const CARD_W = 260 + 16; // card width + gap
    let pos = 0;

    function maxPos() {
      return Math.max(0, track.scrollWidth - track.parentElement.offsetWidth);
    }

    function slideTo(newPos) {
      pos = Math.max(0, Math.min(maxPos(), newPos));
      track.style.transform = `translateX(-${pos}px)`;
    }

    prevBtn && prevBtn.addEventListener('click', () => slideTo(pos - CARD_W));
    nextBtn && nextBtn.addEventListener('click', () => slideTo(pos + CARD_W));

    /* Mouse drag */
    let isDrag = false, startX = 0, startPos = 0;
    track.addEventListener('mousedown', e => {
      isDrag = true; startX = e.clientX; startPos = pos;
      track.style.transition = 'none';
      e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
      if (!isDrag) return;
      slideTo(startPos + (startX - e.clientX));
    });
    window.addEventListener('mouseup', () => {
      if (!isDrag) return;
      isDrag = false;
      track.style.transition = '';
    });

    /* Touch swipe */
    let tStart = 0, tPos = 0;
    track.addEventListener('touchstart', e => { tStart = e.touches[0].clientX; tPos = pos; }, { passive: true });
    track.addEventListener('touchmove', e => { slideTo(tPos + (tStart - e.touches[0].clientX)); }, { passive: true });
  })();


  /* ============================================================
     6. MANUFACTURING TABS
        Also scrolls the active tab into view on mobile.
  ============================================================ */
  (function initTabs() {
    const tabs = document.querySelectorAll('.tabs-scroll-wrapper .tab');
    const panels = document.querySelectorAll('.tab-panel');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const idx = Number(tab.dataset.tab);

        tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        panels.forEach(p => { p.classList.remove('active'); p.hidden = true; });

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const panel = document.getElementById('tp' + idx);
        if (panel) { panel.classList.add('active'); panel.hidden = false; }

        // Scroll active tab into view (mobile)
        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      });

      // Arrow keys within tab list
      tab.addEventListener('keydown', e => {
        const cur = Number(tab.dataset.tab);
        if (e.key === 'ArrowRight') tabs[Math.min(cur + 1, tabs.length - 1)]?.click();
        if (e.key === 'ArrowLeft') tabs[Math.max(cur - 1, 0)]?.click();
      });
    });
  })();


  /* ============================================================
     7. TESTIMONIALS — arrow navigation
  ============================================================ */
  (function initTestimonials() {
    const track = document.getElementById('testimonials-track');
    const prevBtn = document.getElementById('testi-prev');
    const nextBtn = document.getElementById('testi-next');
    if (!track) return;

    const CARD_W = 300 + 20; // card + gap
    let pos = 0;

    function maxPos() {
      return Math.max(0, track.scrollWidth - track.parentElement.offsetWidth);
    }

    function slideTo(newPos) {
      pos = Math.max(0, Math.min(maxPos(), newPos));
      track.style.transform = `translateX(-${pos}px)`;
    }

    prevBtn && prevBtn.addEventListener('click', () => slideTo(pos - CARD_W));
    nextBtn && nextBtn.addEventListener('click', () => slideTo(pos + CARD_W));

    /* Touch swipe */
    let tStart = 0, tPos = 0;
    track.addEventListener('touchstart', e => { tStart = e.touches[0].clientX; tPos = pos; }, { passive: true });
    track.addEventListener('touchmove', e => { slideTo(tPos + (tStart - e.touches[0].clientX)); }, { passive: true });
  })();


  /* ============================================================
     8. FORM VALIDATION — inline errors with red borders
  ============================================================ */

  /* Helper: show/clear field error */
  function setFieldError(input, errEl, msg) {
    if (msg) {
      input.classList.add('input-error');
      errEl.textContent = msg;
      errEl.classList.add('visible');
    } else {
      input.classList.remove('input-error');
      errEl.textContent = '';
      errEl.classList.remove('visible');
    }
  }

  /* Catalogue form */
  (function initCatalogueForm() {
    const form = document.getElementById('catalogue-form');
    const emailEl = document.getElementById('catalogue-email');
    const errEl = document.getElementById('cat-err');
    if (!form || !emailEl || !errEl) return;

    // Clear on input
    emailEl.addEventListener('input', () => setFieldError(emailEl, errEl, ''));

    form.addEventListener('submit', e => {
      e.preventDefault();
      const val = emailEl.value.trim();

      if (!val) { setFieldError(emailEl, errEl, 'Please enter your email address.'); emailEl.focus(); return; }
      if (!isEmail(val)) { setFieldError(emailEl, errEl, 'Please enter a valid email address.'); emailEl.focus(); return; }

      setFieldError(emailEl, errEl, '');
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = '✓ Catalogue sent!';
        setTimeout(() => { btn.textContent = orig; btn.disabled = false; form.reset(); }, 2800);
      }, 1200);
    });
  })();

  /* Contact form */
  (function initContactForm() {
    const form = document.getElementById('contact-form-el');
    const nameEl = document.getElementById('cf-name');
    const emailEl = document.getElementById('cf-email');
    const errName = document.getElementById('err-name');
    const errEmail= document.getElementById('err-email');
    if (!form) return;

    nameEl && nameEl.addEventListener('input', () => errName && setFieldError(nameEl, errName, ''));
    emailEl && emailEl.addEventListener('input', () => errEmail && setFieldError(emailEl, errEmail, ''));

    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      const nameVal = nameEl ? nameEl.value.trim() : '';
      const emailVal = emailEl ? emailEl.value.trim() : '';

      if (!nameVal) {
        setFieldError(nameEl, errName, 'Full name is required.');
        valid = false;
      }
      if (!emailVal) {
        setFieldError(emailEl, errEmail, 'Email address is required.');
        valid = false;
      } else if (!isEmail(emailVal)) {
        setFieldError(emailEl, errEmail, 'Please enter a valid email address.');
        valid = false;
      }

      if (!valid) { form.querySelector('.input-error')?.focus(); return; }

      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Submitting…';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = '✓ Request Submitted!';
        setTimeout(() => { btn.textContent = orig; btn.disabled = false; form.reset(); }, 3000);
      }, 1400);
    });
  })();


  /* ============================================================
     9. SCROLL-REVEAL (IntersectionObserver)
  ============================================================ */
  (function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('revealed'));
      return;
    }

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => obs.observe(el));
  })();

})();