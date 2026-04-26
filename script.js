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
   5. PROJECT SLIDER — scroll-snap, 1 card per slide
════════════════════════════════════════════════ */
function initSlider() {
  const outer    = document.querySelector('.slider-outer');
  const track    = document.getElementById('slider-track');
  const dotsWrap = document.getElementById('slider-dots');
  const prevBtn  = document.getElementById('prev-btn');
  const nextBtn  = document.getElementById('next-btn');
  if (!track || !outer) return;

  const cards      = Array.from(track.querySelectorAll('.project-card'));
  const totalCards = cards.length;
  let   currentIndex = 0;

  /* ── build dots ── */
  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < totalCards; i++) {
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

  /* ── move slider via scrollTo (scroll-snap handles snapping) ── */
  function goTo(index) {
    // Wrap-around
    if (index >= totalCards) currentIndex = 0;
    else if (index < 0)      currentIndex = totalCards - 1;
    else                     currentIndex = index;

    // Scroll position = card width × index (gap = 0, card tepat 100% lebar outer)
    const cardWidth = cards[0] ? cards[0].offsetWidth : outer.offsetWidth;
    const scrollLeft = cardWidth * currentIndex;
    outer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    updateDots();
  }

  /* ── sync dots when user swipes/scrolls manually ── */
  let scrollTimer;
  outer.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      // Find which card is most visible
      const outerLeft = outer.getBoundingClientRect().left;
      let closestIdx  = 0;
      let closestDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.getBoundingClientRect().left - outerLeft);
        if (dist < closestDist) { closestDist = dist; closestIdx = i; }
      });
      if (closestIdx !== currentIndex) {
        currentIndex = closestIdx;
        updateDots();
      }
    }, 80);
  }, { passive: true });

  /* ── arrow buttons ── */
  prevBtn?.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn?.addEventListener('click', () => goTo(currentIndex + 1));

  /* ── keyboard support ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(currentIndex - 1);
    if (e.key === 'ArrowRight') goTo(currentIndex + 1);
  });

  /* ── rebuild dots on resize ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      goTo(Math.min(currentIndex, totalCards - 1));
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