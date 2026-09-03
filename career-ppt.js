(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const oldStory = document.querySelector('.career-story');
  if (!oldStory) return;

  const items = [
    {
      year: '2021 — 2024', shortYear: '2021', role: 'M.Sc. Mechatronics',
      place: 'Friedrich-Alexander-Universität Erlangen-Nürnberg',
      meta: 'ROBOTICS · MECHATRONICS',
      text: 'Graduate studies in mechatronics with a growing focus on robotics, perception and intelligent sensing.',
      image: 'images/career/master.png'
    },
    {
      year: '2022 — 2023', shortYear: '2022', role: 'Student Research Assistant',
      place: 'Friedrich-Alexander-Universität Erlangen-Nürnberg',
      meta: 'AUTOMOTIVE RADAR · RESEARCH',
      text: 'Research work on automotive radar signal processing, perception and autonomous-driving related sensing.',
      image: 'images/career/research-assistant.png'
    },
    {
      year: '2023', shortYear: '2023', role: 'Research Intern',
      place: 'Bosch Center for Artificial Intelligence',
      meta: 'COMPUTER VISION · ROBOTICS',
      text: 'Learning-based perception and robotics research in an industrial AI environment.',
      image: 'images/career/internship.png'
    },
    {
      year: '2023 — 2024', shortYear: '2024', role: 'Master Thesis Student',
      place: 'Bosch Center for Artificial Intelligence',
      meta: '3D SCENE UNDERSTANDING · ROBOTICS',
      text: 'Master thesis on dense visual descriptor learning for 3D scene understanding in mobile robotics.',
      image: 'images/career/master-thesis.png'
    },
    {
      year: '2024 — Present', shortYear: 'NOW', role: 'PhD Student',
      place: 'FORVIA HELLA',
      meta: 'RADAR · DIGITAL TWIN · GENERATIVE AI',
      text: 'Research on automotive radar simulation, digital twins and generative AI for autonomous driving.',
      image: 'images/career/phd.png'
    }
  ];

  const style = document.createElement('style');
  style.textContent = `
    .career-ppt{position:relative;width:100vw;height:100svh;margin-left:calc(50% - 50vw);background:#0b0b0a;color:#f2efe8;border-top:1px solid rgba(255,255,255,.055);border-bottom:1px solid rgba(255,255,255,.055);overflow:hidden;isolation:isolate}
    .career-ppt__stage{position:relative;height:100%;display:grid;grid-template-columns:clamp(118px,14vw,190px) minmax(0,1fr)}
    .career-ppt__rail{position:relative;height:100%;padding:9vh 0 9vh max(18px,2.1vw);display:flex;align-items:center}
    .career-ppt__line{position:absolute;left:max(23px,2.55vw);top:10vh;bottom:10vh;width:1px;background:rgba(255,255,255,.13)}
    .career-ppt__fill{display:block;width:100%;height:0;background:#e07a5f;transition:height .36s cubic-bezier(.2,.8,.2,1)}
    .career-ppt__nav{position:relative;z-index:2;width:100%;height:80vh;display:flex;flex-direction:column;justify-content:space-between;margin:0;padding:0;list-style:none}
    .career-ppt__nav-item{position:relative;height:26px;display:flex;align-items:center;color:#65615b;transition:color .28s ease}
    .career-ppt__dot{position:absolute;left:0;width:7px;height:7px;border-radius:50%;background:#66615b;border:1px solid rgba(255,255,255,.14);transition:transform .34s cubic-bezier(.2,.9,.2,1),background .28s ease,box-shadow .28s ease,border-color .28s ease}
    .career-ppt__nav-copy{position:absolute;left:28px;top:50%;transform:translateY(-50%) translateX(-8px);opacity:0;min-width:120px;transition:opacity .24s ease,transform .3s cubic-bezier(.2,.8,.2,1);pointer-events:none}
    .career-ppt__nav-year{display:block;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#9a948c}
    .career-ppt__nav-role{display:block;margin-top:4px;font-size:11px;line-height:1.15;color:#f2eee7}
    .career-ppt__nav-item.is-active .career-ppt__dot{transform:scale(2.25);background:#e07a5f;border-color:#e07a5f;box-shadow:0 0 0 5px rgba(224,122,95,.12),0 0 26px rgba(224,122,95,.32)}
    .career-ppt__nav-item.is-active .career-ppt__nav-copy{opacity:1;transform:translateY(-50%) translateX(0)}
    .career-ppt__viewport{position:relative;height:100%;min-width:0;overflow:hidden}
    .career-ppt__panel{position:absolute;inset:0;opacity:0;pointer-events:none;transition:opacity .34s ease;will-change:opacity}
    .career-ppt__panel.is-active{opacity:1;pointer-events:auto}
    .career-ppt__image{position:absolute;z-index:0;top:0;right:0;bottom:0;width:64%;background-position:center;background-size:cover;background-repeat:no-repeat;transform:scale(1.025);filter:saturate(.98) contrast(1.01) brightness(.98);transition:transform .55s cubic-bezier(.2,.8,.2,1),filter .42s ease}
    .career-ppt__panel.is-active .career-ppt__image{transform:scale(1);filter:saturate(1) contrast(1.01) brightness(1)}
    .career-ppt__veil{position:absolute;z-index:1;inset:0;background:linear-gradient(90deg,#0b0b0a 0%,#0b0b0a 31%,rgba(11,11,10,.98) 38%,rgba(11,11,10,.84) 47%,rgba(11,11,10,.54) 56%,rgba(11,11,10,.18) 68%,rgba(11,11,10,.02) 78%)}
    .career-ppt__content{position:relative;z-index:2;width:min(43%,650px);height:100%;display:flex;flex-direction:column;justify-content:center;padding:8vh 2.8vw 8vh 1.2vw;transform:translateY(10px);opacity:0;transition:opacity .3s ease .04s,transform .34s cubic-bezier(.2,.8,.2,1) .04s}
    .career-ppt__panel.is-active .career-ppt__content{opacity:1;transform:translateY(0)}
    .career-ppt__meta{margin:0 0 20px;color:#e07a5f;font-size:10px;letter-spacing:.15em;text-transform:uppercase}
    .career-ppt__role{margin:0;color:#f4f1ea;font-size:clamp(46px,6vw,92px);font-weight:560;letter-spacing:-.06em;line-height:.91}
    .career-ppt__place{margin:24px 0 0;color:#d5cfc7;font-size:clamp(18px,1.8vw,28px);line-height:1.2;letter-spacing:-.025em;max-width:18ch}
    .career-ppt__year{margin:13px 0 0;color:#8f8982;font-size:11px;letter-spacing:.12em;text-transform:uppercase}
    .career-ppt__desc{margin:clamp(30px,5vh,52px) 0 0;max-width:38ch;color:#aaa49c;font-size:14px;line-height:1.7}
    .career-ppt__index{position:absolute;z-index:3;left:1.2vw;bottom:4.5vh;color:#69645e;font-size:10px;letter-spacing:.14em}
    .career-ppt__hint{position:absolute;z-index:4;right:2vw;bottom:3.2vh;color:#6f6a64;font-size:9px;letter-spacing:.14em;text-transform:uppercase;opacity:.8}
    .career-ppt__flash{position:absolute;z-index:5;left:0;right:0;top:0;height:1px;background:rgba(255,255,255,.07);opacity:.9}
    .career-ppt.is-switching .career-ppt__flash{animation:careerFlash .34s ease}
    @keyframes careerFlash{0%{opacity:.12}50%{opacity:.5}100%{opacity:.12}}
    body.career-ppt-locked{overscroll-behavior:none}
    @media(max-width:980px){
      .career-ppt__stage{grid-template-columns:92px minmax(0,1fr)}
      .career-ppt__nav-copy{display:none}
      .career-ppt__image{width:70%}
      .career-ppt__content{width:52%;padding-left:0}
    }
    @media(max-width:760px){
      .career-ppt{height:auto;min-height:100svh}
      .career-ppt__stage{display:block}
      .career-ppt__rail{position:absolute;z-index:4;left:12px;top:0;width:34px;padding:12vh 0;height:100%;pointer-events:none}
      .career-ppt__line{left:12px;top:14vh;bottom:14vh}.career-ppt__nav{height:72vh}.career-ppt__dot{left:9px}.career-ppt__viewport{height:100svh}
      .career-ppt__image{width:100%;height:55%;top:0;bottom:auto;filter:brightness(.82)}
      .career-ppt__veil{background:linear-gradient(0deg,#0b0b0a 0%,#0b0b0a 40%,rgba(11,11,10,.94) 50%,rgba(11,11,10,.26) 69%,rgba(11,11,10,.03) 82%)}
      .career-ppt__content{width:100%;padding:48vh 28px 9vh 58px;justify-content:flex-end}
      .career-ppt__role{font-size:clamp(38px,11vw,58px)}.career-ppt__place{font-size:18px;max-width:none}.career-ppt__desc{font-size:13px;margin-top:20px}
      .career-ppt__index{left:58px;bottom:3vh}.career-ppt__hint{display:none}
    }
    @media(prefers-reduced-motion:reduce){.career-ppt__panel,.career-ppt__content,.career-ppt__image,.career-ppt__dot,.career-ppt__fill{transition:none!important}}
  `;
  document.head.appendChild(style);

  const nav = items.map((item, i) => `
    <li class="career-ppt__nav-item${i === 0 ? ' is-active' : ''}" data-career-index="${i}">
      <span class="career-ppt__dot"></span>
      <span class="career-ppt__nav-copy"><span class="career-ppt__nav-year">${item.shortYear}</span><span class="career-ppt__nav-role">${item.role}</span></span>
    </li>`).join('');

  const panels = items.map((item, i) => `
    <article class="career-ppt__panel${i === 0 ? ' is-active' : ''}" data-career-panel="${i}" aria-hidden="${i === 0 ? 'false' : 'true'}">
      <div class="career-ppt__image" style="background-image:url('${item.image}')" aria-hidden="true"></div>
      <div class="career-ppt__veil" aria-hidden="true"></div>
      <div class="career-ppt__content">
        <p class="career-ppt__meta">${item.meta}</p>
        <h3 class="career-ppt__role">${item.role}</h3>
        <p class="career-ppt__place">${item.place}</p>
        <p class="career-ppt__year">${item.year}</p>
        <p class="career-ppt__desc">${item.text}</p>
      </div>
      <span class="career-ppt__index">0${i + 1} / 0${items.length}</span>
    </article>`).join('');

  const ppt = document.createElement('div');
  ppt.className = 'career-ppt';
  ppt.id = 'career';
  ppt.innerHTML = `
    <div class="career-ppt__stage">
      <aside class="career-ppt__rail" aria-label="Career timeline">
        <span class="career-ppt__line"><span class="career-ppt__fill"></span></span>
        <ol class="career-ppt__nav">${nav}</ol>
      </aside>
      <div class="career-ppt__viewport">
        <span class="career-ppt__flash" aria-hidden="true"></span>
        ${panels}
        <span class="career-ppt__hint">Scroll / swipe to switch</span>
      </div>
    </div>`;
  oldStory.replaceWith(ppt);

  const navItems = [...ppt.querySelectorAll('.career-ppt__nav-item')];
  const panelItems = [...ppt.querySelectorAll('.career-ppt__panel')];
  const fill = ppt.querySelector('.career-ppt__fill');
  let active = 0;
  let locked = false;
  let wheelSum = 0;
  let snapTimer = 0;

  const activate = (index, direction = 1) => {
    const next = Math.max(0, Math.min(items.length - 1, index));
    if (next === active) return false;
    active = next;
    ppt.dataset.direction = direction > 0 ? 'down' : 'up';
    navItems.forEach((el, i) => el.classList.toggle('is-active', i === active));
    panelItems.forEach((el, i) => {
      const on = i === active;
      el.classList.toggle('is-active', on);
      el.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    if (fill) fill.style.height = `${(active / (items.length - 1)) * 100}%`;
    ppt.classList.remove('is-switching');
    void ppt.offsetWidth;
    ppt.classList.add('is-switching');
    return true;
  };

  navItems.forEach((el, i) => el.addEventListener('click', () => activate(i, i > active ? 1 : -1)));

  const centered = () => {
    const r = ppt.getBoundingClientRect();
    return Math.abs(r.top) < Math.min(90, innerHeight * .12) && r.bottom > innerHeight * .82;
  };

  const snapIn = () => {
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => {
      const r = ppt.getBoundingClientRect();
      if (r.top < innerHeight * .28 && r.bottom > innerHeight * .72 && Math.abs(r.top) > 4) {
        ppt.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    }, 70);
  };

  window.addEventListener('scroll', snapIn, { passive: true });

  window.addEventListener('wheel', e => {
    if (innerWidth <= 760) return;
    if (!centered()) return;

    const down = e.deltaY > 0;
    const atFirst = active === 0;
    const atLast = active === items.length - 1;
    if ((down && atLast) || (!down && atFirst)) {
      wheelSum = 0;
      document.body.classList.remove('career-ppt-locked');
      return;
    }

    e.preventDefault();
    document.body.classList.add('career-ppt-locked');
    if (locked) return;

    wheelSum += e.deltaY;
    if (Math.abs(wheelSum) < 14) return;

    const direction = wheelSum > 0 ? 1 : -1;
    wheelSum = 0;
    if (activate(active + direction, direction)) {
      locked = true;
      setTimeout(() => { locked = false; }, 390);
    }
  }, { passive: false });

  let touchY = 0;
  ppt.addEventListener('touchstart', e => { touchY = e.touches[0]?.clientY || 0; }, { passive: true });
  ppt.addEventListener('touchend', e => {
    const end = e.changedTouches[0]?.clientY || touchY;
    const delta = touchY - end;
    if (Math.abs(delta) > 32) activate(active + (delta > 0 ? 1 : -1), delta > 0 ? 1 : -1);
  }, { passive: true });

  window.addEventListener('keydown', e => {
    if (!centered()) return;
    if (['ArrowDown', 'PageDown'].includes(e.key) && active < items.length - 1) { e.preventDefault(); activate(active + 1, 1); }
    if (['ArrowUp', 'PageUp'].includes(e.key) && active > 0) { e.preventDefault(); activate(active - 1, -1); }
  });
})();
