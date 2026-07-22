(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
      document.body.classList.toggle('menu-open', !open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
      document.body.classList.remove('menu-open');
    }));
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const start = performance.now();
      const duration = 1100;
      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: .5 });
  counters.forEach(el => countObserver.observe(el));

  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', e => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });

  const banner = document.querySelector('.cookie-banner');
  const modal = document.querySelector('.cookie-modal');
  const consent = localStorage.getItem('sas-cookie-consent');
  if (!consent && banner) setTimeout(() => banner.classList.add('show'), 500);

  const saveConsent = (value) => {
    localStorage.setItem('sas-cookie-consent', JSON.stringify({ ...value, date: new Date().toISOString() }));
    banner?.classList.remove('show');
    modal?.classList.remove('open');
  };
  document.querySelector('[data-cookie-accept]')?.addEventListener('click', () => saveConsent({ necessary: true, analytics: true }));
  document.querySelector('[data-cookie-reject]')?.addEventListener('click', () => saveConsent({ necessary: true, analytics: false }));
  document.querySelector('[data-cookie-settings]')?.addEventListener('click', () => modal?.classList.add('open'));
  document.querySelector('[data-cookie-close]')?.addEventListener('click', () => modal?.classList.remove('open'));
  document.querySelector('[data-cookie-save]')?.addEventListener('click', () => {
    const analytics = document.querySelector('#analytics-cookies')?.checked ?? false;
    saveConsent({ necessary: true, analytics });
  });

  document.querySelectorAll('[data-open-cookie-settings]').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    modal?.classList.add('open');
  }));

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
