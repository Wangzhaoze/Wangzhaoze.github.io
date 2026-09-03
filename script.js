(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // One-shot section reveals.
  const reveals = [...document.querySelectorAll('.reveal')];
  if (reduceMotion) {
    reveals.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach(el => io.observe(el));
    requestAnimationFrame(() => {
      document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('is-visible'));
    });
  }

  // Scroll progress + restrained hero parallax.
  const progress = document.querySelector('.scroll-progress span');
  const heroInner = document.querySelector('.hero-inner');
  const onScroll = () => {
    const y = window.scrollY;
    const doc = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.height = `${doc > 0 ? Math.min(100, (y / doc) * 100) : 0}%`;
    if (heroInner && !reduceMotion) {
      const p = Math.min(1, y / Math.max(1, window.innerHeight));
      heroInner.style.transform = `translateY(calc(-3vh - ${p * 7}vh))`;
      heroInner.style.opacity = `${1 - p * 0.48}`;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Aitezaz-inspired cursor: immediate dot + delayed outline.
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let ringX = pointerX;
  let ringY = pointerY;

  if (cursorDot && cursorRing && finePointer && !reduceMotion) {
    document.body.classList.add('custom-cursor-active');

    const cursorLoop = () => {
      ringX += (pointerX - ringX) * 0.15;
      ringY += (pointerY - ringY) * 0.15;
      cursorDot.style.left = `${pointerX}px`;
      cursorDot.style.top = `${pointerY}px`;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(cursorLoop);
    };
    requestAnimationFrame(cursorLoop);

    window.addEventListener('pointermove', e => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });

    document.addEventListener('mouseover', e => {
      const target = e.target instanceof Element ? e.target.closest('a,button,[data-cursor]') : null;
      if (!target) {
        cursorRing.classList.remove('is-hovering');
        cursorRing.removeAttribute('data-text');
        return;
      }
      cursorRing.classList.add('is-hovering');
      const type = target.getAttribute('data-cursor');
      if (type === 'view' || type === 'copy') cursorRing.setAttribute('data-text', type.toUpperCase());
      else cursorRing.removeAttribute('data-text');
    });
  }

  // Spotlight follows the pointer inside the hero.
  const hero = document.querySelector('.hero');
  const spotlight = document.querySelector('.hero-spotlight');
  if (hero && spotlight && !reduceMotion) {
    hero.addEventListener('pointermove', e => {
      const rect = hero.getBoundingClientRect();
      spotlight.style.setProperty('--x', `${e.clientX - rect.left}px`);
      spotlight.style.setProperty('--y', `${e.clientY - rect.top}px`);
      spotlight.style.opacity = '1';
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { spotlight.style.opacity = '0'; });
  }

  // Research role ticker under the hero description.
  const roleText = document.getElementById('role-text');
  const roles = ['AUTOMOTIVE RADAR', 'RADAR SIMULATION', 'GENERATIVE AI', 'AUTONOMOUS DRIVING'];
  let roleIndex = 0;
  if (roleText && !reduceMotion) {
    setInterval(() => {
      roleText.style.opacity = '0';
      roleText.style.transform = 'translateY(-8px)';
      setTimeout(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        roleText.textContent = roles[roleIndex];
        roleText.style.transform = 'translateY(8px)';
        requestAnimationFrame(() => {
          roleText.style.opacity = '1';
          roleText.style.transform = 'translateY(0)';
        });
      }, 220);
    }, 2600);
    roleText.style.transition = 'opacity .22s ease, transform .22s ease';
  }

  // Static GitHub Pages contact form: validate fields then open a pre-filled email.
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  if (contactForm instanceof HTMLFormElement) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value.trim() || '';
      const email = document.getElementById('contact-email')?.value.trim() || '';
      const message = document.getElementById('contact-message')?.value.trim() || '';
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !validEmail || message.length < 5) {
        if (formStatus) formStatus.textContent = 'Please enter your name, a valid email address, and a message.';
        return;
      }

      if (formStatus) formStatus.textContent = 'Opening your email app…';
      const subject = `Website message from ${name}`;
      const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      window.location.href = `mailto:wangzhaoze@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  // Ambient automotive-radar geometry. Mouse movement shifts the virtual sensor origin.
  const canvas = document.getElementById('radar-canvas');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let w = 0;
  let h = 0;
  let dpr = 1;
  let mx = 0;
  let my = 0;

  const points = Array.from({ length: 74 }, (_, i) => ({
    x: ((i * 47) % 100) / 100,
    y: ((i * 83) % 100) / 100,
    depth: 0.28 + ((i * 29) % 70) / 100,
    phase: (i * 0.71) % (Math.PI * 2),
    speed: 0.22 + ((i * 17) % 55) / 100,
    accent: i % 7 === 0,
  }));

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  window.addEventListener('pointermove', e => {
    mx = e.clientX / window.innerWidth - 0.5;
    my = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });

  const draw = t => {
    ctx.clearRect(0, 0, w, h);
    const cx = w * (0.66 + mx * 0.045);
    const cy = h * (0.63 + my * 0.035);

    ctx.save();
    ctx.lineWidth = 1;

    // Perspective road/digital-twin grid.
    ctx.strokeStyle = 'rgba(72,65,59,.065)';
    for (let i = 0; i < 7; i += 1) {
      const y = h * 0.52 + i * h * 0.077;
      ctx.beginPath();
      ctx.moveTo(w * 0.23, y);
      ctx.lineTo(w * 1.02, y + (i - 3) * 10);
      ctx.stroke();
    }
    for (let i = 0; i < 12; i += 1) {
      const x = w * 0.28 + i * w * 0.07;
      ctx.beginPath();
      ctx.moveTo(x, h * 0.48);
      ctx.lineTo(cx + (x - cx) * 2.0, h * 1.04);
      ctx.stroke();
    }

    // Sensor arcs.
    [0.17, 0.29, 0.41].forEach((radius, i) => {
      ctx.strokeStyle = `rgba(196,93,62,${0.12 - i * 0.022})`;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * radius, Math.PI * 1.08, Math.PI * 1.92);
      ctx.stroke();
    });

    if (!reduceMotion) {
      const pulse = ((t * 0.00013) % 1) * Math.min(w, h) * 0.55;
      ctx.strokeStyle = 'rgba(196,93,62,.15)';
      ctx.beginPath();
      ctx.arc(cx, cy, pulse, Math.PI * 1.08, Math.PI * 1.92);
      ctx.stroke();
    }

    // Sparse detections / returns.
    points.forEach(p => {
      const drift = reduceMotion ? 0 : Math.sin(t * 0.00025 * p.speed + p.phase) * 9;
      const x = w * (0.28 + p.x * 0.73) + mx * 24 * p.depth;
      const y = h * (0.29 + p.y * 0.66) + drift + my * 14 * p.depth;
      const flicker = reduceMotion ? 0.45 : 0.24 + 0.5 * Math.max(0, Math.sin(t * 0.001 + p.phase));
      ctx.fillStyle = p.accent
        ? `rgba(196,93,62,${0.35 + flicker * 0.45})`
        : `rgba(50,46,42,${0.12 + flicker * p.depth * 0.32})`;
      ctx.beginPath();
      ctx.arc(x, y, p.accent ? 1.7 : 0.8 + p.depth * 0.9, 0, Math.PI * 2);
      ctx.fill();
    });

    // Minimal ego-vehicle glyph.
    ctx.strokeStyle = 'rgba(17,17,15,.36)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx - 22, cy + 8);
    ctx.lineTo(cx, cy - 20);
    ctx.lineTo(cx + 22, cy + 8);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
})();
