(() => {
  // Explicitly blank the favicon so browsers do not keep showing the old cached icon.
  document.querySelectorAll('link[rel~="icon"]').forEach(link => link.remove());
  const blankIcon = document.createElement('link');
  blankIcon.rel = 'icon';
  blankIcon.href = 'data:,';
  document.head.appendChild(blankIcon);

  const load = (src, done) => {
    const s = document.createElement('script');
    s.src = src;
    s.defer = true;
    if (done) s.onload = done;
    document.head.appendChild(s);
  };
  load('script-base.js', () => load('career-compact.js', () => load('contact-form.js')));
})();
