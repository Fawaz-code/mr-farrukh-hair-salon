import { Router } from "express";
import { db } from "@workspace/db";
import { galleryTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateGalleryItemBody,
  UpdateGalleryItemBody,
  UpdateGalleryItemParams,
  DeleteGalleryItemParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (_req, res) => {
  const rows = await db.select().from(galleryTable).orderBy(galleryTable.category);
  res.json(rows);
});

router.post("/", async (req, res) => {
  const parsed = CreateGalleryItemBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const [row] = await db.insert(galleryTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.patch("/:id", async (req, res) => {
  const params = UpdateGalleryItemParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const body = UpdateGalleryItemBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const [row] = await db.update(galleryTable).set(body.data).where(eq(galleryTable.id, params.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/:id", async (req, res) => {
  const params = DeleteGalleryItemParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(galleryTable).where(eq(galleryTable.id, params.data.id));
  res.status(204).end();
});

export default router;
