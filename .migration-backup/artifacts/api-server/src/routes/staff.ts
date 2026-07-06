import { Router } from "express";
import { db } from "@workspace/db";
import { staffTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateStaffMemberBody,
  UpdateStaffMemberBody,
  UpdateStaffMemberParams,
  DeleteStaffMemberParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (_req, res) => {
  const rows = await db.select().from(staffTable).orderBy(staffTable.name);
  res.json(rows);
});

router.post("/", async (req, res) => {
  const parsed = CreateStaffMemberBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const [row] = await db.insert(staffTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.patch("/:id", async (req, res) => {
  const params = UpdateStaffMemberParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = UpdateStaffMemberBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const [row] = await db.update(staffTable).set(body.data).where(eq(staffTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/:id", async (req, res) => {
  const params = DeleteStaffMemberParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(staffTable).where(eq(staffTable.id, params.data.id));
  res.status(204).end();
});

export default router;
