import { Router } from "express";
import { db } from "@workspace/db";
import { contactTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  SubmitContactBody,
  DeleteContactMessageParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (_req, res) => {
  const rows = await db.select().from(contactTable).orderBy(contactTable.createdAt);
  res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.post("/", async (req, res) => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const [row] = await db.insert(contactTable).values({ ...parsed.data, read: false }).returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/:id", async (req, res) => {
  const params = DeleteContactMessageParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(contactTable).where(eq(contactTable.id, params.data.id));
  res.status(204).end();
});

export default router;
