import { put, list, head, del } from '@vercel/blob';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { QuizResult } from '@/lib/quiz-data';

const BLOB_KEY = 'kviz-results.json';

async function readResults(): Promise<QuizResult[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length === 0) return [];
    // Get the most recent blob with this name
    const blob = blobs[0];
    const res = await fetch(blob.url);
    return await res.json();
  } catch {
    return [];
  }
}

async function writeResults(results: QuizResult[]): Promise<void> {
  // Delete existing blob(s) with this key first
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    for (const blob of blobs) {
      await del(blob.url);
    }
  } catch {}

  await put(BLOB_KEY, JSON.stringify(results), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const result: QuizResult = req.body;
      const results = await readResults();
      results.push(result);
      await writeResults(results);
      res.status(200).json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to save result' });
    }
  } else if (req.method === 'GET') {
    try {
      const results = await readResults();
      res.status(200).json({ results });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to fetch results' });
    }
  } else {
    res.status(405).end();
  }
}
