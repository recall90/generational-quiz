import { kv } from '@vercel/kv';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { QuizResult } from '@/lib/quiz-data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const result: QuizResult = req.body;
      const id = `result:${Date.now()}:${Math.random().toString(36).slice(2)}`;
      await kv.lpush('results', JSON.stringify(result));
      res.status(200).json({ success: true, id });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to save result' });
    }
  } else if (req.method === 'GET') {
    try {
      const raw = await kv.lrange('results', 0, -1);
      const results: QuizResult[] = raw.map((r) =>
        typeof r === 'string' ? JSON.parse(r) : r
      );
      res.status(200).json({ results });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to fetch results' });
    }
  } else {
    res.status(405).end();
  }
}
