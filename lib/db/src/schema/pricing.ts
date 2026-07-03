import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pricingTable = pgTable("pricing", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  unit: text("unit"),
  popular: boolean("popular").notNull().default(false),
});

export const insertPricingSchema = createInsertSchema(pricingTable).omit({ id: true });
export type InsertPricing = z.infer<typeof insertPricingSchema>;
export type PricingItem = typeof pricingTable.$inferSelect;
