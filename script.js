// ===== Custom Cursor (Brutalist touch) =====
const cursor = document.getElementById('cursor');
if (cursor) {
  window.addEventListener('mousemove', (e) => {
    // Only animate on non-mobile
    if (window.innerWidth > 768) {
      // Use requestAnimationFrame for smoother following
      requestAnimationFrame(() => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });
    }
  });

  // Expand cursor on interactive elements
  document.querySelectorAll('a, button, input, textarea, .brutal-hover').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '64px';
      cursor.style.height = '64px';
      cursor.style.mixBlendMode = 'difference';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
    });
  });
}

// ===== Scroll Reveal (Staggered for collage look) =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('active'), i * 150); // increased delay for dramatic effect
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== Counter Animation =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.target;
      let count = 0;
      const timer = setInterval(() => {
        count += 1; // slow count for brutalist chunky text
        if (count >= target) { count = target; clearInterval(timer); }
        el.textContent = count;
      }, 30);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ===== Brutal Contact Form Simulation =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'TRANSMITTING...';
    btn.classList.add('opacity-50', 'cursor-not-allowed');
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'DONE! X';
      btn.classList.remove('opacity-50', 'bg-dark-900', 'text-brand-yellow');
      btn.classList.add('bg-white', 'text-dark-900');

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.classList.remove('bg-white', 'cursor-not-allowed');
        btn.classList.add('bg-dark-900', 'text-brand-yellow');
        e.target.reset();
      }, 2500);
    }, 1500);
  });
}
