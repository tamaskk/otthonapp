// pages/api/musclewiki.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { limit = '4', offset = '0', category = '', status = 'Published', ordering = '-featured_weight', muscles = '1' } = req.query;

  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    category: category.toString(),
    status: status.toString(),
    ordering: ordering.toString(),
    muscles: muscles.toString(),
  });

  const apiUrl = `https://musclewiki.com/newapi/exercise/exercises/?${queryParams.toString()}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}
