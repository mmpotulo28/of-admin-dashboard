// import { ensureErrorLogsExist } from './db';

export interface iErrorLogOptions {
  status?: string;
  source?: string;
  severity?: string;
  user_id?: string;
  request_path?: string;
  request_method?: string;
  environment?: string;
  application?: string;
  raw_json?: any;
}

/**
 * Logger class for error logging
 */
export class Logger {
  /**
   * Logs an error to the database and to the console.
   * @param error - The error object or message.
   * @param options - Additional metadata for the error log.
   */
  static async error(
    error: Error | string | unknown,
    options?: iErrorLogOptions
  ) {
    // Log to console
    console.error('Logger.error:', error);

    // Ensure the error_logs table exists

    // await ensureErrorLogsExist();

    // Prepare error details
    let name = 'Error';
    let error_message = '';
    let stack_trace: string | null = null;
    let raw_json = options?.raw_json || null;

    if (typeof error === 'string') {
      error_message = error;
      raw_json = raw_json || error;
    } else if (error instanceof Error) {
      name = error.name;
      error_message = error.message;
      stack_trace = error.stack || null;
      raw_json = raw_json || error;
    } else if (typeof error === 'object' && error !== null) {
      // Try to extract message and name if present
      name = (error as any).name || 'Error';
      error_message = (error as any).message || JSON.stringify(error);
      stack_trace = (error as any).stack || null;
      raw_json = raw_json || error;
    } else {
      error_message = String(error);
      raw_json = raw_json || error;
    }

    // Insert error log into the database
    try {
      // await pool.query(
      //   `
      //  INSERT INTO public.error_logs
      //    (status, name, error_message, raw_json, source, severity, user_id, request_path, request_method, stack_trace, environment, application)
      //  VALUES
      //    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      //  `,
      //   [
      //     options?.status || 'error',
      //     name,
      //     error_message,
      //     raw_json ? JSON.stringify(raw_json) : null,
      //     options?.source || null,
      //     options?.severity || null,
      //     options?.user_id || null,
      //     options?.request_path || null,
      //     options?.request_method || null,
      //     stack_trace,
      //     options?.environment || process.env.NODE_ENV || null,
      //     options?.application || 'onlyfriends-ticket',
      //   ]
      // );

      console.log('Error logged to DB:', {
        status: options?.status || 'error',
        name,
        error_message,
        raw_json: raw_json ? JSON.stringify(raw_json) : null,
        source: options?.source || null,
        severity: options?.severity || null,
        user_id: options?.user_id || null,
        request_path: options?.request_path || null,
        request_method: options?.request_method || null,
        stack_trace,
        environment: options?.environment || process.env.NODE_ENV || null,
        application: options?.application || 'onlyfriends-ticket',
      });
    } catch (dbError) {
      // If logging to DB fails, log that error to console
      console.error('Logger DB insert failed:', dbError);
    }
  }
}
