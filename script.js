(() => {
  const load = (src, done) => {
    const s = document.createElement('script');
    s.src = src;
    s.defer = true;
    if (done) s.onload = done;
    document.head.appendChild(s);
  };
  load('script-base.js', () => load('career-compact.js'));
})();
