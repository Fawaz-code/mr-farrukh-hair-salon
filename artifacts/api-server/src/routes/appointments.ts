import { Router } from "express";
import { db } from "@workspace/db";
import { appointmentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateAppointmentBody,
  UpdateAppointmentBody,
  UpdateAppointmentParams,
  DeleteAppointmentParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../lib/adminAuth";

const router = Router();

// Admin-only: list all appointments
router.get("/", requireAdmin, async (req, res) => {
  const rows = await db.select().from(appointmentsTable).orderBy(appointmentsTable.createdAt);
  res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

// Public: anyone can submit a booking
router.post("/", async (req, res) => {
  const parsed = CreateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [row] = await db.insert(appointmentsTable).values({ ...parsed.data, status: "pending" }).returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

// Admin-only: update or delete appointments
router.patch("/:id", requireAdmin, async (req, res) => {
  const params = UpdateAppointmentParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = UpdateAppointmentBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const [row] = await db
    .update(appointmentsTable)
    .set(body.data)
    .where(eq(appointmentsTable.id, params.data.id))
    .returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const params = DeleteAppointmentParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(appointmentsTable).where(eq(appointmentsTable.id, params.data.id));
  res.status(204).end();
});

export default router;
