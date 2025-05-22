import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { pool, ensureEmailsTableExists } from '@/lib/db';
import { Logger } from '@/lib/logger'; // Import Logger

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { to, subject, html, senderId, serviceName } = req.body;

  // Accept both string and array for backward compatibility
  if (!to || !subject || !html || !senderId || !serviceName) {
    return res.status(400).json({
      error:
        'Missing required fields: to, subject, html, senderId, serviceName',
    });
  }

  // Ensure 'to' is an array
  const toList = Array.isArray(to) ? to : [to];

  try {
    await ensureEmailsTableExists();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_SERVER_USER,
        pass: process.env.MAIL_SERVER_PASS,
      },
    });

    const results: { to: string; status: string; error?: string }[] = [];

    for (const recipient of toList) {
      // Insert email into the database
      const emailInsertQuery = `
        INSERT INTO emails (from_email, to_email, subject, body, status, sender_id, service_name, date_sent, last_updated)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING id;
      `;
      const { rows } = await pool.query(emailInsertQuery, [
        process.env.NEXT_PUBLIC_SYSTEM_EMAIL,
        recipient,
        subject,
        html,
        'draft',
        senderId,
        serviceName,
      ]);
      const emailId = rows[0].id;

      const mailOptions = {
        from: process.env.NEXT_PUBLIC_SYSTEM_EMAIL,
        to: recipient,
        subject,
        html,
      };

      try {
        await transporter.sendMail(mailOptions);

        // Update email status to 'sent'
        const updateQuery = `
          UPDATE emails
          SET status = $1, date_sent = NOW(), last_updated = NOW()
          WHERE id = $2;
        `;
        await pool.query(updateQuery, ['sent', emailId]);
        results.push({ to: recipient, status: 'sent' });
      } catch (sendError) {
        // Log error with Logger
        await Logger.error(sendError, {
          source: 'email/send.ts',
          severity: 'error',
          user_id: senderId,
          request_path: req.url,
          request_method: req.method,
          application: 'onlyfriends-ticket',
          raw_json: JSON.stringify(sendError),
        });
        // Update email status to 'failed'
        const updateQuery = `
          UPDATE emails
          SET status = $1, last_updated = NOW()
          WHERE id = $2;
        `;
        await pool.query(updateQuery, ['failed', emailId]);
        results.push({
          to: recipient,
          status: 'failed',
          error:
            sendError instanceof Error ? sendError.message : String(sendError),
        });
      }
    }

    return res.status(200).json({ message: 'Emails processed', results });
  } catch (error) {
    // Log error with Logger
    await Logger.error(error, {
      source: 'email/send.ts',
      severity: 'critical',
      user_id: senderId,
      request_path: req.url,
      request_method: req.method,
      application: 'onlyfriends-ticket',
      raw_json: JSON.stringify(error),
    });
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res
      .status(500)
      .json({ error: `Failed to send emails: ${errorMessage}` });
  }
}
