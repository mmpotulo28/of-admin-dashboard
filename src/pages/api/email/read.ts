import { NextApiRequest, NextApiResponse } from 'next';
import { pool, ensureEmailsTableExists } from '@/lib/db';
import { iEmail } from '@/lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Ensure the emails table exists
    await ensureEmailsTableExists();

    // Query to retrieve emails
    const query = `SELECT * FROM emails ORDER BY date_sent DESC;`;
    const { rows }: { rows: iEmail[] } = await pool.query(query);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No emails found' });
    }

    console.log('Emails retrieved successfully:', rows);

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error retrieving emails:', error);
    return res.status(500).json({ error: 'Failed to retrieve emails' });
  }
}
