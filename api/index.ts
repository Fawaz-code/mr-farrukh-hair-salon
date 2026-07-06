/**
 * Vercel serverless function entry point.
 * Exports the Express app as the default handler — Vercel treats any function
 * matching (req: IncomingMessage, res: ServerResponse) as a valid handler.
 *
 * All /api/* requests are rewritten to this file via vercel.json.
 */
import app from '../server/app.js';

export default app;
