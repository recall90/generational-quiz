import { put, list } from '@vercel/blob';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { QuizResult } from '@/lib/quiz-data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'POST') {
    try {
      const result: QuizResult = req.body;
      // Store each result as its own blob — no overwrite needed, no race conditions
      const filename = `results/${result.timestamp}-${Math.random().toString(36).slice(2)}.json`;
      await put(filename, JSON.stringify(result), {
        access: 'public',
        contentType: 'application/json',
      });
      res.status(200).json({ success: true });
    } catch (e) {
      console.error('POST error:', e);
      res.status(500).json({ error: String(e) });
    }

  } else if (req.method === 'GET') {
    try {
      // List all result blobs and fetch each one
      const { blobs } = await list({ prefix: 'results/' });

      const results: QuizResult[] = await Promise.all(
        blobs.map(async (blob) => {
          const r = await fetch(blob.url, { cache: 'no-store' });
          return r.json();
        })
      );

      // Sort newest first
      results.sort((a, b) => b.timestamp - a.timestamp);

      res.status(200).json({ results });
    } catch (e) {
      console.error('GET error:', e);
      res.status(500).json({ error: String(e) });
    }

  } else {
    res.status(405).end();
  }
}
