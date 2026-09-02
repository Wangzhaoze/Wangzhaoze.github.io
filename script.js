(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = [...document.querySelectorAll('.reveal')];
  if (reduceMotion) reveals.forEach(el => el.classList.add('is-visible'));
  else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.09, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(el => io.observe(el));
    requestAnimationFrame(() => document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('is-visible')));
  }

  const title = document.querySelector('.hero-wordmark');
  const progress = document.querySelector('.scroll-progress span');
  const onScroll = () => {
    const y = window.scrollY;
    const doc = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.height = `${doc > 0 ? Math.min(100, y / doc * 100) : 0}%`;
    if (title && !reduceMotion) {
      const p = Math.min(1, y / Math.max(1, window.innerHeight));
      title.style.transform = `translateY(${p * 11}vh) scale(${1 - p * 0.035})`;
      title.style.opacity = `${1 - p * 0.58}`;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const cursor = document.querySelector('.cursor-dot');
  if (cursor && matchMedia('(pointer:fine)').matches && !reduceMotion) {
    window.addEventListener('pointermove', e => {
      cursor.style.opacity = '1';
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    }, { passive: true });
    document.querySelectorAll('a').forEach(a => {
      a.addEventListener('mouseenter', () => { cursor.style.width = '22px'; cursor.style.height = '22px'; });
      a.addEventListener('mouseleave', () => { cursor.style.width = '8px'; cursor.style.height = '8px'; });
    });
  }

  const canvas = document.getElementById('radar-canvas');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let w = 0, h = 0, dpr = 1, raf = 0, mx = 0, my = 0;
  const points = Array.from({ length: 92 }, (_, i) => ({
    x: ((i * 47) % 100) / 100,
    y: ((i * 83) % 100) / 100,
    depth: .35 + ((i * 29) % 65) / 100,
    phase: (i * .71) % (Math.PI * 2),
    speed: .25 + ((i * 17) % 50) / 100,
  }));

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const pointer = e => {
    mx = e.clientX / window.innerWidth - .5;
    my = e.clientY / window.innerHeight - .5;
  };

  const draw = t => {
    ctx.clearRect(0, 0, w, h);
    const cx = w * (.69 + mx * .016);
    const cy = h * (.66 + my * .015);

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(202,255,233,.08)';
    for (let i = 0; i < 7; i++) {
      const y = h * .53 + i * h * .075;
      ctx.beginPath(); ctx.moveTo(w * .37, y); ctx.lineTo(w * 1.04, y + (i - 3) * 11); ctx.stroke();
    }
    for (let i = 0; i < 10; i++) {
      const x = w * .43 + i * w * .075;
      ctx.beginPath(); ctx.moveTo(x, h * .48); ctx.lineTo(cx + (x - cx) * 1.85, h * 1.06); ctx.stroke();
    }

    const maxR = Math.min(w, h) * .58;
    [0.18, .31, .44].forEach((r, i) => {
      ctx.strokeStyle = `rgba(154,255,221,${.09 - i * .014})`;
      ctx.beginPath(); ctx.arc(cx, cy, Math.min(w,h) * r, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
    });
    if (!reduceMotion) {
      const pulse = ((t * .00014) % 1) * maxR;
      ctx.strokeStyle = 'rgba(154,255,221,.18)';
      ctx.beginPath(); ctx.arc(cx, cy, pulse, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
    }

    points.forEach(p => {
      const drift = reduceMotion ? 0 : Math.sin(t * .00025 * p.speed + p.phase) * 12;
      const x = w * (.40 + p.x * .62) + mx * 18 * p.depth;
      const y = h * (.34 + p.y * .61) + drift + my * 11 * p.depth;
      const flicker = reduceMotion ? .55 : .28 + .58 * Math.max(0, Math.sin(t * .0012 + p.phase));
      ctx.fillStyle = `rgba(180,255,228,${flicker * p.depth})`;
      ctx.beginPath(); ctx.arc(x, y, .7 + p.depth * 1.22, 0, Math.PI * 2); ctx.fill();
    });

    ctx.strokeStyle = 'rgba(219,255,241,.38)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(cx - 24, cy + 9); ctx.lineTo(cx, cy - 22); ctx.lineTo(cx + 24, cy + 9); ctx.closePath(); ctx.stroke();
    ctx.restore();
    raf = requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', pointer, { passive: true });
  raf = requestAnimationFrame(draw);
})();
