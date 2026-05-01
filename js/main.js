// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', links.classList.contains('open'));
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Contact form handler
const form = document.getElementById('contact-form');
if (form) {
  const status = document.getElementById('form-status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form-status';
    status.textContent = '';

    const data = new FormData(form);
    const action = form.getAttribute('action');

    // If a real Formspree/Netlify endpoint is configured, POST to it.
    // Otherwise fall back to a mailto link so messages still reach the inbox.
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
      // Fallback: open mail client
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
