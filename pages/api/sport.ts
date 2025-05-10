// pages/api/musclewiki.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { date } = req.body;

  const apiUrl = `https://api.sofascore.com/api/v1/sport/football/scheduled-events/${date}`;

  try {
    const response = await fetch(apiUrl, {
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}
