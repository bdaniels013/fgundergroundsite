// ============================================
// F&G Underground - Interaction layer
// Progressive enhancement only.
// ============================================

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Mobile nav toggle ---
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
    });
  });
}

// --- Sticky header shadow on scroll ---
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// --- Scroll reveal (with stagger support) ---
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
if (revealEls.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

// --- Animated stat counters ---
const counters = document.querySelectorAll('[data-count]');
if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const duration = 1400;
      const start = performance.now();
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = target * easeOut(progress);
        el.textContent = Number.isInteger(target)
          ? Math.round(current).toLocaleString()
          : current.toFixed(1);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = Number.isInteger(target) ? target.toLocaleString() : target;
      };
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObs.observe(c));
}

// --- Magnetic buttons (subtle pull toward cursor) ---
if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    const strength = 0.25;
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// --- Card hover spotlight (track cursor for radial gradient) ---
if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', mx + '%');
      card.style.setProperty('--my', my + '%');
    });
  });
}

// --- Subtle 3D tilt on selected cards ---
if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    const max = 6;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * -max;
      const ry = (px - 0.5) * max;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// --- Footer year ---
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- Contact form handler ---
const form = document.getElementById('contact-form');
if (form) {
  const status = document.getElementById('form-status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form-status';
    status.textContent = '';

    const data = new FormData(form);
    const action = form.getAttribute('action');

    if (action && action.startsWith('http')) {
      try {
        const res = await fetch(action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.reset();
          status.classList.add('success');
          status.textContent = 'Thanks, your message is on its way. We will get back to you shortly.';
        } else {
          throw new Error('Network');
        }
      } catch (err) {
        status.classList.add('error');
        status.textContent = 'Something went wrong. Please call us directly or try again.';
      }
    } else {
      const name = encodeURIComponent(data.get('name') || '');
      const phone = encodeURIComponent(data.get('phone') || '');
      const email = encodeURIComponent(data.get('email') || '');
      const company = encodeURIComponent(data.get('company') || '');
      const service = encodeURIComponent(data.get('service') || '');
      const message = encodeURIComponent(data.get('message') || '');
      const body = `Name: ${name}%0D%0APhone: ${phone}%0D%0AEmail: ${email}%0D%0ACompany: ${company}%0D%0AService: ${service}%0D%0A%0D%0AMessage:%0D%0A${message}`;
      window.location.href = `mailto:info@fgunder.com?subject=Project%20Inquiry%20from%20${name}&body=${body}`;
      status.classList.add('success');
      status.textContent = 'Opening your email client...';
    }
  });
}
