import { put, list } from '@vercel/blob';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { QuizResult } from '@/lib/quiz-data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'POST') {
    try {
      const result: QuizResult = req.body;
      const filename = `results/${result.timestamp}-${Math.random().toString(36).slice(2)}.json`;
      const blob = await put(filename, JSON.stringify(result), {
        access: 'public',
        contentType: 'application/json',
      });
      console.log('Saved:', blob.url);
      res.status(200).json({ success: true, url: blob.url });
    } catch (e) {
      console.error('POST error:', String(e));
      res.status(500).json({ error: String(e) });
    }

  } else if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: 'results/' });
      console.log('Blobs found:', blobs.length, blobs.map(b => b.pathname));

      const results: QuizResult[] = await Promise.all(
        blobs.map(async (blob) => {
          const r = await fetch(blob.url);
          return r.json() as Promise<QuizResult>;
        })
      );

      results.sort((a, b) => b.timestamp - a.timestamp);
      res.status(200).json({ results });
    } catch (e) {
      console.error('GET error:', String(e));
      res.status(500).json({ error: String(e) });
    }

  } else {
    res.status(405).end();
  }
}
