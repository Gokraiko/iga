// Dedicated Vercel Node endpoint. Reuses the approved Resend configuration.
// No personal data or credentials are logged or persisted locally.
const { createHash, createHmac, randomUUID, timingSafeEqual } = require('node:crypto');
const RECIPIENT = 'info@igalawfirm.com';
const MAX_BYTES = 32768;
const RETRY_MS = 23 * 60 * 60 * 1000; // Below Resend's 24-hour idempotency window.
const deliveries = new Map(); // Coalesces identical concurrent requests; provider deduplicates across instances.
const SERVICES = {
  diligence: ['Property Legal Due Diligence', 'Property Legal Review', 'Confirm whether the client has selected a property and whether any purchase agreement, deposit or payment deadline is pending. Explain the proposed legal review scope and fees.'],
  valuation: ['Independent Property Valuation', 'Property Valuation Request', 'Contact the client using their preferred channel. Confirm property location, purpose of valuation, available property information and whether an appropriately qualified independent valuation provider is required.'],
  citizenship: ['Turkish Citizenship Property Eligibility Assessment', 'Citizenship Property Eligibility', "Confirm the investor's proposed investment, whether the property has already been purchased and which transaction documents are available. Arrange a legal eligibility assessment before making any representation about official conformity."],
  existing: ['Review of an Existing Property', 'Existing Property Review', "Clarify the client's objective, property ownership status and available documents. Arrange secure document collection if needed."],
  consultation: ['General Property Legal Consultation', 'Property Legal Consultation', "Review the client's inquiry and determine the appropriate legal service and next steps."]
};
const PURPOSES = { citizenship: 'Turkish Citizenship by Investment', investment: 'Property Investment', personal: 'Personal Use', existing: 'Existing Property Review', other: 'Other / Not Sure' };
const STATUSES = { selected: 'Property Selected', searching: 'Still Searching', owned: 'Already Owned' };
const BUDGETS = { under200: 'Under USD 200,000', '200to399': 'USD 200,000–399,999', '400to500': 'USD 400,000–500,000', above500: 'Above USD 500,000', unsure: 'Not Sure' };
const CONTACTS = { phone: 'Phone', whatsapp: 'WhatsApp', wechat: 'WeChat', email: 'Email' };
const VALUATION_PURPOSES = { citizenship: 'Citizenship-related procedures', financing: 'Financing', purchase: 'Purchase decision', other: 'Other' };
const COUNTRIES = new Set('AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' '));
const has = (obj, key) => typeof key === 'string' && Object.prototype.hasOwnProperty.call(obj, key);
function send(res, status, data) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  return res.status(status).json(data);
}
function email(s) { return typeof s === 'string' && s.length <= 254 && /^[^\s<>@,;\r\n]+@[^\s<>@,;\r\n]+\.[^\s<>@,;\r\n]+$/.test(s); }
function sender(s) {
  if (typeof s !== 'string' || /[\r\n\u0000-\u001f\u007f]/.test(s)) return false;
  const match = s.match(/^[^<>]+<([^<>]+)>$/);
  return email(match ? match[1] : s);
}
function allowedOrigin(value, host) {
  try {
    const u = new URL(value);
    if (u.origin !== value || u.host !== host) return false;
    if (['https://igalawfirm.com', 'https://www.igalawfirm.com', 'https://igalaw.vercel.app', 'https://iga.vercel.app'].includes(value)) return true;
    if ([process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL].filter(Boolean).some(h => value === `https://${h}`)) return true;
    return !process.env.VERCEL && ['localhost', '127.0.0.1', '[::1]'].includes(u.hostname) && u.protocol === 'http:';
  } catch { return false; }
}
function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token || new URL(url).protocol !== 'https:') throw new Error('Storage unavailable');
  return {url, token};
}
async function redis(config, command) {
  const response = await fetch(config.url, {method:'POST', headers:{Authorization:`Bearer ${config.token}`, 'Content-Type':'application/json'}, body:JSON.stringify(command), signal:AbortSignal.timeout(5000)});
  const data = await response.json();
  if (!response.ok || data.error) throw new Error('Storage unavailable');
  return data.result;
}
async function throttled(req, config) {
  const ip = String(req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const key = createHmac('sha256', config.token).update('iga-property-rate:'+ip).digest('hex');
  const count = await redis(config, ['EVAL', "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],600) end; return n", 1, 'iga:property:rate:'+key]);
  return Number(count)>30;
}
function sign(id, time, origin, secret) {
  return createHmac('sha256', secret).update(`iga-property-review-v1\n${origin}\n${id}\n${time}`).digest('hex');
}
function validChallenge(c, origin, secret) {
  if (!c || typeof c !== 'object' || Array.isArray(c)) return false;
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(c.submissionId || '')) return false;
  if (typeof c.receivedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(c.receivedAt)) return false;
  const timestamp = Date.parse(c.receivedAt);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString() !== c.receivedAt) return false;
  const age = Date.now() - timestamp;
  if (age < 2000 || age > RETRY_MS || typeof c.token !== 'string' || !/^[a-f0-9]{64}$/.test(c.token)) return false;
  return timingSafeEqual(Buffer.from(c.token, 'hex'), Buffer.from(sign(c.submissionId, c.receivedAt, origin, secret), 'hex'));
}
function string(value, max, required = false, multiline = false) {
  if (value === undefined && !required) return '';
  if (typeof value !== 'string' || value.length > max || (multiline ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/ : /[\u0000-\u001f\u007f]/).test(value)) return null;
  const result = value.trim();
  return required && !result ? null : result;
}
function submission(b, origin, secret) {
  if (!b || typeof b !== 'object' || Array.isArray(b) || b.website !== '' || b.privacyAcknowledged !== true) return null;
  if (!validChallenge(b.challenge, origin, secret) || b.submissionId !== b.challenge.submissionId) return null;
  if (!['en', 'tr', 'zh', 'ar'].includes(b.language)) return null;
  if (!has(SERVICES, b.service) || !has(PURPOSES, b.purpose) || !has(STATUSES, b.status) || !has(BUDGETS, b.budget) || !has(CONTACTS, b.preferredContact)) return null;
  // Browser timing is supplemental; the signed server timestamp enforces the minimum dwell time.
  const started = typeof b.startedAt === 'number' ? b.startedAt : typeof b.startedAt === 'string' ? Date.parse(b.startedAt) : NaN;
  if (!Number.isFinite(started) || Date.now() - started < 2000 || Date.now() - started > RETRY_MS) return null;
  const name = string(b.name, 120, true), mail = string(b.email, 254, true), phoneInput = string(b.phone, 50), wechat = string(b.wechat, 100), location = string(b.location, 250), listing = string(b.listingUrl, 2048), message = string(b.message, 5000, false, true), country = string(b.country, 2);
  if ([name, mail, phoneInput, wechat, location, listing, message, country].includes(null) || !email(mail)) return null;
  if (country && !COUNTRIES.has(country)) return null;
  if (b.noWechat !== undefined && typeof b.noWechat !== 'boolean') return null;
  if (b.noWechat && wechat) return null;
  let phone = phoneInput.replace(/[\s().-]/g, '').replace(/^00/, '+');
  if (phone && !/^\+[1-9]\d{7,14}$/.test(phone)) return null;
  if ((b.service === 'valuation' || ['phone', 'whatsapp'].includes(b.preferredContact)) && !phone) return null;
  if (b.preferredContact === 'wechat' && (!wechat || b.noWechat)) return null;
  if (b.service === 'valuation' && (!location || (!wechat && b.noWechat !== true) || !has(VALUATION_PURPOSES, b.valuationPurpose))) return null;
  if (b.valuationPurpose !== undefined && b.valuationPurpose !== '' && !has(VALUATION_PURPOSES, b.valuationPurpose)) return null;
  let listingUrl = '';
  if (listing) {
    try {
      const u = new URL(listing);
      if (!['http:', 'https:'].includes(u.protocol) || !u.hostname || u.username || u.password) return null;
      listingUrl = u.href;
    } catch { return null; }
  }
  const lawyer = { en: 'turkish-citizenship-by-investment-lawyer', tr: 'yatirim-yoluyla-turk-vatandasligi-avukati', zh: 'tuerqi-touzi-ruji-lushi', ar: 'turkish-citizenship-by-investment-lawyer' }[b.language];
  const knownPaths = [`/${b.language}/`, `/${b.language}/igalawrealestateduediligence/`, `/${b.language}/${lawyer}/`];
  if (typeof b.sourcePage !== 'string' || !knownPaths.includes(b.sourcePage)) return null;
  return { name, email: mail, phone, wechat, noWechat: b.noWechat === true, country, location, listingUrl, message, service: b.service, purpose: b.purpose, status: b.status, budget: b.budget, preferredContact: b.preferredContact, valuationPurpose: b.service === 'valuation' ? b.valuationPurpose : '', language: b.language, sourcePage: b.sourcePage, submissionId: b.submissionId, receivedAt: b.challenge.receivedAt };
}
function notification(lead, from) {
  const fallback = value => value || 'Not Provided';
  return {
    from, to: [RECIPIENT], reply_to: lead.email,
    subject: `[IGA NEW LEAD] ${SERVICES[lead.service][1]} — ${lead.name}`,
    // Plain text: client text is data, never HTML or email headers.
    text: [
      'NEW PROPERTY INQUIRY — IGA LAW FIRM', '', `Requested Service: ${SERVICES[lead.service][0]}`, '',
      'Client Information', `Full Name: ${lead.name}`, `Email: ${lead.email}`, `Phone: ${fallback(lead.phone)}`, `WeChat ID: ${lead.noWechat ? 'Does not use WeChat' : fallback(lead.wechat)}`, `Country: ${fallback(lead.country)}`, `Preferred Contact Method: ${CONTACTS[lead.preferredContact]}`, '',
      'Property Information', `Investment Purpose: ${PURPOSES[lead.purpose]}`, `Estimated Property Value: ${BUDGETS[lead.budget]}`, `Property Status: ${STATUSES[lead.status]}`, `Property Location: ${fallback(lead.location)}`, `Property Listing: ${fallback(lead.listingUrl)}`, ...(lead.valuationPurpose ? [`Valuation Purpose: ${VALUATION_PURPOSES[lead.valuationPurpose]}`] : []), '',
      'Additional Information', fallback(lead.message), '',
      'Lead Information', `Source Page: https://igalawfirm.com${lead.sourcePage}`, `Website Language: ${lead.language}`, `Submission Date and Time (server, UTC): ${lead.submittedAt}`, `Lead Type: ${SERVICES[lead.service][0]}`, `Submission ID: ${lead.submissionId}`, 'Privacy notice acknowledged: Yes', '',
      'Suggested Next Step', SERVICES[lead.service][2]
    ].join('\n')
  };
}
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(res, 405, { ok: false, error: 'method_not_allowed' }); }
  const origin = req.headers.origin;
  if (!allowedOrigin(origin, req.headers.host) || req.headers['sec-fetch-site'] === 'cross-site') return send(res, 403, { ok: false, error: 'forbidden' });
  let config;
  try { config=redisConfig(); if(await throttled(req, config)){res.setHeader('Retry-After','600');return send(res,429,{ok:false,error:'rate_limited'});} }
  catch { return send(res,503,{ok:false,error:'service_unavailable'}); }
  if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return send(res, 415, { ok: false, error: 'unsupported_body' });
  if (Number(req.headers['content-length']) > MAX_BYTES) return send(res, 413, { ok: false, error: 'too_large' });
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (Buffer.byteLength(JSON.stringify(body) || '') > MAX_BYTES) return send(res, 413, { ok: false, error: 'too_large' });
  } catch { return send(res, 400, { ok: false, error: 'invalid_submission' }); }
  const key = process.env.RESEND_API_KEY, from = process.env.LEAD_EMAIL_FROM;
  if (!key || !sender(from)) return send(res, 503, { ok: false, error: 'email_unavailable' });
  if (body && body.action === 'challenge') {
    const submissionId = randomUUID(), receivedAt = new Date().toISOString();
    return send(res, 200, { ok: true, challenge: { submissionId, receivedAt, token: sign(submissionId, receivedAt, origin, key) } });
  }
  const lead = submission(body, origin, key);
  if (!lead) return send(res, 400, { ok: false, error: 'invalid_submission' });
  // Only a digest and server timestamp are stored, with a 23-hour TTL; never contact details.
  const leadDigest=createHash('sha256').update(JSON.stringify(lead)).digest('hex');
  try {
    const reservation=JSON.stringify({digest:leadDigest,submittedAt:new Date().toISOString()});
    const stored=await redis(config,['EVAL',"local v=redis.call('GET',KEYS[1]); if v then return v end; redis.call('SET',KEYS[1],ARGV[1],'EX',82800); return ARGV[1]",1,'iga:property:receipt:'+lead.submissionId,reservation]);
    const receipt=JSON.parse(stored);
    if(receipt.digest!==leadDigest)return send(res,409,{ok:false,error:'submission_changed'});
    lead.submittedAt=receipt.submittedAt;
  } catch { return send(res,503,{ok:false,error:'service_unavailable'}); }
  const payload = JSON.stringify(notification(lead, from));
  const digest = createHash('sha256').update(payload).digest('hex');
  const now = Date.now();
  for (const [id, entry] of deliveries) if (entry.until <= now) deliveries.delete(id);
  let record = deliveries.get(lead.submissionId);
  // Reusing a signed submission ID with edited content is an error, not a second send.
  if (record && record.digest !== digest) return send(res, 409, { ok: false, error: 'submission_changed' });
  if (!record) {
    if (deliveries.size >= 2048) deliveries.delete(deliveries.keys().next().value);
    record = { digest, until: Date.parse(lead.receivedAt) + RETRY_MS, promise: null };
    deliveries.set(lead.submissionId, record);
  }
  if (!record.promise) record.promise = (async () => {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `iga-property-review/${lead.submissionId}` }, body: payload, signal: AbortSignal.timeout(8000)
      });
      const result = await response.json();
      if (!response.ok || typeof result.id !== 'string' || !result.id.trim()) throw new Error('Not accepted');
      return true;
    } catch {
      console.error(JSON.stringify({event:'property_review_delivery_unconfirmed',submissionId:lead.submissionId}));
      return false;
    }
  })();
  const accepted = await record.promise;
  if (!accepted) { record.promise = null; return send(res, 502, { ok: false, error: 'email_unavailable' }); }
  // Success means durable provider acceptance, not proof of inbox delivery.
  return send(res, 200, { ok: true });
};
