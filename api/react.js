import { u, cors } from './_upstash.js';
export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const id = String((req.body || {}).id || '').slice(0, 20);
    if (!/^p[a-z0-9]+$/.test(id)) return res.status(400).json({ error: 'bad id' });
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim().slice(0, 45) || 'unknown';
    const key = 'tubeeq:reacted:' + id;
    const seen = await u('SISMEMBER', key, ip);
    let n;
    if (seen) {
      n = await u('HGET', 'tubeeq:reactions', id);
    } else {
      await u('SADD', key, ip);
      n = await u('HINCRBY', 'tubeeq:reactions', id, '1');
    }
    res.status(200).json({ ok: true, reactions: parseInt(n || '0', 10), already: !!seen });
  } catch (e) { res.status(500).json({ error: 'db' }); }
}
