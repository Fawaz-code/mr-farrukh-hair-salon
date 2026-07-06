import { Router } from "express";
import { db } from "../db";
import { servicesTable } from "../db";
import { eq } from "drizzle-orm";
import {
  CreateServiceBody,
  UpdateServiceBody,
  UpdateServiceParams,
  DeleteServiceParams,
} from "../api-zod";
import { requireAdmin } from "../lib/adminAuth";

const router = Router();

// Public: anyone can read services
router.get("/", async (_req, res) => {
  const rows = await db.select().from(servicesTable).orderBy(servicesTable.category, servicesTable.name);
  res.json(rows);
});

// Admin-only mutations
router.post("/", requireAdmin, async (req, res) => {
  const parsed = CreateServiceBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const [row] = await db.insert(servicesTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.patch("/:id", requireAdmin, async (req, res) => {
  const params = UpdateServiceParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = UpdateServiceBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const [row] = await db.update(servicesTable).set(body.data).where(eq(servicesTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const params = DeleteServiceParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(servicesTable).where(eq(servicesTable.id, params.data.id));
  res.status(204).end();
});

export default router;
