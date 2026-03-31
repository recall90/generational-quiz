import { put, list } from '@vercel/blob';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { QuizResult } from '@/lib/quiz-data';

const BLOB_PATHNAME = 'kviz-results.json';

async function readResults(): Promise<QuizResult[]> {
  try {
    // List all blobs and find ours by pathname
    const { blobs } = await list();
    const blob = blobs.find(b => b.pathname === BLOB_PATHNAME);
    if (!blob) return [];

    // Fetch with cache-busting to always get fresh data
    const res = await fetch(blob.url + '?t=' + Date.now(), {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error('readResults error:', e);
    return [];
  }
}

async function writeResults(results: QuizResult[]): Promise<void> {
  // allowOverwrite replaces the blob at the same pathname — no suffix issues
  await put(BLOB_PATHNAME, JSON.stringify(results), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    // @ts-ignore — supported in @vercel/blob >=0.22
    allowOverwrite: true,
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Disable caching on this API route
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'POST') {
    try {
      const result: QuizResult = req.body;
      const results = await readResults();
      results.push(result);
      await writeResults(results);
      res.status(200).json({ success: true });
    } catch (e) {
      console.error('POST error:', e);
      res.status(500).json({ error: 'Failed to save result' });
    }
  } else if (req.method === 'GET') {
    try {
      const results = await readResults();
      res.status(200).json({ results });
    } catch (e) {
      console.error('GET error:', e);
      res.status(500).json({ error: 'Failed to fetch results' });
    }
  } else {
    res.status(405).end();
  }
}
