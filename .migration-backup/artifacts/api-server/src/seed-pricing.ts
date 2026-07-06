/**
 * Run with: pnpm --filter @workspace/api-server exec tsx src/seed-pricing.ts
 * Clears the pricing table and re-seeds with the official price list.
 */
import { db, pricingTable } from "@workspace/db";

const PRICING: Array<{ name: string; category: string; price: number; unit?: string; popular?: boolean }> = [
  // HAIR
  { category: "HAIR", name: "Regular Hair Cut (Wash & Styling)", price: 1300, popular: true },
  { category: "HAIR", name: "Kids Hair Cut", price: 700 },

  // STYLES
  { category: "STYLES", name: "Regular Styling", price: 500 },
  { category: "STYLES", name: "Fiber Styling", price: 500 },
  { category: "STYLES", name: "Hair-Do", price: 500 },

  // BEARD
  { category: "BEARD", name: "Beard", price: 700, popular: true },
  { category: "BEARD", name: "Cleansing & Scrubbing", price: 1500 },

  // BEARD COLORING
  { category: "BEARD COLORING", name: "Keune", price: 1500 },
  { category: "BEARD COLORING", name: "L'Oréal", price: 1500 },
  { category: "BEARD COLORING", name: "Just For Men", price: 1500 },

  // TREATMENTS
  { category: "TREATMENTS", name: "Protein Dose", price: 3000, popular: true },
  { category: "TREATMENTS", name: "Dandruff Control", price: 3000 },
  { category: "TREATMENTS", name: "Shine Enhance", price: 3500 },

  // TEXTURE SERVICES
  { category: "TEXTURE SERVICES", name: "Long Hair Botox", price: 18000 },
  { category: "TEXTURE SERVICES", name: "Top Hair Botox", price: 10000 },
  { category: "TEXTURE SERVICES", name: "Long Hair Keratin", price: 18000 },
  { category: "TEXTURE SERVICES", name: "Top Hair Keratin", price: 10000 },

  // PERM SERVICES
  { category: "PERM SERVICES", name: "Long Hair Perming", price: 12000 },
  { category: "PERM SERVICES", name: "Top Hair Perming", price: 8000 },

  // HAIR COLORING
  { category: "HAIR COLORING", name: "Revlon", price: 2000 },
  { category: "HAIR COLORING", name: "G.K", price: 2000 },
  { category: "HAIR COLORING", name: "Olivia", price: 1200 },
  { category: "HAIR COLORING", name: "Adore", price: 1200 },
  { category: "HAIR COLORING", name: "Garnier", price: 2000 },
  { category: "HAIR COLORING", name: "L'Oréal", price: 2000 },
  { category: "HAIR COLORING", name: "Just For Men", price: 2500 },
  { category: "HAIR COLORING", name: "Apple", price: 2000 },
  { category: "HAIR COLORING", name: "Keune", price: 2500 },

  // FACIALS
  { category: "FACIALS", name: "Hydra Facial", price: 12000, popular: true },
  { category: "FACIALS", name: "HI Lift", price: 5000 },
  { category: "FACIALS", name: "Dr. Derma", price: 7000 },
  { category: "FACIALS", name: "Thalgo", price: 8000 },
  { category: "FACIALS", name: "Janssen", price: 10000 },
  { category: "FACIALS", name: "Dermaclear Medicated", price: 8000 },
  { category: "FACIALS", name: "Skin Care", price: 4000 },
  { category: "FACIALS", name: "Dermacos", price: 7000 },

  // POLISHER
  { category: "POLISHER", name: "Face", price: 1000 },
  { category: "POLISHER", name: "Arms", price: 1500 },
  { category: "POLISHER", name: "Hands", price: 1000 },
  { category: "POLISHER", name: "Feet", price: 2000 },
  { category: "POLISHER", name: "Neck", price: 1000 },
  { category: "POLISHER", name: "Black Mask", price: 500 },
  { category: "POLISHER", name: "Mud Mask", price: 500 },

  // MASSAGE
  { category: "MASSAGE", name: "Head", price: 500 },
  { category: "MASSAGE", name: "Shoulder", price: 500 },
  { category: "MASSAGE", name: "Back", price: 500 },
  { category: "MASSAGE", name: "Full Upper", price: 1000 },

  // NAIL CARE
  { category: "NAIL CARE", name: "Manicure / Pedicure", price: 5000, popular: true },

  // GROOMING
  { category: "GROOMING", name: "Party Grooming (Cleansing & Scrubbing)", price: 4000, popular: true },

  // WAX
  { category: "WAX", name: "Cheeks", price: 500 },
  { category: "WAX", name: "Forehead", price: 500 },
  { category: "WAX", name: "Ear", price: 500 },
  { category: "WAX", name: "Neck", price: 1000 },
  { category: "WAX", name: "Full Face Wax", price: 1000 },
];

async function seed() {
  console.log("Clearing existing pricing data...");
  await db.delete(pricingTable);
  console.log("Inserting new pricing data...");
  await db.insert(pricingTable).values(PRICING);
  console.log(`✅ Seeded ${PRICING.length} pricing items across ${[...new Set(PRICING.map(p => p.category))].length} categories.`);
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
