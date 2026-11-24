document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  const header = document.getElementById('header');
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');

  /* Header shadow on scroll */
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  const setMenu = (open) => {
    menu.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}" class="w-7 h-7"></i>`;
    lucide.createIcons();
  };
  menuBtn.addEventListener('click', () => setMenu(menu.classList.contains('hidden')));
  window.addEventListener('resize', () => { if (window.innerWidth >= 1024) setMenu(false); });

  /* Smooth scroll with fixed-header offset */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      setMenu(false);
      const offset = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* Video modal */
  const modal = document.getElementById('video-modal');
  const frame = document.getElementById('video-frame');
  const openModal = () => {
    frame.src = frame.dataset.src;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    modal.classList.remove('open');
    frame.src = '';                       // stops playback
    document.body.style.overflow = '';
  };
  document.getElementById('video-btn').addEventListener('click', openModal);
  document.getElementById('video-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal(); setMenu(false); }
  });
  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }
  /* Footer year */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Contact form (front-end validation only; connect to your backend/service to send) */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const setStatus = (text, ok) => {
        status.textContent = text;
        status.className = 'text-sm min-h-[1.25rem] ' + (ok ? 'text-success' : 'text-red-400');
      };
      if (!name || !email || !message) return setStatus('Please fill in all fields.', false);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setStatus('Please enter a valid email address.', false);
      setStatus('Thank you! Your message has been sent.', true);
      form.reset();
    });
  }
});