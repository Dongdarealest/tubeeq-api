import { u, cors } from './_upstash.js';
export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const id = String((req.body || {}).id || '').slice(0, 20);
    if (!/^p[a-z0-9]+$/.test(id)) return res.status(400).json({ error: 'bad id' });
    const n = await u('HINCRBY', 'tubeeq:reactions', id, '1');
    res.status(200).json({ ok: true, reactions: n });
  } catch (e) { res.status(500).json({ error: 'db' }); }
}
