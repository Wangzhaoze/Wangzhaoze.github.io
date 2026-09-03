(() => {
  const story = document.querySelector('.career-story');
  if (!story) return;

  const style = document.createElement('style');
  style.textContent = `
    /* About: one balanced, full-width row. Left = portrait/current role, right = intro. */
    @media (min-width: 981px) {
      .about-section{
        --about-row-h:clamp(360px,29vw,470px);
        display:grid!important;
        grid-template-columns:minmax(500px,39%) minmax(0,1fr)!important;
        column-gap:clamp(56px,5.5vw,104px)!important;
        align-items:stretch!important;
      }
      .about-section>.profile-panel{
        grid-column:1!important;
        grid-row:1!important;
        height:var(--about-row-h)!important;
        min-height:0!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        background:transparent!important;
        display:grid!important;
        grid-template-columns:minmax(220px,46%) minmax(0,1fr)!important;
        gap:clamp(28px,2.6vw,46px)!important;
        align-items:center!important;
      }
      .about-section>.profile-panel .profile-photo{
        width:100%!important;
        height:100%!important;
        max-height:none!important;
        aspect-ratio:auto!important;
        object-fit:cover!important;
        object-position:center!important;
        filter:grayscale(1) contrast(1.04) brightness(.9)!important;
      }
      .about-section>.profile-panel .profile-copy{
        min-width:0!important;
        padding:0!important;
      }
      .about-section>.profile-panel .profile-label{margin:0 0 14px!important}
      .about-section>.profile-panel .profile-copy h3{
        margin:0!important;
        max-width:12ch!important;
        font-size:clamp(27px,2.05vw,38px)!important;
        line-height:1.02!important;
        letter-spacing:-.04em!important;
      }
      .about-section>.profile-panel .profile-copy>p:last-child{
        margin:16px 0 0!important;
        max-width:28ch!important;
        color:#8f8982!important;
        font-size:12px!important;
        line-height:1.5!important;
      }
      .about-section>.about-lead{
        grid-column:2!important;
        grid-row:1!important;
        position:relative!important;
        height:var(--about-row-h)!important;
        min-height:0!important;
        width:100%!important;
        max-width:none!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        display:flex!important;
        flex-direction:column!important;
        justify-content:center!important;
      }
      .about-section>.about-lead .section-index{
        position:absolute!important;
        top:0!important;
        left:0!important;
        margin:0!important;
      }
      .about-section>.about-lead .about-statement{
        width:100%!important;
        max-width:none!important;
        margin:0!important;
        font-size:clamp(36px,3.55vw,58px)!important;
        line-height:1.02!important;
        letter-spacing:-.047em!important;
        text-wrap:balance!important;
      }
      .about-section>.career-story,
      .about-section>.timeline-layout{
        grid-column:1 / -1!important;
        grid-row:2!important;
        width:100%!important;
      }
    }

    @media (max-width:980px) {
      .about-section{display:block!important}
      .about-section>.profile-panel{margin-top:38px!important}
      .about-section>.about-lead .about-statement{max-width:none!important}
    }

    /* Career: every timeline node and its scene live in the SAME row. */
    .career-story{position:relative;margin-top:clamp(56px,7vw,104px)!important}
    .career-heading{
      display:flex!important;
      justify-content:space-between!important;
      align-items:end!important;
      gap:24px!important;
      margin-bottom:0!important;
      padding-bottom:22px!important;
      border-bottom:1px solid rgba(255,255,255,.10)!important;
    }
    .career-heading h3{
      margin:0!important;
      font-size:clamp(38px,4.4vw,68px)!important;
      font-weight:540!important;
      letter-spacing:-.048em!important;
    }
    .career-heading p{margin:0!important;color:#746f68!important;font-size:10px!important;letter-spacing:.13em!important;text-transform:uppercase!important}
    .career-layout{display:block!important}
    .career-rows{position:relative}
    .career-rows::before{
      content:"";
      position:absolute;
      left:11px;
      top:clamp(110px,15vh,150px);
      bottom:clamp(110px,15vh,150px);
      width:1px;
      background:rgba(255,255,255,.13);
      pointer-events:none;
    }
    .career-row{
      position:relative;
      display:grid;
      grid-template-columns:minmax(220px,20vw) minmax(0,1fr);
      gap:clamp(30px,4vw,72px);
      align-items:center;
      min-height:clamp(270px,34vh,380px);
      border-top:1px solid rgba(255,255,255,.045);
    }
    .career-row:first-child{border-top:0}
    .career-row-marker{
      position:relative;
      z-index:3;
      display:flex;
      align-items:center;
      gap:22px;
      min-width:0;
      transform:translateY(var(--career-marker-shift,0px));
      transition:transform .2s ease;
    }
    .career-row-dot{
      flex:0 0 auto;
      width:7px;
      height:7px;
      margin-left:8px;
      border-radius:50%;
      background:#625e58;
      border:1px solid rgba(255,255,255,.18);
      transition:transform .38s cubic-bezier(.2,.8,.2,1),background .3s,border-color .3s,box-shadow .3s;
    }
    .career-row-label{
      min-width:0;
      color:#f2eee7;
      font-size:clamp(17px,1.35vw,22px);
      font-weight:550;
      line-height:1.05;
      letter-spacing:-.025em;
      white-space:nowrap;
      opacity:0;
      transform:translateX(-8px);
      transition:opacity .3s ease,transform .35s ease;
    }
    .career-row.is-active .career-row-dot{
      transform:scale(2.1);
      background:#e07a5f;
      border-color:#e07a5f;
      box-shadow:0 0 0 6px rgba(224,122,95,.12),0 0 24px rgba(224,122,95,.3);
    }
    .career-row.is-active .career-row-label{opacity:1;transform:translateX(0)}

    .career-row .career-scene{
      width:100%!important;
      min-height:0!important;
      display:block!important;
      opacity:.22!important;
      transform:none!important;
      border:0!important;
      transition:opacity .36s ease!important;
    }
    .career-row.is-active .career-scene{opacity:1!important}
    .career-row .career-panel{
      position:relative!important;
      width:100%!important;
      height:clamp(240px,30vh,340px)!important;
      min-height:0!important;
      overflow:hidden!important;
      border:0!important;
      border-radius:0!important;
      background:transparent!important;
      box-shadow:none!important;
    }
    .career-row .career-image{
      position:absolute!important;
      inset:0 0 0 46%!important;
      z-index:0!important;
      background-size:contain!important;
      background-position:right center!important;
      background-repeat:no-repeat!important;
      background-color:transparent!important;
      opacity:0!important;
      transform:none!important;
      filter:saturate(.96) contrast(1.01) brightness(.98)!important;
      transition:opacity .38s ease,filter .38s ease!important;
    }
    .career-row.is-active .career-image{opacity:1!important;filter:saturate(1) contrast(1.01) brightness(1)!important}
    .career-row .career-panel::before{
      content:""!important;
      position:absolute!important;
      inset:0!important;
      z-index:1!important;
      background:linear-gradient(90deg,#10100e 0%,#10100e 38%,rgba(16,16,14,.98) 44%,rgba(16,16,14,.76) 52%,rgba(16,16,14,.28) 62%,rgba(16,16,14,0) 76%)!important;
      pointer-events:none!important;
    }
    .career-row .career-panel::after{display:none!important}
    .career-row .career-copy{
      position:relative!important;
      z-index:2!important;
      width:48%!important;
      height:100%!important;
      padding:clamp(20px,2.4vw,36px) 0!important;
      display:flex!important;
      flex-direction:column!important;
      justify-content:center!important;
      align-items:flex-start!important;
    }
    .career-row .career-role{
      order:1!important;
      margin:0!important;
      color:#f3f0e9!important;
      font-size:clamp(30px,3.2vw,50px)!important;
      line-height:.98!important;
      letter-spacing:-.05em!important;
      font-weight:560!important;
      white-space:nowrap!important;
    }
    .career-row .career-meta-line{
      order:2!important;
      display:flex!important;
      align-items:baseline!important;
      gap:10px!important;
      margin-top:12px!important;
      min-width:0!important;
      white-space:nowrap!important;
    }
    .career-row .career-place{
      margin:0!important;
      color:#c9c3bb!important;
      font-size:clamp(13px,1.05vw,17px)!important;
      line-height:1.2!important;
      letter-spacing:-.015em!important;
      white-space:nowrap!important;
    }
    .career-row .career-year{
      margin:0!important;
      color:#817b74!important;
      font-size:11px!important;
      line-height:1!important;
      letter-spacing:.08em!important;
      text-transform:uppercase!important;
      white-space:nowrap!important;
    }
    .career-row .career-year::before{content:"·  ";color:#605b55}
    .career-row .career-kicker{
      order:3!important;
      margin:13px 0 0!important;
      color:#e07a5f!important;
      font-size:10px!important;
      line-height:1.25!important;
      letter-spacing:.13em!important;
      text-transform:uppercase!important;
      white-space:nowrap!important;
    }
    .career-row .career-description{display:none!important}
    .career-row .career-index{
      position:absolute!important;
      right:8px!important;
      bottom:10px!important;
      left:auto!important;
      z-index:2!important;
      color:#55514c!important;
      font-size:9px!important;
      letter-spacing:.14em!important;
    }

    @media(max-width:1150px){
      .career-row{grid-template-columns:180px minmax(0,1fr);gap:28px}
      .career-row-label{font-size:16px}
      .career-row .career-role{font-size:clamp(27px,3vw,40px)}
      .career-row .career-copy{width:52%!important}
      .career-row .career-image{left:50%!important}
    }
    @media(max-width:780px){
      .career-heading{align-items:flex-start!important;flex-direction:column!important}
      .career-rows::before{display:none}
      .career-row{display:block;min-height:auto;padding:26px 0}
      .career-row-marker{display:none}
      .career-row .career-scene{opacity:1!important}
      .career-row .career-panel{height:auto!important;min-height:430px!important}
      .career-row .career-image{inset:0 0 45% 0!important;background-position:center!important;opacity:1!important}
      .career-row .career-panel::before{background:linear-gradient(0deg,#10100e 0%,#10100e 43%,rgba(16,16,14,.88) 54%,rgba(16,16,14,.1) 72%,transparent 84%)!important}
      .career-row .career-copy{width:100%!important;height:auto!important;min-height:220px!important;padding:245px 0 24px!important}
      .career-row .career-role{font-size:32px!important;white-space:normal!important}
      .career-row .career-meta-line{white-space:normal!important;flex-wrap:wrap!important}
      .career-row .career-place{white-space:normal!important}
      .career-row .career-kicker{white-space:normal!important}
    }
  `;
  document.head.appendChild(style);

  const layout = story.querySelector('.career-layout');
  const rail = story.querySelector('.career-rail');
  const scenesWrap = story.querySelector('.career-scenes');
  if (!layout || !rail || !scenesWrap) return;

  const scenes = [...scenesWrap.querySelectorAll('.career-scene')];
  const oldNavItems = [...rail.querySelectorAll('.career-nav-item')];
  const labels = scenes.map((scene, i) =>
    oldNavItems[i]?.querySelector('.career-nav-role')?.textContent?.trim() ||
    scene.querySelector('.career-role')?.textContent?.trim() || ''
  );

  const rows = document.createElement('div');
  rows.className = 'career-rows';
  const rowEls = [];

  scenes.forEach((scene, i) => {
    const copy = scene.querySelector('.career-copy');
    const role = scene.querySelector('.career-role');
    const place = scene.querySelector('.career-place');
    const year = scene.querySelector('.career-year');
    const kicker = scene.querySelector('.career-kicker');

    if (copy && role && place && year && kicker) {
      let metaLine = copy.querySelector('.career-meta-line');
      if (!metaLine) {
        metaLine = document.createElement('div');
        metaLine.className = 'career-meta-line';
        metaLine.append(place, year);
        copy.insertBefore(metaLine, kicker);
      }
    }

    const row = document.createElement('div');
    row.className = `career-row${scene.classList.contains('is-active') ? ' is-active' : ''}`;
    row.dataset.careerRow = String(i);

    const marker = document.createElement('div');
    marker.className = 'career-row-marker';
    const dot = document.createElement('span');
    dot.className = 'career-row-dot';
    const label = document.createElement('span');
    label.className = 'career-row-label';
    label.textContent = labels[i];
    marker.append(dot, label);

    row.append(marker, scene);
    rows.appendChild(row);
    rowEls.push(row);
  });

  layout.replaceChildren(rows);

  const syncMarkerPositions = () => {
    rowEls.forEach((row, i) => {
      const role = scenes[i]?.querySelector('.career-role');
      const marker = row.querySelector('.career-row-marker');
      if (!role || !marker || window.innerWidth <= 780) return;
      const rr = row.getBoundingClientRect();
      const tr = role.getBoundingClientRect();
      const shift = (tr.top + tr.height / 2) - (rr.top + rr.height / 2);
      row.style.setProperty('--career-marker-shift', `${shift}px`);
    });
  };

  const syncRowsFromScenes = () => {
    const activeIndex = Math.max(0, scenes.findIndex(scene => scene.classList.contains('is-active')));
    rowEls.forEach((row, i) => row.classList.toggle('is-active', i === activeIndex));
    requestAnimationFrame(syncMarkerPositions);
  };

  const setActive = index => {
    scenes.forEach((scene, i) => scene.classList.toggle('is-active', i === index));
    rowEls.forEach((row, i) => row.classList.toggle('is-active', i === index));
    requestAnimationFrame(syncMarkerPositions);
  };

  const classObserver = new MutationObserver(syncRowsFromScenes);
  scenes.forEach(scene => classObserver.observe(scene, { attributes:true, attributeFilter:['class'] }));

  if (window.matchMedia('(pointer:fine)').matches) {
    rowEls.forEach((row, i) => row.addEventListener('mouseenter', () => setActive(i)));
  }

  requestAnimationFrame(() => requestAnimationFrame(syncMarkerPositions));
  window.addEventListener('resize', () => requestAnimationFrame(syncMarkerPositions), { passive:true });
  if (document.fonts?.ready) document.fonts.ready.then(syncMarkerPositions);
})();
