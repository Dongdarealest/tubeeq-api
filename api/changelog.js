import { u, cors } from './_upstash.js';
const KEY = 'tubeeq:changelog';
export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    if (req.method === 'POST') {
      const b = req.body || {};
      const version = String(b.version || '').slice(0, 20);
      const changes = (Array.isArray(b.changes) ? b.changes : []).map(c => String(c).slice(0, 200)).slice(0, 20);
      if (!version || !changes.length) return res.status(400).json({ error: 'bad' });
      const raw = await u('GET', KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({ version, date: new Date().toISOString().slice(0, 10), changes });
      await u('SET', KEY, JSON.stringify(list.slice(0, 30)));
      return res.status(200).json({ ok: true });
    }
    const raw = await u('GET', KEY);
    res.status(200).json({ entries: raw ? JSON.parse(raw) : [] });
  } catch (e) { res.status(500).json({ error: 'db' }); }
}
