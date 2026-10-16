import { u, cors } from './_upstash.js';
export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    if (req.method === 'POST') {
      const n = await u('INCR', 'tubeeq:downloads');
      return res.status(200).json({ count: n });
    }
    const n = await u('GET', 'tubeeq:downloads');
    res.status(200).json({ count: parseInt(n || '0', 10) });
  } catch (e) { res.status(500).json({ error: 'db' }); }
}
