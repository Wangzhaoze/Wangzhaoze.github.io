(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const oldStory = document.querySelector('.career-story');
  if (!oldStory) return;

  const items = [
    { year:'2021 — 2024', role:'M.Sc. Mechatronics', place:'FAU Erlangen-Nürnberg', meta:'ROBOTICS · MECHATRONICS', image:'images/career/master.png' },
    { year:'2022 — 2023', role:'Student Research Assistant', place:'FAU Erlangen-Nürnberg', meta:'AUTOMOTIVE RADAR · RESEARCH', image:'images/career/research-assistant.png' },
    { year:'2023', role:'Research Intern', place:'Bosch Center for Artificial Intelligence', meta:'COMPUTER VISION · ROBOTICS', image:'images/career/internship.png' },
    { year:'2023 — 2024', role:'Master Thesis Student', place:'Bosch Center for Artificial Intelligence', meta:'3D SCENE UNDERSTANDING · ROBOTICS', image:'images/career/master-thesis.png' },
    { year:'2024 — PRESENT', role:'PhD Student', place:'FORVIA HELLA', meta:'RADAR · DIGITAL TWIN · GENERATIVE AI', image:'images/career/phd.png' }
  ];

  const style = document.createElement('style');
  style.textContent = `
    .career-ppt{position:relative;width:100vw;margin-left:calc(50% - 50vw);min-height:148vh;background:#0b0b0a;color:#f2efe8;border-top:1px solid rgba(255,255,255,.055);border-bottom:1px solid rgba(255,255,255,.055)}
    .career-ppt__sticky{position:sticky;top:7vh;height:86vh;display:flex;align-items:center;overflow:hidden}
    .career-ppt__stage{width:100%;height:min(72vh,720px);display:grid;grid-template-columns:minmax(430px,39vw) minmax(0,1fr);padding:0 max(4vw,34px);gap:clamp(30px,4vw,72px)}
    .career-ppt__rail{position:relative;height:100%;display:flex;align-items:center;min-width:0}
    .career-ppt__line{position:absolute;left:5px;top:4%;bottom:4%;width:1px;background:rgba(255,255,255,.11)}
    .career-ppt__fill{display:block;width:100%;height:0;background:#e07a5f;transition:height .42s cubic-bezier(.2,.8,.2,1)}
    .career-ppt__nav{width:100%;margin:0;padding:0 0 0 31px;list-style:none;display:flex;flex-direction:column;justify-content:center}
    .career-ppt__nav-item{position:relative;padding:16px 0 17px;border-top:1px solid rgba(255,255,255,.055);cursor:pointer;opacity:.34;transition:opacity .34s ease,padding .36s cubic-bezier(.2,.8,.2,1)}
    .career-ppt__nav-item:last-child{border-bottom:1px solid rgba(255,255,255,.055)}
    .career-ppt__nav-item::before{content:"";position:absolute;left:-30px;top:28px;width:9px;height:9px;border-radius:50%;background:#625e58;border:1px solid rgba(255,255,255,.15);transform:translate(-50%,-50%);transition:width .32s ease,height .32s ease,background .3s ease,box-shadow .3s ease,border-color .3s ease}
    .career-ppt__nav-item.is-active{opacity:1;padding-top:21px;padding-bottom:21px}
    .career-ppt__nav-item.is-active::before{width:18px;height:18px;background:#e07a5f;border-color:#e07a5f;box-shadow:0 0 0 5px rgba(224,122,95,.11),0 0 28px rgba(224,122,95,.26)}
    .career-ppt__role{margin:0;white-space:nowrap;font-size:clamp(24px,2.35vw,42px);font-weight:560;letter-spacing:-.045em;line-height:1.02;color:#f3f0e9}
    .career-ppt__placeyear{margin:9px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#9b958e;font-size:clamp(11px,.95vw,14px)}
    .career-ppt__meta{margin:8px 0 0;white-space:nowrap;color:#e07a5f;font-size:10px;letter-spacing:.13em;text-transform:uppercase}
    .career-ppt__nav-item:not(.is-active) .career-ppt__placeyear,.career-ppt__nav-item:not(.is-active) .career-ppt__meta{opacity:.56}
    .career-ppt__viewport{position:relative;height:100%;min-width:0;overflow:hidden;background:#0d0d0c}
    .career-ppt__panel{position:absolute;inset:0;opacity:0;pointer-events:none;transition:opacity .4s ease;display:grid;place-items:center}
    .career-ppt__panel.is-active{opacity:1;pointer-events:auto}
    .career-ppt__image-wrap{position:absolute;inset:0;overflow:hidden;background:#0b0b0a;display:flex;align-items:center;justify-content:flex-end}
    .career-ppt__image{display:block;width:100%;height:100%;object-fit:contain;object-position:center right;transform:scale(1.008);filter:saturate(.98) contrast(1.01) brightness(1);transition:transform .65s cubic-bezier(.2,.8,.2,1),opacity .38s ease}
    .career-ppt__panel.is-active .career-ppt__image{transform:scale(1)}
    .career-ppt__veil{position:absolute;z-index:2;inset:0;pointer-events:none;background:linear-gradient(90deg,#0b0b0a 0%,rgba(11,11,10,.96) 5%,rgba(11,11,10,.55) 14%,rgba(11,11,10,.15) 24%,rgba(11,11,10,0) 36%)}
    .career-ppt__counter{position:absolute;z-index:3;left:20px;bottom:16px;color:rgba(255,255,255,.42);font-size:9px;letter-spacing:.14em;text-transform:uppercase}
    .career-ppt__hint{position:absolute;z-index:3;right:18px;bottom:16px;color:rgba(255,255,255,.34);font-size:9px;letter-spacing:.13em;text-transform:uppercase}
    @media(max-width:1120px){.career-ppt__stage{grid-template-columns:minmax(350px,43vw) minmax(0,1fr);gap:28px;padding:0 28px}.career-ppt__role{font-size:clamp(22px,2.5vw,34px)}}
    @media(max-width:820px){.career-ppt{min-height:auto;padding:72px 0}.career-ppt__sticky{position:relative;top:auto;height:auto;overflow:visible}.career-ppt__stage{height:auto;display:flex;flex-direction:column;padding:0 20px;gap:26px}.career-ppt__rail{height:auto}.career-ppt__nav{padding-left:25px}.career-ppt__line{left:4px}.career-ppt__nav-item{padding:13px 0 14px}.career-ppt__nav-item.is-active{padding:16px 0}.career-ppt__nav-item::before{left:-24px;top:24px}.career-ppt__role{font-size:clamp(22px,7vw,32px)}.career-ppt__placeyear{white-space:normal}.career-ppt__meta{white-space:normal;line-height:1.4}.career-ppt__viewport{height:min(48vh,390px)}.career-ppt__image{object-position:center}.career-ppt__veil{background:linear-gradient(90deg,rgba(11,11,10,.35),transparent 28%)}.career-ppt__hint{display:none}}
    @media(prefers-reduced-motion:reduce){.career-ppt__panel,.career-ppt__image,.career-ppt__nav-item,.career-ppt__nav-item::before,.career-ppt__fill{transition:none!important}}
  `;
  document.head.appendChild(style);

  const nav = items.map((item,i)=>`<li class="career-ppt__nav-item${i===0?' is-active':''}" data-career-index="${i}" tabindex="0"><h3 class="career-ppt__role">${item.role}</h3><p class="career-ppt__placeyear">${item.place} · ${item.year}</p><p class="career-ppt__meta">${item.meta}</p></li>`).join('');
  const panels = items.map((item,i)=>`<article class="career-ppt__panel${i===0?' is-active':''}" data-career-panel="${i}" aria-hidden="${i===0?'false':'true'}"><div class="career-ppt__image-wrap"><img class="career-ppt__image" src="${item.image}" alt="${item.role} — ${item.place}" loading="lazy" decoding="async" /></div><div class="career-ppt__veil" aria-hidden="true"></div><span class="career-ppt__counter">0${i+1} / 0${items.length}</span></article>`).join('');

  const showcase=document.createElement('div');
  showcase.className='career-ppt';showcase.id='career';
  showcase.innerHTML=`<div class="career-ppt__sticky"><div class="career-ppt__stage"><aside class="career-ppt__rail" aria-label="Career timeline"><span class="career-ppt__line"><span class="career-ppt__fill"></span></span><ol class="career-ppt__nav">${nav}</ol></aside><div class="career-ppt__viewport">${panels}<span class="career-ppt__hint">Scroll or hover to explore</span></div></div></div>`;
  oldStory.replaceWith(showcase);

  const navItems=[...showcase.querySelectorAll('.career-ppt__nav-item')];
  const panelItems=[...showcase.querySelectorAll('.career-ppt__panel')];
  const fill=showcase.querySelector('.career-ppt__fill');
  let active=0, hoverLockUntil=0;
  const activate=index=>{const next=Math.max(0,Math.min(items.length-1,index));if(next===active)return;active=next;navItems.forEach((el,i)=>el.classList.toggle('is-active',i===active));panelItems.forEach((el,i)=>{const on=i===active;el.classList.toggle('is-active',on);el.setAttribute('aria-hidden',on?'false':'true')});if(fill)fill.style.height=`${(active/Math.max(1,items.length-1))*100}%`};
  navItems.forEach((el,i)=>{el.addEventListener('mouseenter',()=>{hoverLockUntil=performance.now()+900;activate(i)});el.addEventListener('focus',()=>activate(i));el.addEventListener('click',()=>activate(i));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate(i)}})});
  const updateFromScroll=()=>{if(innerWidth<=820||performance.now()<hoverLockUntil)return;const rect=showcase.getBoundingClientRect();const scrollable=Math.max(1,showcase.offsetHeight-innerHeight);const travelled=Math.max(0,Math.min(scrollable,-rect.top+innerHeight*.10));activate(Math.round((travelled/scrollable)*(items.length-1)))};
  window.addEventListener('scroll',updateFromScroll,{passive:true});window.addEventListener('resize',updateFromScroll,{passive:true});updateFromScroll();
})();