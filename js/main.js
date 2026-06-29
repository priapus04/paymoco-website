/* ===================================================
   Paymoco Website — Main JavaScript
   =================================================== */

(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  function qs(selector, parent) {
    return (parent || document).querySelector(selector);
  }

  /* ---------- Dynamic year ---------- */
  var yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar: scroll shadow & burger ---------- */
  var navbar    = qs('#navbar');
  var burgerBtn = qs('#burgerBtn');
  var navLinks  = qs('#navLinks');

  window.addEventListener('scroll', function () {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }
  }, { passive: true });

  if (burgerBtn && navLinks) {
    burgerBtn.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      burgerBtn.classList.toggle('open', isOpen);
      burgerBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        burgerBtn.classList.remove('open');
        burgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        burgerBtn.classList.remove('open');
        burgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Scroll-reveal animation ---------- */
  function initScrollReveal() {
    var cards = document.querySelectorAll('.service-card, .step-card, .stat-card');

    var style = document.createElement('style');
    style.textContent = [
      '.reveal-ready { opacity: 0; transform: translateY(28px); transition: opacity 0.55s ease, transform 0.55s ease; }',
      '.reveal-ready.revealed { opacity: 1; transform: translateY(0); }'
    ].join('\n');
    document.head.appendChild(style);

    cards.forEach(function (el, i) {
      el.classList.add('reveal-ready');
      el.style.transitionDelay = (i % 3 * 80) + 'ms';
    });

    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (el) { el.classList.add('revealed'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    cards.forEach(function (el) { observer.observe(el); });
  }

  initScrollReveal();

  /* ---------- Contact form ---------- */
  var form     = qs('#contactForm');
  var formNote = qs('#formNote');

  function showNote(msg, type) {
    if (!formNote) return;
    formNote.textContent = msg;
    formNote.className = 'form-note ' + type;
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var fullName = qs('#fullName');
      var email    = qs('#email');
      var business = qs('#business');
      var valid    = true;

      // Clear previous error states
      [fullName, email, business].forEach(function (el) {
        if (el) el.classList.remove('error');
      });
      showNote('', '');

      if (!fullName || !fullName.value.trim()) {
        if (fullName) fullName.classList.add('error');
        valid = false;
      }
      if (!email || !validateEmail(email.value.trim())) {
        if (email) email.classList.add('error');
        valid = false;
      }
      if (!business || !business.value.trim()) {
        if (business) business.classList.add('error');
        valid = false;
      }

      if (!valid) {
        showNote('Please fill in all required fields correctly.', 'error');
        return;
      }

      // Simulate form submission (replace with real endpoint as needed)
      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      setTimeout(function () {
        form.reset();
        showNote('✓ Message sent! Our team will be in touch shortly.', 'success');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      }, 1400);
    });
  }

})();
