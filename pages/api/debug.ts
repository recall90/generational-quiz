import { put, list } from '@vercel/blob';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  const info: Record<string, unknown> = {};

  // 1. Check env var
  info.hasToken = !!process.env.BLOB_READ_WRITE_TOKEN;
  info.tokenPrefix = process.env.BLOB_READ_WRITE_TOKEN?.slice(0, 20) + '...';

  // 2. Try writing a test blob
  try {
    const testBlob = await put(
      `debug/test-${Date.now()}.json`,
      JSON.stringify({ test: true, ts: Date.now() }),
      { access: 'public', contentType: 'application/json' }
    );
    info.writeSuccess = true;
    info.writtenUrl = testBlob.url;
    info.writtenPathname = testBlob.pathname;
  } catch (e) {
    info.writeSuccess = false;
    info.writeError = String(e);
  }

  // 3. Try listing all blobs
  try {
    const { blobs } = await list();
    info.listSuccess = true;
    info.totalBlobs = blobs.length;
    info.blobPathnames = blobs.map(b => b.pathname);
  } catch (e) {
    info.listSuccess = false;
    info.listError = String(e);
  }

  // 4. Try listing results/ prefix
  try {
    const { blobs } = await list({ prefix: 'results/' });
    info.resultsBlobs = blobs.length;
    info.resultsPaths = blobs.map(b => b.pathname);
  } catch (e) {
    info.resultsListError = String(e);
  }

  res.status(200).json(info);
}
