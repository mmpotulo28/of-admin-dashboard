import { NextApiRequest, NextApiResponse } from 'next';
import { ensureTransactionsTableExists, saveTransaction } from '@/lib/db';
import { iTransaction } from '@/lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const payload: iTransaction = {
        ...req.body,
        custom_str1: req.body.custom_str1 || '0',
        custom_str2: req.body.custom_str2 || '0',
        custom_str3: req.body.custom_str3 || '0',
        custom_str4: req.body.custom_str4 || '0',
        custom_str5: req.body.custom_str5 || '0',
        custom_int1: req.body.custom_int1 || '0',
        custom_int2: req.body.custom_int2 || '0',
        custom_int3: req.body.custom_int3 || '0',
        custom_int4: req.body.custom_int4 || '0',
        custom_int5: req.body.custom_int5 || '0',
      };

      // Validate required fields
      const requiredFields = [
        'pf_payment_id',
        'payment_status',
        'item_name',
        'merchant_id',
      ];
      for (const field of requiredFields) {
        if (!payload[field]) {
          return res
            .status(400)
            .json({ error: `Missing required field: ${field}` });
        }
      }

      // Ensure the transactions table exists
      await ensureTransactionsTableExists();

      // Save the transaction to the database
      await saveTransaction(payload);

      // Respond with 200 to acknowledge receipt
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error processing Payfast notification:', error);
      res.status(500).json({ error: `Internal Server Error: ${error}` });
    }
  } else {
    // Reject non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
