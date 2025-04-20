// pages/api/porthu.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// Példa: channelId-k lekérése a Port.hu API dokumentáció alapján
// TV2: 2, Duna: 1, M4 Sport: 27 stb.
const BASE_URL = "https://port.hu/tvapi";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { channels, timestamp } = req.query;

  // Ellenőrizzük a bejövő csatorna ID-kat
  if (!channels) {
    return res.status(400).json({ error: "Hiányzik a 'channels' query paraméter" });
  }

  // Alakítsuk tömbbé a channels-t
  const channelIds = Array.isArray(channels) ? channels : [channels];
  const date = timestamp
    ? new Date(parseInt(timestamp as string) * 1000).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10); // Alapértelmezés: mai nap

  // Query paraméterek összeállítása
  const queryParams = new URLSearchParams();
  channelIds.forEach((id) => {
    queryParams.append("channel_id[]", `tvchannel-${id}`);
  });
  queryParams.append("date", date);

  try {
    const response = await axios.get(BASE_URL + "?" + queryParams.toString());
    res.status(200).json(response.data);
  } catch (err: any) {
    console.error("Hiba a Port.hu API-nál:", err.message);
    res.status(500).json({ error: "Nem sikerült lekérni a műsort." });
  }
}
