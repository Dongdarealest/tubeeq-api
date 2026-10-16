import { cors } from './_upstash.js';
const LATEST = { version: '1.0.2', url: 'https://github.com/Dongdarealest/TubeEQ/releases/download/v1.0.2/tubeeq-v1.0.2.zip', notes: 'Community tab + auto update check' };
export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  res.status(200).json(LATEST);
}
