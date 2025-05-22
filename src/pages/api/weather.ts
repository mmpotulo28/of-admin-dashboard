import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { location } = req.query;
  try {
    // 1. Geocode location to lat/lng using Google Geocoding API
    const geoRes = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location as string
      )}&key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}`
    );
    const geo = geoRes.data.results[0]?.geometry.location;
    if (!geo)
      return res.status(400).json({ error: 'Could not geocode location' });

    // 2. Call Google Weather API (server-side) - use currentConditions endpoint
    const weatherRes = await axios.get(
      `https://weather.googleapis.com/v1/currentConditions:lookup?location.latitude=${geo.lat}&location.longitude=${geo.lng}&key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}`
    );
    const googleWeather = weatherRes.data;

    // 3. Map Google Weather API response to your expected structure (if needed)
    // For now, just return the raw response
    res.status(200).json(googleWeather);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
    console.error(error);
  }
}
