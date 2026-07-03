import { Router } from "express";
import { db } from "@workspace/db";
import { pricingTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreatePricingItemBody,
  UpdatePricingItemBody,
  UpdatePricingItemParams,
  DeletePricingItemParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (_req, res) => {
  const rows = await db.select().from(pricingTable).orderBy(pricingTable.category, pricingTable.name);
  res.json(rows);
});

router.post("/", async (req, res) => {
  const parsed = CreatePricingItemBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const [row] = await db.insert(pricingTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.patch("/:id", async (req, res) => {
  const params = UpdatePricingItemParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = UpdatePricingItemBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const [row] = await db.update(pricingTable).set(body.data).where(eq(pricingTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/:id", async (req, res) => {
  const params = DeletePricingItemParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(pricingTable).where(eq(pricingTable.id, params.data.id));
  res.status(204).end();
});

export default router;
