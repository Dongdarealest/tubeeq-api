import { u, cors } from './_upstash.js';
const KEY = 'tubeeq:presets';
const TAGS = ['edm','acoustic','podcast','movie','gaming','vocal','bass','chill'];
function clean(s, n) { return String(s || '').slice(0, n).trim(); }
export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    if (req.method === 'POST') {
      const b = req.body || {};
      const code = clean(b.code, 200);
      if (!/^TQ[12]\.[A-Za-z0-9+/=]+$/.test(code)) return res.status(400).json({ error: 'bad code' });
      const tags = (Array.isArray(b.tags) ? b.tags : String(b.tags || '').split(','))
        .map(t => clean(t, 20).toLowerCase()).filter(t => TAGS.includes(t)).slice(0, 3);
      const raw = await u('GET', KEY);
      const list = raw ? JSON.parse(raw) : [];
      const p = {
        id: 'p' + Date.now().toString(36),
        name: clean(b.name, 40) || 'Untitled',
        desc: clean(b.desc, 120),
        code,
        author: clean(b.author, 30) || 'anon',
        tags,
        created: Date.now(),
      };
      list.push(p);
      await u('SET', KEY, JSON.stringify(list.slice(-300)));
      return res.status(200).json({ ok: true, preset: p, tags: TAGS });
    }
    const raw = await u('GET', KEY);
    const list = raw ? JSON.parse(raw) : [];
    const reacts = await u('HGETALL', 'tubeeq:reactions');
    const rm = {};
    if (reacts) for (let i = 0; i < reacts.length; i += 2) rm[reacts[i]] = parseInt(reacts[i + 1], 10) || 0;
    const tag = clean((req.query || {}).tag, 20).toLowerCase();
    let out = list.map(p => ({ ...p, reactions: rm[p.id] || 0 }));
    if (tag && TAGS.includes(tag)) out = out.filter(p => (p.tags || []).includes(tag));
    out.sort((a, b) => b.reactions - a.reactions || b.created - a.created);
    res.status(200).json({ presets: out, tags: TAGS });
  } catch (e) { res.status(500).json({ error: 'db' }); }
}
