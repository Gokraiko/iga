(() => {
  const counters = [...document.querySelectorAll('[data-article-views]')];
  if (!counters.length) return;

  const formatter = new Intl.NumberFormat(document.documentElement.lang || 'en');
  const current = document.querySelector('[data-article-view-current]');
  const endpoint = '/api/article-views/';

  function display(slug, count) {
    if (!Number.isSafeInteger(count) || count < 0) return;
    for (const node of counters) {
      if (node.dataset.articleViews !== slug) continue;
      const total = Number(node.dataset.initialCount || 0) + count;
      node.querySelector('[data-read-count]').textContent = formatter.format(total);
      node.dataset.recordedReads = String(count);
    }
  }

  async function refresh() {
    if (document.visibilityState !== 'visible') return;
    try {
      const response = await fetch(endpoint, { cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) return;
      const { counts } = await response.json();
      if (!counts || typeof counts !== 'object') return;
      for (const [slug, count] of Object.entries(counts)) display(slug, count);
    } catch { /* The manually configured starting value remains visible during an outage. */ }
  }

  function visitorId() {
    try {
      const saved = localStorage.getItem('iga-blog-reader-v1');
      if (/^[0-9a-f]{32}$/i.test(saved || '')) return saved;
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      const id = [...bytes].map(byte => byte.toString(16).padStart(2, '0')).join('');
      localStorage.setItem('iga-blog-reader-v1', id);
      return id;
    } catch { return null; }
  }

  let readTimer;
  let submitted = false;
  async function record() {
    if (!current || submitted || document.visibilityState !== 'visible') return;
    const id = visitorId();
    if (!id) return;
    submitted = true;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: current.dataset.articleViews, visitorId: id })
      });
      if (!response.ok) return;
      const result = await response.json();
      display(result.slug, result.count);
    } catch { /* The displayed count remains the last confirmed value. */ }
  }
  function scheduleRead() {
    clearTimeout(readTimer);
    if (current && !submitted && document.visibilityState === 'visible') {
      readTimer = setTimeout(record, 8000);
    }
  }

  refresh();
  scheduleRead();
  setInterval(refresh, 60000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') refresh();
    scheduleRead();
  });
})();
