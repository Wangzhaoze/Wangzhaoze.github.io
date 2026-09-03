(() => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!(form instanceof HTMLFormElement)) return;

  const submit = form.querySelector('button[type="submit"]');
  const endpoint = 'https://formsubmit.co/ajax/wangzhaoze@outlook.com';

  const setStatus = (message, state = '') => {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = state;
  };

  const style = document.createElement('style');
  style.textContent = `
    .contact-submit:disabled{opacity:.55;pointer-events:none}
    .form-status[data-state="success"]{color:#c9d8c6}
    .form-status[data-state="error"]{color:#e6a18d}
  `;
  document.head.appendChild(style);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const name = document.getElementById('contact-name')?.value.trim() || '';
    const email = document.getElementById('contact-email')?.value.trim() || '';
    const message = document.getElementById('contact-message')?.value.trim() || '';
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !validEmail || message.length < 5) {
      setStatus('Please enter your name, a valid email address, and a message.', 'error');
      return;
    }

    if (submit instanceof HTMLButtonElement) submit.disabled = true;
    setStatus('Sending…');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Website message from ${name}`,
          _template: 'table',
          _url: window.location.href
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) {
        throw new Error(data.message || 'Unable to send message');
      }

      form.reset();
      setStatus('Message sent. Thank you — I’ll get back to you soon.', 'success');
    } catch (error) {
      console.error('Contact form submission failed:', error);
      const raw = String(error?.message || '').toLowerCase();
      if (raw.includes('activate') || raw.includes('confirm')) {
        setStatus('The contact form is awaiting one-time owner activation. Please try again shortly.', 'error');
      } else {
        setStatus('Could not send automatically. Please email wangzhaoze@outlook.com directly.', 'error');
      }
    } finally {
      if (submit instanceof HTMLButtonElement) submit.disabled = false;
    }
  }, true);
})();
