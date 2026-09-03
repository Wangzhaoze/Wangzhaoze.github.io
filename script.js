(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal-on-scroll
  const reveals = [...document.querySelectorAll('.reveal')];
  if (reduceMotion) {
    reveals.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach(el => revealObserver.observe(el));
    requestAnimationFrame(() => {
      document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('is-visible'));
    });
  }

  // Scroll progress + subtle hero drift
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

  // Aitezaz-style cursor
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  let pointerX = innerWidth / 2;
  let pointerY = innerHeight / 2;
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

  // Hero spotlight
  const hero = document.querySelector('.hero');
  const spotlight = document.querySelector('.hero-spotlight');
  if (hero && spotlight && !reduceMotion) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      spotlight.style.setProperty('--x', `${e.clientX - r.left}px`);
      spotlight.style.setProperty('--y', `${e.clientY - r.top}px`);
      spotlight.style.opacity = '1';
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { spotlight.style.opacity = '0'; });
  }

  // Research field ticker
  const roleText = document.getElementById('role-text');
  const roles = [
    'AUTOMOTIVE RADAR', 'DIGITAL TWIN', 'RADAR SIMULATION', 'GENERATIVE AI',
    'WORLD MODELS', 'ROBOTICS', 'AUTONOMOUS DRIVING', 'PERCEPTION',
    'SENSOR FUSION', 'RAY TRACING'
  ];
  let roleIndex = 0;
  if (roleText && !reduceMotion) {
    roleText.style.transition = 'opacity .22s ease, transform .22s ease';
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
    }, 2100);
  }

  // Timeline cards. Each image keeps the ratio the user prepared rather than being forced to 16:9.
  const timelineStyle = document.createElement('style');
  timelineStyle.textContent = `
    .experience-preview,.experience-photo-note{display:none!important}
    .timeline-row.timeline-visual{
      position:relative;isolation:isolate;overflow:hidden;
      border:1px solid rgba(255,255,255,.085);border-radius:6px;
      padding:26px 28px;min-height:0;aspect-ratio:var(--timeline-ratio,2.45/1);
      align-content:end;background:#151513;
      transition:border-color .38s ease,transform .42s cubic-bezier(.2,.8,.2,1),box-shadow .42s ease;
    }
    .timeline-row.timeline-visual::before{
      content:"";position:absolute;inset:0;z-index:-2;
      background-image:var(--timeline-photo,none);background-repeat:no-repeat;
      background-size:cover;background-position:center;
      opacity:0;transform:scale(1.018);
      filter:saturate(.92) contrast(1.01) brightness(.90);
      transition:opacity .42s ease,transform .85s cubic-bezier(.2,.8,.2,1),filter .42s ease;
    }
    .timeline-row.timeline-visual::after{
      content:"";position:absolute;inset:0;z-index:-1;
      background:linear-gradient(90deg,rgba(10,10,9,.78) 0%,rgba(10,10,9,.62) 38%,rgba(10,10,9,.30) 72%,rgba(10,10,9,.38) 100%),linear-gradient(0deg,rgba(10,10,9,.42),rgba(10,10,9,.03));
      opacity:0;transition:opacity .4s ease;
    }
    .timeline-row.timeline-visual:hover{
      transform:translateY(-3px);border-color:rgba(224,122,95,.34);
      box-shadow:0 20px 58px rgba(0,0,0,.25);
    }
    .timeline-row.timeline-visual:hover::before{opacity:1;transform:scale(1);filter:saturate(1.02) contrast(1.01) brightness(.96)}
    .timeline-row.timeline-visual:hover::after{opacity:.84}
    .timeline-row.timeline-visual>.timeline-period,.timeline-row.timeline-visual>div{position:relative;z-index:2}
    .timeline-row.timeline-visual .timeline-period{color:#aaa49c;transition:color .3s ease}
    .timeline-row.timeline-visual:hover .timeline-period{color:#e07a5f}
    .timeline-row.timeline-visual h4{font-size:clamp(20px,1.65vw,27px);color:#f2efe8;text-shadow:0 1px 16px rgba(0,0,0,.62)}
    .timeline-row.timeline-visual div>p{color:#d0cac2;text-shadow:0 1px 14px rgba(0,0,0,.62)}
    .timeline-row.timeline-visual .timeline-detail{color:#b1aaa3}
    @media(max-width:850px){
      .timeline-row.timeline-visual{aspect-ratio:auto;min-height:165px;padding:22px}
      .timeline-row.timeline-visual::before{opacity:.28;filter:saturate(.96) brightness(.88)}
      .timeline-row.timeline-visual::after{opacity:.58}
    }
  `;
  document.head.appendChild(timelineStyle);

  const expRows = [...document.querySelectorAll('.timeline-layout > .timeline-column:first-child .timeline-row')];
  const eduRows = [...document.querySelectorAll('.timeline-layout > .timeline-column:nth-child(2) .timeline-row')];

  // Confirmed mapping:
  // 1 PhD, 2 Research Intern, 3 Master Thesis, 4 Student RA, 5 M.Sc. FAU, 6 Bachelor.
  const visualItems = [
    { el: expRows[0], src: 'images/experience/1.png', ratio: '421/185' },
    { el: expRows[1], src: 'images/experience/3.png', ratio: '421/185' },
    { el: expRows[2], src: 'images/experience/2.png', ratio: '420/185' },
    { el: expRows[3], src: 'images/experience/4.png', ratio: '492/185' },
    { el: eduRows[0], src: 'images/experience/5.png', ratio: '462/185' },
    { el: eduRows[1], src: 'images/experience/6.png', ratio: '561/185' }
  ].filter(item => item.el);

  visualItems.forEach(item => {
    item.el.classList.add('timeline-visual');
    item.el.style.setProperty('--timeline-ratio', item.ratio);
    item.el.dataset.timelinePhoto = item.src;
  });

  // Load the six PNGs only when the timeline is approaching the viewport.
  const timelineImageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const src = el.dataset.timelinePhoto;
      if (src && !el.dataset.timelineLoaded) {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          el.style.setProperty('--timeline-photo', `url("${src}")`);
          el.dataset.timelineLoaded = 'true';
        };
        img.src = src;
      }
      timelineImageObserver.unobserve(el);
    });
  }, { rootMargin: '360px 0px' });
  visualItems.forEach(item => timelineImageObserver.observe(item.el));

  // Contact form (static GitHub Pages: opens a prefilled email client)
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  if (contactForm instanceof HTMLFormElement) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value.trim() || '';
      const email = document.getElementById('contact-email')?.value.trim() || '';
      const message = document.getElementById('contact-message')?.value.trim() || '';
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!name || !valid || message.length < 5) {
        if (formStatus) formStatus.textContent = 'Please enter your name, a valid email address, and a message.';
        return;
      }
      if (formStatus) formStatus.textContent = 'Opening your email app…';
      location.href = `mailto:wangzhaoze@outlook.com?subject=${encodeURIComponent(`Website message from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    });
  }

  // Lightweight radar/digital-twin hero canvas
  const canvas = document.getElementById('radar-canvas');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let w = 0, h = 0, dpr = 1, mx = 0, my = 0;
  const points = Array.from({ length: 82 }, (_, i) => ({
    x: ((i * 47) % 100) / 100,
    y: ((i * 83) % 100) / 100,
    depth: .28 + ((i * 29) % 70) / 100,
    phase: (i * .71) % (Math.PI * 2),
    speed: .22 + ((i * 17) % 55) / 100,
    accent: i % 7 === 0
  }));

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  window.addEventListener('pointermove', e => {
    mx = e.clientX / innerWidth - .5;
    my = e.clientY / innerHeight - .5;
  }, { passive: true });

  const draw = t => {
    ctx.clearRect(0, 0, w, h);
    const cx = w * (.66 + mx * .045);
    const cy = h * (.63 + my * .035);
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(235,232,225,.055)';
    for (let i = 0; i < 7; i++) {
      const y = h * .52 + i * h * .077;
      ctx.beginPath(); ctx.moveTo(w * .23, y); ctx.lineTo(w * 1.02, y + (i - 3) * 10); ctx.stroke();
    }
    for (let i = 0; i < 12; i++) {
      const x = w * .28 + i * w * .07;
      ctx.beginPath(); ctx.moveTo(x, h * .48); ctx.lineTo(cx + (x - cx) * 2, h * 1.04); ctx.stroke();
    }
    [.17, .29, .41].forEach((r, i) => {
      ctx.strokeStyle = `rgba(224,122,95,${.14 - i * .024})`;
      ctx.beginPath(); ctx.arc(cx, cy, Math.min(w, h) * r, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
    });
    if (!reduceMotion) {
      const pulse = ((t * .00013) % 1) * Math.min(w, h) * .55;
      ctx.strokeStyle = 'rgba(224,122,95,.16)';
      ctx.beginPath(); ctx.arc(cx, cy, pulse, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
    }
    points.forEach(p => {
      const drift = reduceMotion ? 0 : Math.sin(t * .00025 * p.speed + p.phase) * 9;
      const x = w * (.28 + p.x * .73) + mx * 24 * p.depth;
      const y = h * (.29 + p.y * .66) + drift + my * 14 * p.depth;
      const f = reduceMotion ? .45 : .24 + .5 * Math.max(0, Math.sin(t * .001 + p.phase));
      ctx.fillStyle = p.accent ? `rgba(224,122,95,${.35 + f * .45})` : `rgba(235,232,225,${.05 + f * p.depth * .18})`;
      ctx.beginPath(); ctx.arc(x, y, p.accent ? 1.7 : .8 + p.depth * .9, 0, Math.PI * 2); ctx.fill();
    });
    ctx.strokeStyle = 'rgba(241,238,231,.28)';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(cx - 22, cy + 8); ctx.lineTo(cx, cy - 20); ctx.lineTo(cx + 22, cy + 8); ctx.closePath(); ctx.stroke();
    ctx.restore();
    requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
})();
