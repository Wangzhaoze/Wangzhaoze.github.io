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
    requestAnimationFrame(() => document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('is-visible')));
  }

  // Global scroll progress + subtle hero drift
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
  let pointerX = innerWidth / 2, pointerY = innerHeight / 2, ringX = pointerX, ringY = pointerY;
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

  // Career timeline — unified Education + Experience, earliest -> present.
  const oldTimeline = document.querySelector('.timeline-layout');
  if (oldTimeline) {
    const careerItems = [
      {
        year: '2021 — 2024',
        shortYear: '2021',
        role: 'M.Sc. Mechatronics',
        place: 'Friedrich-Alexander-Universität Erlangen-Nürnberg',
        meta: 'Master · Mechatronics',
        text: 'Graduate studies in mechatronics with a growing focus on perception, robotics and intelligent sensing.',
        image: 'images/career/master.png'
      },
      {
        year: '2022 — 2023',
        shortYear: '2022',
        role: 'Student Research Assistant',
        place: 'Friedrich-Alexander-Universität Erlangen-Nürnberg',
        meta: 'Radar · Autonomous Driving',
        text: 'Research work at the Chair of High-Frequency Technology on automotive radar signal processing and perception.',
        image: 'images/career/research-assistant.png'
      },
      {
        year: '2023',
        shortYear: '2023',
        role: 'Research Intern',
        place: 'Bosch Center for Artificial Intelligence',
        meta: 'Computer Vision · Robotics',
        text: 'Learning-based perception and robotics research in an industrial AI environment.',
        image: 'images/career/internship.png'
      },
      {
        year: '2023 — 2024',
        shortYear: '2024',
        role: 'Master Thesis Student',
        place: 'Bosch Center for Artificial Intelligence',
        meta: '3D Scene Understanding · Robotics',
        text: 'Master thesis on dense visual descriptor learning for 3D scene understanding in mobile robotics.',
        image: 'images/career/master-thesis.png'
      },
      {
        year: '2024 — Present',
        shortYear: 'NOW',
        role: 'PhD Student',
        place: 'FORVIA HELLA',
        meta: 'Radar · Digital Twin · Generative AI',
        text: 'Research on automotive radar simulation, digital twins and generative AI for autonomous driving.',
        image: 'images/career/phd.png'
      }
    ];

    const style = document.createElement('style');
    style.textContent = `
      .experience-preview,.experience-photo-note{display:none!important}
      .career-story{position:relative;margin-top:clamp(40px,6vw,90px)}
      .career-heading{display:flex;justify-content:space-between;align-items:end;gap:24px;margin-bottom:clamp(42px,5vw,72px);padding-bottom:22px;border-bottom:1px solid rgba(255,255,255,.12)}
      .career-heading h3{margin:0;font-size:clamp(34px,4.5vw,68px);font-weight:520;letter-spacing:-.045em;color:#f2efe8}
      .career-heading p{margin:0;color:#746f68;text-transform:uppercase;letter-spacing:.13em;font-size:10px}
      .career-layout{display:grid;grid-template-columns:minmax(150px,12vw) minmax(0,1fr);gap:clamp(26px,4vw,70px);align-items:start}
      .career-rail{position:sticky;top:14vh;height:72vh;display:flex;flex-direction:column;justify-content:center;z-index:6}
      .career-line{position:absolute;left:12px;top:8%;bottom:8%;width:1px;background:rgba(255,255,255,.13);overflow:hidden}
      .career-line-fill{display:block;width:100%;height:0;background:#e07a5f;transition:height .55s cubic-bezier(.2,.8,.2,1)}
      .career-nav{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;justify-content:space-between;height:84%;position:relative;z-index:2}
      .career-nav-item{display:grid;grid-template-columns:25px 1fr;gap:14px;align-items:center;color:#6d6963;transition:color .45s ease,transform .45s ease}
      .career-dot{width:7px;height:7px;border-radius:50%;background:#5e5a54;border:1px solid rgba(255,255,255,.18);margin-left:9px;transition:transform .5s cubic-bezier(.2,.9,.2,1),background .35s ease,box-shadow .35s ease,border-color .35s ease}
      .career-nav-copy{display:flex;flex-direction:column;gap:3px;min-width:0}
      .career-nav-year{font-size:10px;letter-spacing:.12em;text-transform:uppercase}
      .career-nav-role{font-size:11px;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .career-nav-item.is-active{color:#f1eee7;transform:translateX(2px)}
      .career-nav-item.is-active .career-dot{transform:scale(2.15);background:#e07a5f;border-color:#e07a5f;box-shadow:0 0 0 5px rgba(224,122,95,.12),0 0 28px rgba(224,122,95,.34)}
      .career-scenes{display:flex;flex-direction:column;gap:clamp(48px,8vh,92px)}
      .career-scene{position:relative;min-height:78vh;display:flex;align-items:center;opacity:.44;transform:translateY(28px) scale(.985);transition:opacity .7s ease,transform .8s cubic-bezier(.2,.8,.2,1)}
      .career-scene.is-active{opacity:1;transform:translateY(0) scale(1)}
      .career-panel{position:relative;width:100%;height:min(68vh,690px);min-height:480px;overflow:hidden;border:1px solid rgba(255,255,255,.09);border-radius:8px;background:#11110f;box-shadow:0 30px 90px rgba(0,0,0,.20)}
      .career-image{position:absolute;inset:0 0 0 32%;z-index:0;background-position:center;background-size:cover;background-repeat:no-repeat;transform:scale(1.035);filter:saturate(.92) contrast(1.02) brightness(.94);transition:transform 1.25s cubic-bezier(.2,.8,.2,1),filter .7s ease}
      .career-scene.is-active .career-image{transform:scale(1);filter:saturate(1) contrast(1.01) brightness(1)}
      .career-panel::before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,#11110f 0%,#11110f 29%,rgba(17,17,15,.96) 38%,rgba(17,17,15,.78) 47%,rgba(17,17,15,.36) 59%,rgba(17,17,15,.08) 72%,rgba(17,17,15,.02) 100%)}
      .career-panel::after{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(0deg,rgba(8,8,7,.22),transparent 35%,rgba(8,8,7,.04));pointer-events:none}
      .career-copy{position:relative;z-index:2;width:min(44%,590px);height:100%;display:flex;flex-direction:column;justify-content:center;padding:clamp(34px,5vw,74px)}
      .career-kicker{margin:0 0 18px;color:#e07a5f;text-transform:uppercase;letter-spacing:.14em;font-size:10px}
      .career-role{margin:0;color:#f3f0e9;font-size:clamp(38px,5vw,76px);line-height:.94;letter-spacing:-.055em;font-weight:560}
      .career-place{margin:18px 0 0;color:#d2ccc4;font-size:clamp(16px,1.6vw,23px);line-height:1.25;letter-spacing:-.02em}
      .career-year{margin:14px 0 0;color:#8f8981;font-size:12px;letter-spacing:.10em;text-transform:uppercase}
      .career-description{margin:clamp(32px,5vh,54px) 0 0;max-width:470px;color:#aaa49c;font-size:14px;line-height:1.65}
      .career-index{position:absolute;left:clamp(34px,5vw,74px);bottom:32px;z-index:2;color:#5f5b55;font-size:10px;letter-spacing:.14em}
      @media(max-width:1050px){
        .career-layout{grid-template-columns:88px minmax(0,1fr);gap:18px}
        .career-nav-copy{display:none}.career-line{left:11px}.career-dot{margin-left:8px}
        .career-panel{height:min(64vh,620px)}
        .career-image{left:26%}.career-copy{width:54%;padding:36px}
      }
      @media(max-width:760px){
        .career-heading{align-items:flex-start;flex-direction:column}
        .career-layout{display:block}.career-rail{display:none}.career-scenes{gap:34px}
        .career-scene{min-height:auto;opacity:1;transform:none}
        .career-panel{height:auto;min-height:610px;display:flex;align-items:flex-end}
        .career-image{inset:0 0 38% 0;background-position:center;filter:saturate(.95) brightness(.86)}
        .career-panel::before{background:linear-gradient(0deg,#11110f 0%,#11110f 38%,rgba(17,17,15,.92) 48%,rgba(17,17,15,.36) 63%,rgba(17,17,15,.05) 78%)}
        .career-copy{width:100%;height:auto;min-height:300px;justify-content:flex-end;padding:28px 24px 58px}
        .career-role{font-size:clamp(34px,10vw,54px)}
        .career-description{margin-top:22px;font-size:13px}.career-index{left:24px;bottom:24px}
      }
      @media(prefers-reduced-motion:reduce){.career-scene,.career-image,.career-dot,.career-line-fill{transition:none!important}.career-scene{opacity:1;transform:none}}
    `;
    document.head.appendChild(style);

    const railItems = careerItems.map((item, i) => `
      <li class="career-nav-item${i === 0 ? ' is-active' : ''}" data-career-nav="${i}">
        <span class="career-dot"></span>
        <span class="career-nav-copy"><span class="career-nav-year">${item.shortYear}</span><span class="career-nav-role">${item.role}</span></span>
      </li>`).join('');

    const scenes = careerItems.map((item, i) => `
      <article class="career-scene${i === 0 ? ' is-active' : ''}" data-career-scene="${i}">
        <div class="career-panel">
          <div class="career-image" style="background-image:url('${item.image}')" aria-hidden="true"></div>
          <div class="career-copy">
            <p class="career-kicker">${item.meta}</p>
            <h4 class="career-role">${item.role}</h4>
            <p class="career-place">${item.place}</p>
            <p class="career-year">${item.year}</p>
            <p class="career-description">${item.text}</p>
          </div>
          <span class="career-index">0${i + 1} / 0${careerItems.length}</span>
        </div>
      </article>`).join('');

    const story = document.createElement('div');
    story.className = 'career-story reveal is-visible';
    story.innerHTML = `
      <div class="career-heading">
        <h3>Experience</h3>
        <p>Education · Research · Industry / 2021 — Present</p>
      </div>
      <div class="career-layout">
        <aside class="career-rail" aria-label="Career timeline">
          <span class="career-line"><span class="career-line-fill"></span></span>
          <ol class="career-nav">${railItems}</ol>
        </aside>
        <div class="career-scenes">${scenes}</div>
      </div>`;
    oldTimeline.replaceWith(story);

    const sceneEls = [...story.querySelectorAll('.career-scene')];
    const navEls = [...story.querySelectorAll('.career-nav-item')];
    const lineFill = story.querySelector('.career-line-fill');
    let activeCareer = 0;

    const setActiveCareer = index => {
      if (index === activeCareer && sceneEls[index]?.classList.contains('is-active')) return;
      activeCareer = index;
      sceneEls.forEach((el, i) => el.classList.toggle('is-active', i === index));
      navEls.forEach((el, i) => el.classList.toggle('is-active', i === index));
      if (lineFill) lineFill.style.height = `${(index / Math.max(1, careerItems.length - 1)) * 100}%`;
    };

    if (!reduceMotion && 'IntersectionObserver' in window) {
      const careerObserver = new IntersectionObserver(entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveCareer(Number(visible.target.dataset.careerScene));
      }, { threshold: [0.25, 0.4, 0.55, 0.7], rootMargin: '-18% 0px -28% 0px' });
      sceneEls.forEach(el => careerObserver.observe(el));
    } else {
      sceneEls.forEach(el => el.classList.add('is-active'));
    }
  }

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

  // Lightweight radar / digital-twin hero canvas
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
    const cx = w * (.66 + mx * .045), cy = h * (.63 + my * .035);
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
