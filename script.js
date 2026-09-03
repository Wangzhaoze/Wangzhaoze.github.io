(() => {
  const load = (src, done) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = done;
    s.defer = true;
    document.head.appendChild(s);
  };
  load('script-base.js', () => load('career-showcase.js'));
})();
