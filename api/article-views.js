const { createHmac } = require('node:crypto');
const slugs = require('../blog-slugs.json');

const knownSlugs = new Set(slugs);
const prefix = 'iga:blog:unique:v1:';
const recordScript = `
local attempts = redis.call('INCR', KEYS[3])
if attempts == 1 then redis.call('EXPIRE', KEYS[3], 86400) end
if attempts > 200 then return -1 end
if redis.call('SADD', KEYS[1], ARGV[1]) == 1 then
  return redis.call('INCR', KEYS[2])
end
return tonumber(redis.call('GET', KEYS[2]) or '0')
`;

function credentials() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const endpoint = new URL(url);
  if (endpoint.protocol !== 'https:') throw new Error('Redis requires HTTPS');
  return { url: endpoint.href.replace(/\/$/, ''), token };
}

async function redis(config, command) {
  const response = await fetch(config.url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(5000)
  });
  if (!response.ok) throw new Error(`Redis HTTP ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error('Redis command failed');
  return data.result;
}

function send(res, status, payload) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(status).json(payload);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return send(res, 405, { error: 'method_not_allowed' });
  }

  let config;
  try { config = credentials(); } catch { return send(res, 503, { error: 'counter_unavailable' }); }
  if (!config) return send(res, 503, { error: 'counter_unavailable' });

  try {
    if (req.method === 'GET') {
      const values = await redis(config, ['MGET', ...slugs.map(slug => `${prefix}count:${slug}`)]);
      const counts = Object.fromEntries(slugs.map((slug, index) => [slug, Number(values[index] || 0)]));
      return send(res, 200, { counts });
    }

    const origin = req.headers.origin;
    const host = req.headers.host;
    if (!origin || !host || new URL(origin).host !== host) return send(res, 403, { error: 'forbidden' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const slug = body?.slug;
    const visitorId = body?.visitorId;
    if (!knownSlugs.has(slug) || !/^[0-9a-f]{32}$/i.test(visitorId || '')) {
      return send(res, 400, { error: 'invalid_view' });
    }
    if (/(bot|crawl|spider|headless|lighthouse|preview)/i.test(req.headers['user-agent'] || '')) {
      return send(res, 403, { error: 'automated_visit' });
    }

    const visitorHash = createHmac('sha256', config.token).update(visitorId).digest('hex');
    const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    const day = new Date().toISOString().slice(0, 10);
    const rateHash = createHmac('sha256', config.token).update(`${day}:${ip}`).digest('hex');
    const count = await redis(config, [
      'EVAL', recordScript, 3,
      `${prefix}readers:${slug}`,
      `${prefix}count:${slug}`,
      `${prefix}rate:${day}:${rateHash}`,
      visitorHash
    ]);
    if (count === -1) return send(res, 429, { error: 'rate_limited' });
    return send(res, 200, { slug, count: Number(count) });
  } catch (error) {
    console.error('Article views unavailable:', error.message);
    return send(res, 503, { error: 'counter_unavailable' });
  }
};
