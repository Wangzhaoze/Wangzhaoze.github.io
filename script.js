(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = [...document.querySelectorAll('.reveal')];
  if (reduceMotion) reveals.forEach(el => el.classList.add('is-visible'));
  else {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
    }), { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach(el => io.observe(el));
    requestAnimationFrame(() => document.querySelectorAll('.hero .reveal').forEach(el => el.classList.add('is-visible')));
  }

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
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  let pointerX = innerWidth / 2, pointerY = innerHeight / 2, ringX = pointerX, ringY = pointerY;
  if (cursorDot && cursorRing && finePointer && !reduceMotion) {
    document.body.classList.add('custom-cursor-active');
    const cursorLoop = () => {
      ringX += (pointerX - ringX) * .15; ringY += (pointerY - ringY) * .15;
      cursorDot.style.left = `${pointerX}px`; cursorDot.style.top = `${pointerY}px`;
      cursorRing.style.left = `${ringX}px`; cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(cursorLoop);
    };
    requestAnimationFrame(cursorLoop);
    addEventListener('pointermove', e => { pointerX = e.clientX; pointerY = e.clientY; cursorDot.style.opacity='1'; cursorRing.style.opacity='1'; }, { passive:true });
    document.addEventListener('mouseleave', () => { cursorDot.style.opacity='0'; cursorRing.style.opacity='0'; });
    document.addEventListener('mouseover', e => {
      const target = e.target instanceof Element ? e.target.closest('a,button,[data-cursor]') : null;
      if (!target) { cursorRing.classList.remove('is-hovering'); cursorRing.removeAttribute('data-text'); return; }
      cursorRing.classList.add('is-hovering');
      const type = target.getAttribute('data-cursor');
      if (type === 'view' || type === 'copy') cursorRing.setAttribute('data-text', type.toUpperCase()); else cursorRing.removeAttribute('data-text');
    });
  }

  const hero = document.querySelector('.hero');
  const spotlight = document.querySelector('.hero-spotlight');
  if (hero && spotlight && !reduceMotion) {
    hero.addEventListener('pointermove', e => { const r=hero.getBoundingClientRect(); spotlight.style.setProperty('--x',`${e.clientX-r.left}px`); spotlight.style.setProperty('--y',`${e.clientY-r.top}px`); spotlight.style.opacity='1'; }, { passive:true });
    hero.addEventListener('pointerleave', () => { spotlight.style.opacity='0'; });
  }

  const roleText = document.getElementById('role-text');
  const roles = ['AUTOMOTIVE RADAR','DIGITAL TWIN','RADAR SIMULATION','GENERATIVE AI','WORLD MODELS','ROBOTICS','AUTONOMOUS DRIVING','PERCEPTION','SENSOR FUSION','RAY TRACING'];
  let roleIndex=0;
  if (roleText && !reduceMotion) {
    setInterval(() => {
      roleText.style.opacity='0'; roleText.style.transform='translateY(-8px)';
      setTimeout(() => { roleIndex=(roleIndex+1)%roles.length; roleText.textContent=roles[roleIndex]; roleText.style.transform='translateY(8px)'; requestAnimationFrame(()=>{roleText.style.opacity='1';roleText.style.transform='translateY(0)';}); },220);
    },2100);
    roleText.style.transition='opacity .22s ease, transform .22s ease';
  }

  const preview = document.getElementById('experience-preview');
  const previewImg = preview?.querySelector('img');
  const expRows = [...document.querySelectorAll('.timeline-layout > .timeline-column:first-child .timeline-row')];
  const eduRows = [...document.querySelectorAll('.timeline-layout > .timeline-column:nth-child(2) .timeline-row')];
  const previewItems = [
    [expRows[0],'images/experience/phd.webp'],
    [expRows[1],'images/experience/master-thesis.webp'],
    [expRows[2],'images/experience/research-intern.webp'],
    [expRows[3],'images/experience/student-assistant.webp'],
    [eduRows[0],'images/experience/msc-fau.webp'],
    [eduRows[1],'images/experience/bachelor.webp']
  ].filter(([el])=>el);
  document.querySelector('.experience-photo-note')?.remove();
  previewItems.forEach(([el,src])=>{ el.setAttribute('data-photo',src); const img=new Image(); img.src=src; });
  if (preview && previewImg && finePointer && !reduceMotion) {
    let px=pointerX, py=pointerY;
    const movePreview=()=>{ px+=(pointerX-px)*.16; py+=(pointerY-py)*.16; const w=preview.getBoundingClientRect().width||340,h=preview.getBoundingClientRect().height||240; const x=Math.min(innerWidth-w-20,px+28),y=Math.min(innerHeight-h-20,py+28); preview.style.left=`${Math.max(20,x)}px`; preview.style.top=`${Math.max(20,y)}px`; requestAnimationFrame(movePreview); };
    requestAnimationFrame(movePreview);
    previewItems.forEach(([el,src])=>{
      el.addEventListener('mouseenter',()=>{ previewImg.src=src; previewImg.alt=`${el.querySelector('h4')?.textContent||'Timeline'} photo`; preview.classList.add('is-visible'); });
      el.addEventListener('mouseleave',()=>preview.classList.remove('is-visible'));
    });
  }

  const contactForm=document.getElementById('contact-form'); const formStatus=document.getElementById('form-status');
  if (contactForm instanceof HTMLFormElement) contactForm.addEventListener('submit',e=>{ e.preventDefault(); const name=document.getElementById('contact-name')?.value.trim()||'',email=document.getElementById('contact-email')?.value.trim()||'',message=document.getElementById('contact-message')?.value.trim()||'',valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); if(!name||!valid||message.length<5){if(formStatus)formStatus.textContent='Please enter your name, a valid email address, and a message.';return;} if(formStatus)formStatus.textContent='Opening your email app…'; location.href=`mailto:wangzhaoze@outlook.com?subject=${encodeURIComponent(`Website message from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`; });

  const canvas=document.getElementById('radar-canvas'); if(!(canvas instanceof HTMLCanvasElement))return; const ctx=canvas.getContext('2d'); if(!ctx)return;
  let w=0,h=0,dpr=1,mx=0,my=0;
  const points=Array.from({length:82},(_,i)=>({x:((i*47)%100)/100,y:((i*83)%100)/100,depth:.28+((i*29)%70)/100,phase:(i*.71)%(Math.PI*2),speed:.22+((i*17)%55)/100,accent:i%7===0}));
  const resize=()=>{const r=canvas.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);};
  addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;},{passive:true});
  const draw=t=>{ctx.clearRect(0,0,w,h);const cx=w*(.66+mx*.045),cy=h*(.63+my*.035);ctx.save();ctx.lineWidth=1;ctx.strokeStyle='rgba(235,232,225,.055)';for(let i=0;i<7;i++){const y=h*.52+i*h*.077;ctx.beginPath();ctx.moveTo(w*.23,y);ctx.lineTo(w*1.02,y+(i-3)*10);ctx.stroke();}for(let i=0;i<12;i++){const x=w*.28+i*w*.07;ctx.beginPath();ctx.moveTo(x,h*.48);ctx.lineTo(cx+(x-cx)*2,h*1.04);ctx.stroke();}[.17,.29,.41].forEach((r,i)=>{ctx.strokeStyle=`rgba(224,122,95,${.14-i*.024})`;ctx.beginPath();ctx.arc(cx,cy,Math.min(w,h)*r,Math.PI*1.08,Math.PI*1.92);ctx.stroke();});if(!reduceMotion){const pulse=((t*.00013)%1)*Math.min(w,h)*.55;ctx.strokeStyle='rgba(224,122,95,.16)';ctx.beginPath();ctx.arc(cx,cy,pulse,Math.PI*1.08,Math.PI*1.92);ctx.stroke();}points.forEach(p=>{const drift=reduceMotion?0:Math.sin(t*.00025*p.speed+p.phase)*9,x=w*(.28+p.x*.73)+mx*24*p.depth,y=h*(.29+p.y*.66)+drift+my*14*p.depth,f=reduceMotion?.45:.24+.5*Math.max(0,Math.sin(t*.001+p.phase));ctx.fillStyle=p.accent?`rgba(224,122,95,${.35+f*.45})`:`rgba(235,232,225,${.05+f*p.depth*.18})`;ctx.beginPath();ctx.arc(x,y,p.accent?1.7:.8+p.depth*.9,0,Math.PI*2);ctx.fill();});ctx.strokeStyle='rgba(241,238,231,.28)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(cx-22,cy+8);ctx.lineTo(cx,cy-20);ctx.lineTo(cx+22,cy+8);ctx.closePath();ctx.stroke();ctx.restore();requestAnimationFrame(draw);};
  resize();addEventListener('resize',resize);requestAnimationFrame(draw);
})();
