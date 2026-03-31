import type { NextApiRequest, NextApiResponse } from 'next';
import type { QuizResult } from '@/lib/quiz-data';

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN!;
// Derive the store base URL from the token
// Token format: vercel_blob_rw_<storeId>_<secret>
function getStoreId(): string {
  const parts = TOKEN?.split('_') ?? [];
  // storeId is the 4th segment: vercel_blob_rw_STOREID_...
  return parts[3] ?? '';
}

async function blobFetch(path: string, options: RequestInit = {}) {
  const url = `https://blob.vercel-storage.com/${path}`;
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      Authorization: `Bearer ${TOKEN}`,
    },
  });
}

async function listBlobs(prefix: string): Promise<{ url: string; pathname: string }[]> {
  const params = new URLSearchParams({ prefix });
  const res = await fetch(`https://blob.vercel-storage.com?${params}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const data = await res.json();
  return data.blobs ?? [];
}

async function putBlob(pathname: string, body: string): Promise<{ url: string }> {
  const res = await fetch(`https://blob.vercel-storage.com/${pathname}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'x-api-version': '7',
    },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Blob PUT failed: ${res.status} ${text}`);
  }
  return res.json();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (!TOKEN) {
    return res.status(500).json({ error: 'BLOB_READ_WRITE_TOKEN not set' });
  }

  if (req.method === 'POST') {
    try {
      const result: QuizResult = req.body;
      const filename = `results/${result.timestamp}-${Math.random().toString(36).slice(2)}.json`;
      await putBlob(filename, JSON.stringify(result));
      res.status(200).json({ success: true });
    } catch (e) {
      console.error('POST error:', e);
      res.status(500).json({ error: String(e) });
    }

  } else if (req.method === 'GET') {
    try {
      const blobs = await listBlobs('results/');

      const results: QuizResult[] = await Promise.all(
        blobs.map(async (blob) => {
          const r = await fetch(blob.url, {
            headers: { Authorization: `Bearer ${TOKEN}` },
          });
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
