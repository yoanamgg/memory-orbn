(function () {
  'use strict';

  /* ===== Config: update these to match the real restaurant ===== */
  var HOURS = [
    { day: 'Lundi', open: '11:00', close: '23:00' },
    { day: 'Mardi', open: '11:00', close: '23:00' },
    { day: 'Mercredi', open: '11:00', close: '23:00' },
    { day: 'Jeudi', open: '11:00', close: '23:00' },
    { day: 'Vendredi', open: '11:00', close: '23:30' },
    { day: 'Samedi', open: '11:00', close: '23:30' },
    { day: 'Dimanche', open: '12:00', close: '22:30' }
  ];

  var header = document.getElementById('header');
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');
  var backToTop = document.getElementById('back-to-top');
  var openBadge = document.getElementById('open-status-badge');

  /* ----- Sticky header ----- */
  function onScroll() {
    var scrolled = window.scrollY > 10;
    header.classList.toggle('scrolled', scrolled);
    if (backToTop) backToTop.hidden = window.scrollY < 600;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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

  /* ----- Active nav link on scroll ----- */
  var navLinks = document.querySelectorAll('.main-nav a');
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

  /* ----- Menu tabs ----- */
  var tabs = document.querySelectorAll('.menu-tab');
  var panels = document.querySelectorAll('.menu-panel');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      var target = document.getElementById(tab.getAttribute('data-target'));
      if (target) target.classList.add('active');
    });
  });

  /* ----- Reviews carousel ----- */
  var track = document.querySelector('.reviews-track');
  var prevBtn = document.getElementById('reviews-prev');
  var nextBtn = document.getElementById('reviews-next');
  if (track && prevBtn && nextBtn) {
    var scrollAmount = function () { return track.clientWidth * 0.8; };
    prevBtn.addEventListener('click', function () { track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }); });
    nextBtn.addEventListener('click', function () { track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }); });
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
      hoursCell.textContent = entry.open + ' – ' + entry.close;
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
    var isOpen = nowMinutes >= toMinutes(todayHours.open) && nowMinutes < toMinutes(todayHours.close);
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
