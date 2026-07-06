import { type Request, type Response, type NextFunction } from "express";

/**
 * Middleware that guards admin-only routes.
 *
 * Clients must pass the header:
 *   X-Admin-Secret: <value of SESSION_SECRET env var>
 *
 * Public read endpoints (GET /services, GET /pricing, etc.) are NOT protected —
 * only mutations (POST/PATCH/DELETE) on content-management routes are guarded here.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const adminSecret = process.env.SESSION_SECRET;

  if (!adminSecret) {
    // If the secret is not configured, block all admin access.
    res.status(500).json({ error: "Server is not configured for admin access" });
    return;
  }

  const provided = req.headers["x-admin-secret"];

  if (!provided || provided !== adminSecret) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
