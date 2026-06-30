(function () {
  'use strict';

  /* ===== Config: horaires réels de la boucherie (chaque jour = liste de créneaux, vide si fermé) ===== */
  var HOURS = [
    { day: 'Lundi', shifts: [] },
    { day: 'Mardi', shifts: [['09:00', '12:30'], ['16:00', '19:00']] },
    { day: 'Mercredi', shifts: [['09:00', '12:30'], ['16:00', '19:00']] },
    { day: 'Jeudi', shifts: [['09:00', '12:30'], ['16:00', '19:00']] },
    { day: 'Vendredi', shifts: [['09:00', '12:30'], ['16:00', '19:00']] },
    { day: 'Samedi', shifts: [['09:00', '12:30'], ['16:00', '19:00']] },
    { day: 'Dimanche', shifts: [['09:00', '13:00']] }
  ];

  var header = document.getElementById('header');
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');
  var backToTop = document.getElementById('back-to-top');
  var openBadge = document.getElementById('open-status-badge');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- Preloader ----- */
  var preloader = document.getElementById('preloader');
  function hidePreloader() { if (preloader) preloader.classList.add('is-done'); }
  window.addEventListener('load', function () { setTimeout(hidePreloader, 350); });
  // Safety net in case 'load' already fired or is delayed
  setTimeout(hidePreloader, 2500);

  /* ----- Scroll progress + parallax (rAF batched) ----- */
  var progressBar = document.getElementById('scroll-progress');
  var heroBg = document.getElementById('hero-bg');
  var heroContent = document.getElementById('hero-content');
  var ticking = false;

  function updateOnScroll() {
    var y = window.scrollY;
    var scrolled = y > 10;
    header.classList.toggle('scrolled', scrolled);
    if (backToTop) backToTop.hidden = y < 600;

    if (progressBar) {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = docH > 0 ? Math.min(y / docH, 1) : 0;
      progressBar.style.transform = 'scaleX(' + ratio + ')';
    }

    if (!reduceMotion && y < window.innerHeight) {
      if (heroBg) heroBg.style.transform = 'translateY(' + (y * 0.3) + 'px) scale(1.05)';
      if (heroContent) {
        heroContent.style.transform = 'translateY(' + (y * 0.18) + 'px)';
        heroContent.style.opacity = String(Math.max(1 - y / 600, 0));
      }
    }
    ticking = false;
  }
  function onScroll() {
    if (!ticking) { window.requestAnimationFrame(updateOnScroll); ticking = true; }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  updateOnScroll();

  /* ----- Mobile nav ----- */
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----- Active nav link + section dots on scroll ----- */
  var navLinks = document.querySelectorAll('.main-nav a');
  var dotLinks = document.querySelectorAll('.section-dots a');
  var sections = Array.prototype.map.call(navLinks, function (link) {
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === id);
        });
        dotLinks.forEach(function (dot) {
          dot.classList.toggle('active', dot.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ----- Reveal on scroll ----- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ----- Animated counters ----- */
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion) {
      el.textContent = target.toFixed(decimals).replace('.', ',') + suffix;
      return;
    }
    var start = null;
    var duration = 1300;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased).toFixed(decimals).replace('.', ',');
      el.textContent = val + suffix;
      if (p < 1) window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  }
  if (counters.length && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCount(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { countObserver.observe(c); });
  }

  /* ----- Hero spotlight follows cursor ----- */
  var hero = document.querySelector('.hero');
  var spotlight = document.getElementById('hero-spotlight');
  if (hero && spotlight && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      spotlight.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
      spotlight.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
    });
  }

  /* ----- Magnetic buttons ----- */
  var magnets = document.querySelectorAll('.btn-magnetic');
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    magnets.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.25).toFixed(1) + 'px, ' + (y * 0.35).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ----- Hero video: respect prefers-reduced-motion ----- */
  var heroVideo = document.getElementById('hero-video');
  var heroFallbackImg = document.getElementById('hero-fallback-img');
  if (heroVideo) {
    if (reduceMotion) {
      heroVideo.pause();
      heroVideo.hidden = true;
      if (heroFallbackImg) heroFallbackImg.hidden = false;
    } else {
      heroVideo.addEventListener('error', function () {
        heroVideo.hidden = true;
        if (heroFallbackImg) heroFallbackImg.hidden = false;
      });
    }
  }

  /* ----- Gallery 3D tilt ----- */
  var galleryItems = document.querySelectorAll('.gallery-item');
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (galleryItems.length && !prefersReducedMotion) {
    if (canHover) {
      galleryItems.forEach(function (item) {
        item.addEventListener('mousemove', function (e) {
          var rect = item.getBoundingClientRect();
          var x = (e.clientX - rect.left) / rect.width - 0.5;
          var y = (e.clientY - rect.top) / rect.height - 0.5;
          item.style.setProperty('--rx', (x * 16).toFixed(2) + 'deg');
          item.style.setProperty('--ry', (y * -16).toFixed(2) + 'deg');
          item.style.setProperty('--scale', '1.04');
        });
        item.addEventListener('mouseleave', function () {
          item.style.setProperty('--rx', '0deg');
          item.style.setProperty('--ry', '0deg');
          item.style.setProperty('--scale', '1');
        });
      });
    } else {
      /* Real gyroscope-driven 3D tilt on touch devices */
      var gyroBaseline = null;
      var gyroActive = false;
      var gallerySection = document.getElementById('galerie');
      var galleryInView = false;

      function resetTilt() {
        gyroBaseline = null;
        galleryItems.forEach(function (item) {
          item.style.setProperty('--rx', '0deg');
          item.style.setProperty('--ry', '0deg');
          item.style.setProperty('--scale', '1');
        });
      }

      function onDeviceOrientation(e) {
        if (!galleryInView || e.beta === null || e.gamma === null) return;
        if (gyroBaseline === null) gyroBaseline = { beta: e.beta, gamma: e.gamma };
        var dx = Math.max(-18, Math.min(18, e.gamma - gyroBaseline.gamma));
        var dy = Math.max(-18, Math.min(18, e.beta - gyroBaseline.beta));
        galleryItems.forEach(function (item) {
          item.style.setProperty('--rx', (dy * -0.6).toFixed(2) + 'deg');
          item.style.setProperty('--ry', (dx * 0.6).toFixed(2) + 'deg');
          item.style.setProperty('--scale', '1.025');
        });
      }

      function startGyro() {
        if (gyroActive) return;
        gyroActive = true;
        window.addEventListener('deviceorientation', onDeviceOrientation);
      }

      if (gallerySection && 'IntersectionObserver' in window) {
        var galleryViewObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            galleryInView = entry.isIntersecting;
            if (!galleryInView) resetTilt();
          });
        }, { threshold: 0.3 });
        galleryViewObserver.observe(gallerySection);
      } else {
        galleryInView = true;
      }

      var gyroPrompt = document.getElementById('gyro-prompt');
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        if (gyroPrompt) {
          gyroPrompt.hidden = false;
          gyroPrompt.addEventListener('click', function () {
            DeviceOrientationEvent.requestPermission().then(function (state) {
              if (state === 'granted') {
                startGyro();
                gyroPrompt.hidden = true;
              }
            }).catch(function () {});
          });
        }
      } else if ('DeviceOrientationEvent' in window) {
        startGyro();
      } else {
        galleryItems.forEach(function (item) {
          item.addEventListener('touchstart', function () {
            item.style.setProperty('--rx', '8deg');
            item.style.setProperty('--ry', '-8deg');
            item.style.setProperty('--scale', '1.05');
            setTimeout(function () {
              item.style.setProperty('--rx', '0deg');
              item.style.setProperty('--ry', '0deg');
              item.style.setProperty('--scale', '1');
            }, 350);
          }, { passive: true });
        });
      }
    }
  }

  /* ----- Reviews carousel ----- */
  var track = document.querySelector('.reviews-track');
  var prevBtn = document.getElementById('reviews-prev');
  var nextBtn = document.getElementById('reviews-next');
  if (track && prevBtn && nextBtn) {
    var scrollAmount = function () { return track.clientWidth * 0.8; };
    prevBtn.addEventListener('click', function () { track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }); });
    nextBtn.addEventListener('click', function () { track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }); });
  }

  /* ----- Curseur personnalisé (desktop) ----- */
  var cursorDot = document.getElementById('cursor-dot');
  var cursorRing = document.getElementById('cursor-ring');
  if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var ringX = window.innerWidth / 2, ringY = window.innerHeight / 2;
    var mouseX = ringX, mouseY = ringY;
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px) translate(-50%, -50%)';
    });
    function trackRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = 'translate(' + ringX + 'px, ' + ringY + 'px) translate(-50%, -50%)';
      window.requestAnimationFrame(trackRing);
    }
    window.requestAnimationFrame(trackRing);

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a, button, input, textarea, [role="button"]')) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a, button, input, textarea, [role="button"]')) {
        document.body.classList.remove('cursor-hover');
      }
    });
  }

  /* ----- Back to top ----- */
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----- Opening hours: render table + compute open/closed ----- */
  function pad(n) { return String(n).padStart(2, '0'); }
  function toMinutes(hhmm) {
    var parts = hhmm.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  function renderHoursTable(tableEl, todayIndex) {
    if (!tableEl) return;
    tableEl.innerHTML = '';
    HOURS.forEach(function (entry, index) {
      var jsDayIndex = (index + 1) % 7; // HOURS[0] = Monday -> JS getDay() Monday = 1
      var row = document.createElement('tr');
      if (jsDayIndex === todayIndex) row.classList.add('is-today');
      var dayCell = document.createElement('td');
      dayCell.textContent = entry.day;
      var hoursCell = document.createElement('td');
      hoursCell.textContent = entry.shifts.length
        ? entry.shifts.map(function (s) { return s[0] + ' – ' + s[1]; }).join(' / ')
        : 'Fermé';
      row.appendChild(dayCell);
      row.appendChild(hoursCell);
      tableEl.appendChild(row);
    });
  }

  var now = new Date();
  var todayIndex = now.getDay();
  renderHoursTable(document.getElementById('hours-table'), todayIndex);
  renderHoursTable(document.getElementById('hours-table-footer'), todayIndex);

  var todayHours = HOURS[(todayIndex + 6) % 7];
  if (todayHours && openBadge) {
    var nowMinutes = now.getHours() * 60 + now.getMinutes();
    var isOpen = todayHours.shifts.some(function (s) {
      return nowMinutes >= toMinutes(s[0]) && nowMinutes < toMinutes(s[1]);
    });
    openBadge.textContent = isOpen ? 'Ouvert maintenant' : 'Fermé pour le moment';
    openBadge.classList.toggle('is-closed', !isOpen);
  }

  /* ----- Footer year ----- */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----- Reservation form (front-end demo only, no backend wired) ----- */
  var form = document.getElementById('reservation-form');
  var successMsg = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (successMsg) successMsg.hidden = false;
      form.reset();
    });
  }
})();
