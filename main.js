/* ─────────────────────────────────────────────────────────────
   SeatForGood — Landing Page Scripts
───────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── NAV SCROLL EFFECT ─────────────────────────────────── */
  const nav = document.getElementById('nav');

  const updateNav = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ── HERO PARALLAX ─────────────────────────────────────── */
  const heroBg = document.getElementById('hero-bg');

  if (heroBg && window.matchMedia('(min-width: 769px)').matches) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.22;
      heroBg.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }

  /* ── MOBILE HAMBURGER ──────────────────────────────────── */
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  const closeMenu = () => {
    navLinks.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.nav__link, .nav__mobile-cta').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('is-open') &&
        !nav.contains(e.target)) {
      closeMenu();
    }
  });

  /* ── SMOOTH SCROLL (anchor links) ──────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── SCROLL-REVEAL (IntersectionObserver) ──────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

  /* ── COUNTER ANIMATION ─────────────────────────────────── */
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const prefix   = el.dataset.prefix  || '';
    const suffix   = el.dataset.suffix  || '';
    const duration = 1800;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOutCubic(progress) * target);
      el.textContent = prefix + value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat__num[data-target]').forEach(el => {
    counterObserver.observe(el);
  });

  /* ── WAITLIST FORM ─────────────────────────────────────── */
  const form        = document.getElementById('waitlist-form');
  const successEl   = document.getElementById('waitlist-success');
  const emailInput  = document.getElementById('wl-email');
  const emailError  = document.getElementById('email-error');

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const showError = (msg) => {
    emailError.textContent = msg;
    emailInput.classList.add('has-error');
    emailInput.focus();
  };

  const clearError = () => {
    emailError.textContent = '';
    emailInput.classList.remove('has-error');
  };

  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('has-error') && isValidEmail(emailInput.value)) {
      clearError();
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();

    const email = emailInput.value.trim();

    if (!email) {
      showError('Please enter your email address.');
      return;
    }
    if (!isValidEmail(email)) {
      showError('Please enter a valid email address.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Joining&hellip;';
    submitBtn.disabled = true;

    // Simulate async submission
    setTimeout(() => {
      form.hidden = true;
      successEl.hidden = false;
      successEl.focus();
    }, 900);
  });

})();
