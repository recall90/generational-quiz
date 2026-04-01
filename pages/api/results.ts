import type { NextApiRequest, NextApiResponse } from 'next';
import type { QuizResult } from '@/lib/quiz-data';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'POST') {
    try {
      const result: QuizResult = req.body;
      const { error } = await supabase.from('results').insert({
        name: result.name,
        birth_year: result.birthYear,
        result: result.result,
        scores: result.scores,
        timestamp: result.timestamp,
      });
      if (error) throw error;
      res.status(200).json({ success: true });
    } catch (e) {
      console.error('POST error:', e);
      res.status(500).json({ error: String(e) });
    }

  } else if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .order('timestamp', { ascending: false });
      if (error) throw error;

      // Map DB rows back to QuizResult shape
      const results: QuizResult[] = (data ?? []).map((row) => ({
        name: row.name,
        birthYear: row.birth_year,
        result: row.result,
        scores: row.scores,
        timestamp: row.timestamp,
      }));

      res.status(200).json({ results });
    } catch (e) {
      console.error('GET error:', e);
      res.status(500).json({ error: String(e) });
    }

  } else {
    res.status(405).end();
  }
}
