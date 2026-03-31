import { put, list, getDownloadUrl } from '@vercel/blob';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { QuizResult } from '@/lib/quiz-data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'POST') {
    try {
      const result: QuizResult = req.body;
      const filename = `results/${result.timestamp}-${Math.random().toString(36).slice(2)}.json`;
      await put(filename, JSON.stringify(result), {
        access: 'private',
        contentType: 'application/json',
      });
      res.status(200).json({ success: true });
    } catch (e) {
      console.error('POST error:', e);
      res.status(500).json({ error: String(e) });
    }

  } else if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: 'results/' });

      const results: QuizResult[] = await Promise.all(
        blobs.map(async (blob) => {
          // For private blobs, use getDownloadUrl to get a signed URL
          const { url } = await getDownloadUrl(blob.url);
          const r = await fetch(url);
          return r.json();
        })
      );

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
