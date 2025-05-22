import {
  ensureTableExists,
  getMessages,
  iMessage,
  pool,
  sendMessage,
} from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * API handler for managing chat messages.
 *
 * This handler supports both sending and receiving messages for a specific event.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 *
 * @returns A promise that resolves to the HTTP response.
 *
 * @remarks
 * - For `POST` requests, it expects the body to contain `eventId`, `content`, `sender`, and `senderName`.
 * - For `GET` requests, it expects the query to contain `eventId`.
 *
 * @throws Will return a 400 status code if required fields are missing.
 * @throws Will return a 500 status code if there is an error interacting with the database.
 *
 * @example
 * // Sending a message
 * fetch('/api/chat/messages', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     eventId: 1,
 *     content: 'Hello, world!',
 *     sender: 'user123',
 *     senderName: 'John Doe'
 *   })
 * });
 *
 * @example
 * // Receiving messages
 * fetch('/api/chat/messages?eventId=1')
 *   .then(response => response.json())
 *   .then(messages => console.log(messages));
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureTableExists();

  if (req.method === 'POST') {
    // Handle sending a message
    const { eventId, content, sender, senderName } = req.body;

    if (!eventId || !content || !sender || !senderName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const client = await pool.connect();
      try {
        const newMessage: iMessage = await sendMessage({
          eventId,
          content,
          sender,
          senderName,
          timestamp: new Date(),
        });

        return res.status(201).json(newMessage);
      } finally {
        client.release();
      }
    } catch (error) {
      return res.status(500).json({
        error: `Failed to send message - ${(error as Error).message}`,
      });
    }
  } else if (req.method === 'GET') {
    // Handle receiving messages
    const { eventId } = req.query;

    if (!eventId) {
      return res.status(400).json({ error: 'Missing eventId' });
    }

    try {
      const client = await pool.connect();
      try {
        const messages = await getMessages(Number(eventId));
        return res.status(200).json(messages);
      } finally {
        client.release();
      }
    } catch (error) {
      return res.status(500).json({
        error: `Failed to retrieve messages - ${(error as Error).message}`,
      });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
