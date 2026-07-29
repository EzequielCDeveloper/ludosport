/* ============================================
   Ludo Sport Drake Academy — Bold Sport
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAVBAR ---- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const onScrollNav = () => {
    const sy = window.scrollY;
    navbar.classList.toggle('navbar--solid', sy > 60);
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('navbar__toggle--active');
    navLinks.classList.toggle('navbar__links--open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('navbar__toggle--active');
      navLinks.classList.remove('navbar__links--open');
    });
  });

  /* ---- STAGGER (Intersection Observer) ---- */
  const staggerEls = document.querySelectorAll('.stagger');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('stagger--visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    staggerEls.forEach(el => obs.observe(el));
  } else {
    staggerEls.forEach(el => el.classList.add('stagger--visible'));
  }

  /* ---- CARRUSEL HORIZONTAL (scroll-snap nativo) ---- */
  const carousel = document.getElementById('actividadesScroll');
  const track = document.getElementById('actividadesTrack');
  const dots = document.getElementById('scrollDots');
  const prevBtn = document.getElementById('scrollPrev');
  const nextBtn = document.getElementById('scrollNext');

  if (carousel && track) {
    const cards = track.querySelectorAll('.actividad-card');
    const total = cards.length;
    let currentIndex = 0;

    /* build dots */
    if (dots) {
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'actividades__dot' + (i === 0 ? ' actividades__dot--active' : '');
        dot.setAttribute('aria-label', `Ir a actividad ${i + 1}`);
        dot.dataset.index = i;
        dots.appendChild(dot);
      }
    }

    const snapWidth = () => {
      if (total < 2) return 0;
      const first = cards[0];
      const second = cards[1];
      return second.offsetLeft - first.offsetLeft;
    };

    const syncUI = (index) => {
      currentIndex = Math.max(0, Math.min(index, total - 1));
      if (dots) {
        dots.querySelectorAll('.actividades__dot').forEach((d, i) => {
          d.classList.toggle('actividades__dot--active', i === currentIndex);
        });
      }
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex === total - 1;
    };

    const scrollToCard = (index) => {
      const step = snapWidth();
      if (step <= 0) return;
      carousel.scrollTo({ left: index * step, behavior: 'smooth' });
      syncUI(index);
    };

    /* ---- carousel scroll listener (syncing dots) ---- */
    let scrollTick = false;
    carousel.addEventListener('scroll', () => {
      if (!scrollTick) {
        window.requestAnimationFrame(() => {
          scrollTick = false;
          const step = snapWidth();
          if (step <= 0) return;
          const idx = Math.round(carousel.scrollLeft / step);
          if (idx !== currentIndex) syncUI(idx);
        });
        scrollTick = true;
      }
    }, { passive: true });

    /* ---- Dots click ---- */
    dots?.addEventListener('click', e => {
      const dot = e.target.closest('.actividades__dot');
      if (!dot) return;
      scrollToCard(parseInt(dot.dataset.index, 10));
    });

    /* ---- Arrows ---- */
    prevBtn?.addEventListener('click', () => {
      if (currentIndex > 0) scrollToCard(currentIndex - 1);
    });
    nextBtn?.addEventListener('click', () => {
      if (currentIndex < total - 1) scrollToCard(currentIndex + 1);
    });

    /* ---- Keyboard ---- */
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { nextBtn?.click(); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { prevBtn?.click(); e.preventDefault(); }
    });

    /* init */
    syncUI(0);
  }

  /* ---- FAQ ACCORDION ---- */
  const faqsList = document.getElementById('faqsList');
  faqsList?.addEventListener('click', e => {
    const trigger = e.target.closest('.faq-item__trigger');
    if (!trigger) return;
    const item = trigger.closest('.faq-item');
    if (!item) return;
    const isOpen = item.classList.contains('faq-item--open');

    /* close all */
    faqsList.querySelectorAll('.faq-item--open').forEach(el => {
      el.classList.remove('faq-item--open');
      el.querySelector('.faq-item__trigger')?.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('faq-item--open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });

  /* ---- SECTION TRACKING (IntersectionObserver) ---- */
  if ('IntersectionObserver' in window) {
    const sectionLinks = {
      hero: null,
      propuesta: document.querySelector('.navbar__link[href="#propuesta"]'),
      profesor: document.querySelector('.navbar__link[href="#profesor"]'),
      actividades: document.querySelector('.navbar__link[href="#actividades"]'),
      rangos: document.querySelector('.navbar__link[href="#rangos"]'),
      faqs: document.querySelector('.navbar__link[href="#faqs"]'),
      contacto: document.querySelector('.navbar__link[href="#contacto"]'),
    };

    const sectionObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const link = sectionLinks[entry.target.id];
        if (!link) return;

        if (entry.isIntersecting) {
          link.classList.add('navbar__link--active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('navbar__link--active');
          link.removeAttribute('aria-current');
        }
      });
    }, {
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    });

    Object.keys(sectionLinks).forEach(id => {
      const el = document.getElementById(id);
      if (el) sectionObs.observe(el);
    });
  }

  /* ---- WHATSAPP VISIBILITY ---- */
  const waBtn = document.getElementById('whatsappFloat');
  if (waBtn) {
    let waTimer;
    window.addEventListener('scroll', () => {
      waBtn.classList.remove('whatsapp-float--hidden');
      clearTimeout(waTimer);
      waTimer = setTimeout(() => {
        if (window.scrollY < 100) waBtn.classList.add('whatsapp-float--hidden');
      }, 2000);
    }, { passive: true });
    /* start hidden if at top */
    if (window.scrollY < 100) waBtn.classList.add('whatsapp-float--hidden');
  }

});
