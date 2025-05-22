import { NextApiRequest, NextApiResponse } from 'next';
import {
  ensureTransactionsTableExists,
  pool,
  testDatabaseConnection,
} from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { paymentId } = req.query;

    if (!paymentId) {
      return res.status(400).json({ error: 'Missing paymentId' });
    }

    try {
      // Test database connection with retries
      await testDatabaseConnection();

      const client = await pool.connect();
      try {
        // Ensure the transactions table exists
        await ensureTransactionsTableExists();

        const result = await client.query(
          `SELECT * FROM "transactions" WHERE "m_payment_id" = $1`,
          [paymentId]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Transaction not found' });
        }

        return res.status(200).json(result.rows[0]);
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error retrieving transaction:', error);
      const errorMessage = error instanceof Error ? error.message : error;
      return res
        .status(500)
        .json({ error: `Internal Server Error: ${errorMessage}` });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
