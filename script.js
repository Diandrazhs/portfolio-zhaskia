/* ============================================
   PORTFOLIO – WYNTHAH FARELL
   script.js
============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initScrollReveal();
  initSlider();
  initActiveNav();
  initSkillTabs();
});


/* ════════════════════════════════════════════════
   1. NAVBAR — add .scrolled class on scroll
════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}


/* ════════════════════════════════════════════════
   2. HAMBURGER MENU
════════════════════════════════════════════════ */
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('hidden');
  });
}

function closeMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  btn?.classList.remove('open');
  menu?.classList.add('hidden');
}
window.closeMobileMenu = closeMobileMenu;


/* ════════════════════════════════════════════════
   3. ACTIVE NAV LINK highlight on scroll
════════════════════════════════════════════════ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        link.style.color = '';
        link.style.fontWeight = '';
      });
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) {
        active.style.color = '#d4868c';
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}


/* ════════════════════════════════════════════════
   4. SCROLL REVEAL
════════════════════════════════════════════════ */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => observer.observe(el));
}


/* ════════════════════════════════════════════════
   5. PROJECT SLIDER — responsive cards per view
════════════════════════════════════════════════ */
function initSlider() {
  const track    = document.getElementById('slider-track');
  const dotsWrap = document.getElementById('slider-dots');
  const prevBtn  = document.getElementById('prev-btn');
  const nextBtn  = document.getElementById('next-btn');
  if (!track) return;

  const cards        = Array.from(track.querySelectorAll('.project-card'));
  const totalCards   = cards.length;
  let   currentIndex = 0;
  let   isDragging   = false;
  let   startX       = 0;
  let   dragOffset   = 0;
  let   totalSlides  = 1;

  /* ── selalu tampilkan 1 card per slide di semua ukuran layar ── */
  function getCardsPerSlide() {
    return 1;
  }

  /* ── get slide offset in px ── */
  function getSlideOffset(index) {
    const outer  = track.parentElement;
    const gap    = 24;
    const padH   = window.innerWidth <= 360 ? 8 : window.innerWidth <= 480 ? 12 : 24;
    const pageW  = outer.clientWidth - (padH * 2);
    return -(index * (pageW + gap));
  }

  /* ── build dots ── */
  function buildDots() {
    const cps = getCardsPerSlide();
    totalSlides = Math.ceil(totalCards / cps);
    dotsWrap.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = `slider-dot-item${i === currentIndex ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.slider-dot-item').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });
  }

  /* ── move slider ── */
  function goTo(index) {
    const cps = getCardsPerSlide();
    totalSlides = Math.ceil(totalCards / cps);
    // Wrap-around
    if (index >= totalSlides) currentIndex = 0;
    else if (index < 0)       currentIndex = totalSlides - 1;
    else                      currentIndex = index;
    track.style.transition = 'transform .6s cubic-bezier(.4,0,.2,1)';
    track.style.transform  = `translateX(${getSlideOffset(currentIndex)}px)`;
    updateDots();
  }

  /* ── arrow buttons ── */
  prevBtn?.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn?.addEventListener('click', () => goTo(currentIndex + 1));

  /* ── keyboard support ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(currentIndex - 1);
    if (e.key === 'ArrowRight') goTo(currentIndex + 1);
  });

  /* ── drag / swipe ── */
  function onPointerDown(e) {
    isDragging = true;
    startX     = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    dragOffset = 0;
    track.style.transition = 'none';
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const x    = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    dragOffset = x - startX;
    track.style.transform = `translateX(${getSlideOffset(currentIndex) + dragOffset}px)`;
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    if (dragOffset < -60)      goTo(currentIndex + 1);
    else if (dragOffset > 60)  goTo(currentIndex - 1);
    else                       goTo(currentIndex);
  }

  track.addEventListener('mousedown',  onPointerDown);
  track.addEventListener('mousemove',  onPointerMove);
  track.addEventListener('mouseup',    onPointerUp);
  track.addEventListener('mouseleave', onPointerUp);
  track.addEventListener('touchstart', onPointerDown, { passive: true });
  track.addEventListener('touchmove',  onPointerMove, { passive: true });
  track.addEventListener('touchend',   onPointerUp);

  /* ── rebuild on resize ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      goTo(Math.min(currentIndex, totalSlides - 1));
    }, 200);
  });

  /* ── init ── */
  buildDots();
  goTo(0);
}


/* ════════════════════════════════════════════════
   6. SKILL TABS
════════════════════════════════════════════════ */
function initSkillTabs() {
  const tabs   = document.querySelectorAll('.skill-tab-btn');
  const panels = document.querySelectorAll('.skill-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.querySelector(`.skill-panel[data-panel="${target}"]`);
      if (panel) panel.classList.add('active');
    });
  });
}


/* ════════════════════════════════════════════════
   7. CONTACT FORM VALIDATION + ALERT + GOOGLE SHEETS
════════════════════════════════════════════════ */

// ── GANTI URL INI dengan URL Google Apps Script kamu ──
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbytWUaxezPGRfSHoCwqa5fr06Uo8JOdfmiW4SaFyMGVH3Y5tvOWIT2ExtRpQ7i5WAm6/exec';

function showAlert(type, message) {
  const alertEl = document.getElementById('form-alert');
  if (!alertEl) return;
  alertEl.className = `form-alert ${type}`;
  alertEl.innerHTML = message;
  alertEl.classList.remove('hidden');
  // auto-hide after 7s
  setTimeout(() => { alertEl.classList.add('hidden'); }, 7000);
  alertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearErrors() {
  ['f-name', 'f-email', 'f-subject', 'f-message'].forEach(id => {
    document.getElementById(id)?.classList.remove('error');
  });
}

function handleFormSubmit() {
  clearErrors();

  const name    = document.getElementById('f-name');
  const email   = document.getElementById('f-email');
  const subject = document.getElementById('f-subject');
  const message = document.getElementById('f-message');
  const btn     = document.querySelector('[onclick="handleFormSubmit()"]');

  const errors = [];

  // Validate name
  if (!name?.value.trim()) {
    errors.push('Nama Lengkap');
    name?.classList.add('error');
  }

  // Validate email
  const emailRgx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email?.value.trim()) {
    errors.push('Email');
    email?.classList.add('error');
  } else if (!emailRgx.test(email.value.trim())) {
    errors.push('Format email tidak valid');
    email?.classList.add('error');
  }

  // Validate subject
  if (!subject?.value.trim()) {
    errors.push('Subjek');
    subject?.classList.add('error');
  }

  // Validate message — minimal 3 karakter
  if (!message?.value.trim()) {
    errors.push('Pesan');
    message?.classList.add('error');
  } else if (message.value.trim().length < 3) {
    errors.push('Pesan terlalu singkat (minimal 3 karakter)');
    message?.classList.add('error');
  }

  if (errors.length > 0) {
    showAlert('error-alert',
      `<strong>⚠ Oops!</strong> Harap lengkapi: <em>${errors.join(', ')}</em>.`
    );
    return;
  }

  // Disable tombol saat proses kirim
  if (btn) { btn.disabled = true; btn.style.opacity = '0.6'; }
  showAlert('info', '<i class="fas fa-spinner fa-spin"></i>&nbsp; Mengirim pesan...');

  const payload = {
    name:    name.value.trim(),
    email:   email.value.trim(),
    subject: subject.value.trim(),
    message: message.value.trim(),
  };

  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode:   'no-cors',          // Apps Script tidak support CORS, pakai no-cors
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  .then(() => {
    // no-cors → response selalu opaque, anggap sukses jika tidak error
    showAlert('success',
      '<strong>✓ Pesan Terkirim!</strong> Terima kasih telah menghubungi saya✨'
    );
    name.value = email.value = subject.value = message.value = '';
    clearErrors();
  })
  .catch(() => {
    showAlert('error-alert',
      '<strong>✗ Gagal Mengirim.</strong> Periksa koneksi internet kamu dan coba lagi.'
    );
  })
  .finally(() => {
    if (btn) { btn.disabled = false; btn.style.opacity = ''; }
  });
}

window.handleFormSubmit = handleFormSubmit;