import { Pool, PoolClient } from 'pg';

export interface iMessage {
  id?: number;
  eventId: number;
  content: string;
  timestamp?: Date;
  sender: string;
  senderName: string;
  readReceipts?: string;
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 60000, // Increased timeout to 60 seconds
  idleTimeoutMillis: 30000, // Timeout for idle clients
  max: 10, // Maximum number of clients in the pool
  ssl: {
    rejectUnauthorized: false,
  },
  log(...messages) {
    console.log('Database Pool Log:', ...messages);
  },
});

/**
 * Tests the database connection with a retry mechanism.
 * Retries up to 3 times with a delay of 2 seconds between attempts.
 */
export async function testDatabaseConnection(retryCount = 0): Promise<void> {
  try {
    const client = await pool.connect();
    console.log('Database connection successful');
    client.release();
  } catch (error) {
    console.error(
      `Database connection attempt ${retryCount + 1} failed:`,
      error
    );

    if (retryCount < 2) {
      console.warn('Retrying database connection...');
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
      return testDatabaseConnection(retryCount + 1);
    }

    console.error('All database connection attempts failed');
    throw error;
  }
}

/**
 * Ensures that the "Message" table exists in the database. If the table does not exist,
 * it creates the table with the following columns:
 * - id: A unique identifier for each message (primary key, auto-incremented).
 * - eventId: An integer representing the associated event (not null).
 * - content: The text content of the message (not null).
 * - timestamp: The time when the message was created (defaults to the current time).
 * - sender: The identifier of the sender (not null).
 * - senderName: The name of the sender (not null).
 * - readReceipts: A text field to store read receipts (optional).
 *
 * @returns {Promise<void>} A promise that resolves when the table creation query is executed.
 */
export async function ensureTableExists(): Promise<void> {
  let client: PoolClient;
  try {
    client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Message" (
        "id" SERIAL PRIMARY KEY,
        "eventId" INTEGER NOT NULL,
        "content" TEXT NOT NULL,
        "timestamp" TIMESTAMP DEFAULT NOW(),
        "sender" TEXT NOT NULL,
        "senderName" TEXT NOT NULL,
        "readReceipts" TEXT
      );
    `);
    client.release();
  } catch (error) {
    console.error('Error ensuring table exists', error);
  }
}

/**
 * Ensures that the "transactions" table exists in the database.
 */
export async function ensureTransactionsTableExists(): Promise<void> {
  let client: PoolClient;
  try {
    client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS "transactions" (
        "id" SERIAL PRIMARY KEY,
        "m_payment_id" TEXT,
        "pf_payment_id" TEXT NOT NULL,
        "payment_status" TEXT NOT NULL,
        "item_name" TEXT NOT NULL,
        "item_description" TEXT,
        "amount_gross" NUMERIC,
        "amount_fee" NUMERIC,
        "amount_net" NUMERIC,
        "custom_str1" TEXT,
        "custom_str2" TEXT,
        "custom_str3" TEXT,
        "custom_str4" TEXT,
        "custom_str5" TEXT,
        "custom_int1" INTEGER,
        "custom_int2" INTEGER,
        "custom_int3" INTEGER,
        "custom_int4" INTEGER,
        "custom_int5" INTEGER,
        "name_first" TEXT,
        "name_last" TEXT,
        "email_address" TEXT,
        "merchant_id" TEXT NOT NULL,
        "signature" TEXT,
        "created_at" TIMESTAMP DEFAULT NOW()
      );
    `);
    client.release();
  } catch (error) {
    console.error('Error ensuring transactions table exists', error);
  }
}

/**
 * Ensures the `emails` table exists in the database.
 * Creates the table if it does not exist.
 */
export const ensureEmailsTableExists = async (): Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS emails (
      id SERIAL PRIMARY KEY,
      from_email VARCHAR(255) NOT NULL,
      to_email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      status VARCHAR(50) NOT NULL CHECK (status IN ('sent', 'draft')),
      sender_id VARCHAR(255) NOT NULL,
      service_name VARCHAR(255) NOT NULL,
      date_sent TIMESTAMP,
      last_updated TIMESTAMP NOT NULL
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Emails table ensured to exist.');
  } catch (error) {
    console.error('Error ensuring emails table exists:', error);
    throw new Error('Failed to ensure emails table exists.');
  }
};

/**
 * Ensures the error_logs table exists in the database
 */
export async function ensureErrorLogsExist() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.error_logs (
      id SERIAL PRIMARY KEY,
      status TEXT NOT NULL,
      name TEXT NOT NULL,
      error_message TEXT NOT NULL,
      raw_json JSONB,
      timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      source TEXT,
      severity TEXT,
      user_id TEXT,
      request_path TEXT,
      request_method TEXT,
      stack_trace TEXT,
      environment TEXT,
      application TEXT
      );
    `);
    console.log('Error logs table ensured to exist.');
  } catch (error) {
    console.error('Error ensuring error logs table exists:', error);
    throw new Error('Failed to ensure error logs table exists.');
  }
}

/**
 * Saves a transaction to the "transactions" table.
 */
export async function saveTransaction(
  transaction: Record<string, any>
): Promise<void> {
  const client = await pool.connect();
  try {
    console.log('saving transaction', transaction);
    // Ensure the transactions table exists
    await client.query(
      `INSERT INTO "transactions" (
        "m_payment_id", "pf_payment_id", "payment_status", "item_name", "item_description",
        "amount_gross", "amount_fee", "amount_net", "custom_str1", "custom_str2",
        "custom_str3", "custom_str4", "custom_str5", "custom_int1", "custom_int2",
        "custom_int3", "custom_int4", "custom_int5", "name_first", "name_last",
        "email_address", "merchant_id", "signature"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
      )`,
      [
        transaction.m_payment_id,
        transaction.pf_payment_id,
        transaction.payment_status,
        transaction.item_name,
        transaction.item_description,
        transaction.amount_gross,
        transaction.amount_fee,
        transaction.amount_net,
        transaction.custom_str1,
        transaction.custom_str2,
        transaction.custom_str3,
        transaction.custom_str4,
        transaction.custom_str5,
        transaction.custom_int1,
        transaction.custom_int2,
        transaction.custom_int3,
        transaction.custom_int4,
        transaction.custom_int5,
        transaction.name_first,
        transaction.name_last,
        transaction.email_address,
        transaction.merchant_id,
        transaction.signature,
      ]
    );
  } catch (error) {
    console.error('Error saving transaction', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Retrieves all messages associated with a specific event, ordered by timestamp.
 *
 * @param {number} eventId - The ID of the event to retrieve messages for.
 * @returns {Promise<iMessage[]>} A promise that resolves to an array of messages.
 */
export async function getMessages(eventId: number): Promise<iMessage[]> {
  try {
    const client = await pool.connect();
    const result = await client.query<iMessage>(
      `SELECT * FROM "Message" WHERE "eventId" = $1 ORDER BY "timestamp" ASC`,
      [eventId]
    );
    client.release();
    return result.rows;
  } catch (error) {
    throw new Error(`getMessage: ${(error as Error).message}`);
  }
}

/**
 * Sends a message by inserting it into the "Message" table.
 *
 * @param {iMessage} message - The message object containing eventId, content, sender, and senderName.
 * @returns {Promise<iMessage>} A promise that resolves to the inserted message.
 * @throws {Error} If the message insertion fails.
 */
export async function sendMessage(message: iMessage): Promise<iMessage> {
  const client = await pool.connect();
  try {
    const results = await client.query<iMessage>(
      `INSERT INTO "Message" ("eventId", "content", "sender", "senderName")
       VALUES ($1, $2, $3, $4)`,
      [message.eventId, message.content, message.sender, message.senderName]
    );

    if (results.rowCount !== 1) {
      throw new Error('Failed to insert message');
    }

    return results.rows[0];
  } finally {
    client.release();
  }
}
