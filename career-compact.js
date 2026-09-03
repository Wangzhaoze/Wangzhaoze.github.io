(() => {
  const story = document.querySelector('.career-story');
  if (!story) return;

  const style = document.createElement('style');
  style.textContent = `
    .career-story{margin-top:clamp(30px,4vw,54px)}
    .career-heading{margin-bottom:22px;padding-bottom:16px}
    .career-heading h3{font-size:clamp(34px,4vw,58px)}
    .career-layout{grid-template-columns:minmax(190px,18vw) minmax(0,1fr);gap:clamp(20px,3vw,42px)}
    .career-rail{top:18vh;height:58vh}
    .career-line{left:12px;top:4%;bottom:4%}
    .career-nav{height:92%}
    .career-nav-copy{opacity:.22;transition:opacity .28s ease,transform .28s ease}
    .career-nav-year{display:none}
    .career-nav-role{font-size:clamp(16px,1.3vw,20px);line-height:1.1;white-space:nowrap;overflow:visible;text-overflow:clip;font-weight:520;letter-spacing:-.02em}
    .career-nav-item{color:#605c56}
    .career-nav-item.is-active{color:#f2eee7}
    .career-nav-item.is-active .career-nav-copy{opacity:1;transform:translateX(4px)}
    .career-scenes{gap:8px}
    .career-scene{min-height:34vh;opacity:.5;transform:none;border-top:1px solid rgba(255,255,255,.045);transition:opacity .35s ease}
    .career-scene:first-child{border-top:0}
    .career-scene.is-active{opacity:1}
    .career-panel{height:32vh;min-height:250px;border:0;border-radius:0;box-shadow:none;background:#10100e;overflow:hidden}
    .career-image{inset:0 0 0 40%;background-size:contain;background-position:right center;background-color:#10100e;transform:none;filter:saturate(.98) brightness(.98);opacity:0;transition:opacity .36s ease,filter .36s ease}
    .career-scene.is-active .career-image{opacity:1;transform:none;filter:saturate(1) brightness(1)}
    .career-panel::before{background:linear-gradient(90deg,#10100e 0%,#10100e 34%,rgba(16,16,14,.98) 40%,rgba(16,16,14,.78) 50%,rgba(16,16,14,.30) 61%,rgba(16,16,14,0) 74%)}
    .career-panel::after{background:none}
    .career-copy{width:42%;padding:clamp(22px,3vw,38px)}
    .career-kicker{margin-bottom:10px;font-size:10px;white-space:nowrap}
    .career-role{font-size:clamp(28px,3.4vw,52px);line-height:.98;white-space:nowrap}
    .career-place{margin-top:10px;font-size:clamp(14px,1.2vw,18px);line-height:1.2;white-space:nowrap;max-width:none}
    .career-year{display:inline;margin-left:8px}
    .career-description{display:none}
    .career-index{left:auto;right:14px;bottom:12px;font-size:9px}
    @media(max-width:1100px){
      .career-layout{grid-template-columns:150px minmax(0,1fr)}
      .career-nav-role{font-size:15px}
      .career-role{font-size:clamp(24px,3.1vw,40px)}
      .career-copy{width:48%}
      .career-image{left:46%}
    }
    @media(max-width:760px){
      .career-layout{display:block}.career-rail{display:none}
      .career-scenes{gap:10px}.career-scene{min-height:auto;opacity:1}
      .career-panel{height:auto;min-height:420px}
      .career-image{inset:0 0 44% 0;background-size:contain;background-position:center;opacity:1}
      .career-panel::before{background:linear-gradient(0deg,#10100e 0%,#10100e 43%,rgba(16,16,14,.88) 54%,rgba(16,16,14,.10) 72%,transparent 84%)}
      .career-copy{width:100%;padding:250px 22px 28px}
      .career-role{font-size:32px;white-space:normal}.career-place{white-space:normal;font-size:15px}.career-kicker{white-space:normal}
    }
  `;
  document.head.appendChild(style);

  const scenes = [...story.querySelectorAll('.career-scene')];
  const navItems = [...story.querySelectorAll('.career-nav-item')];
  const fill = story.querySelector('.career-line-fill');
  const setActive = index => {
    scenes.forEach((el,i)=>el.classList.toggle('is-active',i===index));
    navItems.forEach((el,i)=>el.classList.toggle('is-active',i===index));
    if (fill) fill.style.height = `${(index/Math.max(1,scenes.length-1))*100}%`;
  };
  scenes.forEach((scene,i)=>{
    scene.addEventListener('mouseenter',()=>setActive(i));
    scene.addEventListener('focusin',()=>setActive(i));
  });
})();
