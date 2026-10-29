// Vercel Node function. No visitor data or credentials are written to logs/storage.
const { createHash } = require('node:crypto');
const RECIPIENT = 'info@igalawfirm.com';
const MAX_BYTES = 32768;
const WINDOW_MS = 10 * 60 * 1000;
const attempts = new Map(); // Best-effort per-instance throttling, not a distributed store.

function send(res, status, payload) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(status).json(payload);
}
function email(value) {
  return typeof value === 'string' && value.length <= 254 && /^[^\s<>@,;\r\n]+@[^\s<>@,;\r\n]+\.[^\s<>@,;\r\n]+$/.test(value);
}
function sender(value) {
  if (typeof value !== 'string' || /[\r\n]/.test(value)) return false;
  const match = value.match(/^[^<>]+<([^<>]+)>$/);
  return email(match ? match[1] : value);
}
function allowedOrigin(value, host) {
  try {
    const url = new URL(value);
    if (url.origin !== value || url.host !== host) return false;
    if (['https://igalawfirm.com', 'https://www.igalawfirm.com', 'https://igalaw.vercel.app', 'https://iga.vercel.app'].includes(value)) return true;
    if ([process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL].filter(Boolean).some(name => value === `https://${name}`)) return true;
    return !process.env.VERCEL && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) && url.protocol === 'http:';
  } catch { return false; }
}
function throttled(req) {
  const now = Date.now();
  for (const [key, item] of attempts) if (item.until <= now) attempts.delete(key);
  const ip = String(req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const key = createHash('sha256').update(ip).digest('hex');
  let item = attempts.get(key);
  if (!item) {
    if (attempts.size >= 2048) attempts.delete(attempts.keys().next().value);
    item = { count: 0, until: now + WINDOW_MS };
    attempts.set(key, item);
  }
  item.count += 1;
  return item.count > 10;
}
function cleanSubject(value) {
  return typeof value === 'string' ? value.replace(/[\r\n\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120) : '';
}
function validSubmission(body, origin) {
  if (!body || Array.isArray(body) || typeof body !== 'object') return null;
  if (typeof body.website !== 'string' || body.website !== '') return null;
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(body.submissionId || '')) return null;
  if (!['en', 'tr', 'zh', 'zh-CN', 'ar'].includes(body.language)) return null;
  const date = new Date(body.submittedAt);
  if (typeof body.submittedAt !== 'string' || !Number.isFinite(date.getTime()) || date.toISOString() !== body.submittedAt) return null;
  // Stable browser timestamp keeps the provider payload identical on a safe retry.
  if (date.getTime() > Date.now() + 10 * 60 * 1000 || date.getTime() < Date.now() - 23 * 60 * 60 * 1000) return null;
  let page;
  try { page = new URL(body.pageUrl); } catch { return null; }
  if (body.pageUrl.length > 2048 || page.origin !== origin || page.username || page.password) return null;
  if (!Array.isArray(body.fields) || body.fields.length > 40 || !body.fields.length) return null;
  const fields = [];
  for (const field of body.fields) {
    if (!field || typeof field.name !== 'string' || !/^[a-zA-Z0-9_. -]{1,80}$/.test(field.name) || typeof field.value !== 'string' || field.value.length > 10000 || /\u0000/.test(field.value)) return null;
    fields.push({ name: field.name, value: field.value });
  }
  const values = name => fields.filter(f => f.name === name).map(f => f.value.trim());
  for (const name of ['name', 'surname', 'email', 'message']) if (values(name).length !== 1 || !values(name)[0]) return null;
  if (!email(values('email')[0])) return null;
  return { fields, replyTo: values('email')[0], pageUrl: page.href, language: body.language, submittedAt: body.submittedAt, submissionId: body.submissionId, pageTitle: cleanSubject(body.pageTitle), service: cleanSubject(body.service) };
}
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { ok: false, error: 'method_not_allowed' });
  }
  const origin = req.headers.origin;
  if (!allowedOrigin(origin, req.headers.host) || req.headers['sec-fetch-site'] === 'cross-site') return send(res, 403, { ok: false, error: 'forbidden' });
  if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return send(res, 415, { ok: false, error: 'unsupported_body' });
  if (Number(req.headers['content-length']) > MAX_BYTES) return send(res, 413, { ok: false, error: 'too_large' });
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (Buffer.byteLength(JSON.stringify(body) || '') > MAX_BYTES) return send(res, 413, { ok: false, error: 'too_large' });
  } catch { return send(res, 400, { ok: false, error: 'invalid_submission' }); }
  const lead = validSubmission(body, origin);
  if (!lead) return send(res, 400, { ok: false, error: 'invalid_submission' });
  if (throttled(req)) {
    res.setHeader('Retry-After', '600');
    return send(res, 429, { ok: false, error: 'rate_limited' });
  }
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_EMAIL_FROM;
  if (!apiKey || !sender(from)) return send(res, 503, { ok: false, error: 'email_unavailable' });
  const timeIstanbul = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long', timeZone: 'Europe/Istanbul' }).format(new Date(lead.submittedAt));
  const notification = {
    from,
    to: [RECIPIENT],
    reply_to: lead.replyTo,
    subject: 'Attention Mr. Sinan',
    text: [
      'Dear Sinan could you please kindly contact my lead',
      '',
      'New website inquiry — IGA Law Firm',
      '',
      // Plain text preserves multilingual visitor input without HTML execution.
      ...lead.fields.map(f => `${f.name}: ${f.value}`),
      '',
      '--- Website context (browser supplied) ---',
      `Page: ${lead.pageUrl}`,
      `Page title: ${lead.pageTitle || '(not supplied)'}`,
      `Selected service: ${lead.service || '(not selected)'}`,
      `Website language: ${lead.language}`,
      `Submission time (UTC): ${lead.submittedAt}`,
      `Submission time (Europe/Istanbul): ${timeIstanbul}`,
      `Submission ID: ${lead.submissionId}`
    ].join('\n')
  };
  // Include the payload digest: edits cannot accidentally reuse a prior send key.
  const digest = createHash('sha256').update(JSON.stringify(notification)).digest('hex');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `iga-contact/${lead.submissionId}/${digest}` },
      body: JSON.stringify(notification),
      signal: AbortSignal.timeout(8000)
    });
    const result = await response.json();
    if (!response.ok || typeof result.id !== 'string' || !result.id.trim()) throw new Error('Not accepted');
    return send(res, 200, { ok: true });
  } catch {
    // Never expose provider errors, keys, or the inquiry itself.
    console.error('IGA website email submission could not be confirmed.');
    return send(res, 502, { ok: false, error: 'email_unavailable' });
  }
};
