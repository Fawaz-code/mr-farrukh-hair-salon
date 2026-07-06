import { Router } from "express";
import { db, pricingTable } from "../db";
import { SendChatMessageBody } from "../api-zod";

// ─── Static Knowledge Base ────────────────────────────────────────────────────

const SALON = {
  name: "Mr Farrukh Hair Saloon",
  location: "Ground Floor, Winston Mall, D-Block, B-17, Islamabad",
  phone: ["0320-5814165", "0347-7268791"],
  whatsapp: "+92 347 7268791",
  hours: {
    weekdays: "Monday to Saturday: 10:00 AM – 9:00 PM",
    sunday: "Sunday: 11:00 AM – 8:00 PM",
  },
  parking: "Free parking available at Winston Mall basement",
};

// ─── Types ────────────────────────────────────────────────────────────────────

type LivePricing = Record<string, Array<{ name: string; price: number }>>;

type Reply = { reply: string; suggestions: string[]; services: string[] };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(p: number): string {
  return `PKR ${p.toLocaleString()}/-`;
}

/** Build a category→items map from the live DB rows. */
async function fetchLivePricing(): Promise<LivePricing> {
  const rows = await db.select().from(pricingTable).orderBy(pricingTable.category, pricingTable.name);
  const map: LivePricing = {};
  for (const row of rows) {
    if (!map[row.category]) map[row.category] = [];
    map[row.category].push({ name: row.name, price: row.price });
  }
  return map;
}

/**
 * Search all live pricing items whose name or category contains any keyword.
 * Returns at most 8 results to keep replies concise.
 */
function findPrices(
  keywords: string[],
  pricing: LivePricing
): Array<{ category: string; name: string; price: number }> {
  const results: Array<{ category: string; name: string; price: number }> = [];
  for (const [category, items] of Object.entries(pricing)) {
    for (const item of items) {
      const haystack = `${category} ${item.name}`.toLowerCase();
      if (keywords.some(kw => kw.length > 3 && haystack.includes(kw))) {
        results.push({ category, ...item });
      }
    }
  }
  return results.slice(0, 8);
}

// ─── Intent Handlers ──────────────────────────────────────────────────────────

function buildReply(message: string, pricing: LivePricing): Reply {
  const msg = message.toLowerCase().trim();

  // ── Greeting ────────────────────────────────────────────────────────────────
  if (/^(hi|hello|hey|salam|salaam|assalam|aoa|good morning|good afternoon|good evening)\b/.test(msg)) {
    return {
      reply: `Welcome to ${SALON.name}! ✨\n\nI'm your AI Concierge, here to help 24/7. Ask me about:\n• Services & pricing\n• Opening hours & location\n• How to book an appointment\n• Treatment recommendations\n\nHow can I help you today?`,
      suggestions: ["View Services & Prices", "Book Appointment", "Location & Hours"],
      services: [],
    };
  }

  // ── Location / Address ───────────────────────────────────────────────────────
  if (/location|address|where (are|is)|find us|direction|how to get|b-17|winston|mall/.test(msg)) {
    return {
      reply: `📍 We are located at:\n**${SALON.location}**\n\nFree parking is available at the Winston Mall basement. Easily accessible from GT Road and the Islamabad Expressway.`,
      suggestions: ["Opening Hours", "Call Us", "Book Appointment"],
      services: [],
    };
  }

  // ── Hours / Timing ──────────────────────────────────────────────────────────
  if (/\bhour(s)?\b|timing|opening.?hour|what.?time.*open|when.*open|close.*time|closing|are.*open/.test(msg)) {
    return {
      reply: `🕐 Our opening hours are:\n\n• ${SALON.hours.weekdays}\n• ${SALON.hours.sunday}\n\nWalk-ins are welcome, but booking ahead guarantees your preferred slot!`,
      suggestions: ["Book Appointment", "Location", "Call Us"],
      services: [],
    };
  }

  // ── Contact / Phone ─────────────────────────────────────────────────────────
  if (/\bphone\b|call us|contact|our number|\breach\b/.test(msg)) {
    return {
      reply: `📞 You can reach us at:\n\n• ${SALON.phone[0]}\n• ${SALON.phone[1]}\n• WhatsApp: ${SALON.whatsapp}\n\nOur team typically responds within minutes!`,
      suggestions: ["WhatsApp Us", "Book Appointment", "Location"],
      services: [],
    };
  }

  // ── WhatsApp ────────────────────────────────────────────────────────────────
  if (/whatsapp|wa\.me|message us/.test(msg)) {
    return {
      reply: `💬 Our WhatsApp number is **${SALON.whatsapp}**.\n\nTap the WhatsApp button on the bottom-left of the page to open a direct chat instantly!`,
      suggestions: ["Book via WhatsApp", "Book Online", "Call Us"],
      services: [],
    };
  }

  // ── Booking / Appointment ────────────────────────────────────────────────────
  if (/\bbook\b|appoint|reserv|\bslot\b/.test(msg)) {
    return {
      reply: `📅 Booking is simple! Two options:\n\n1. **Online Form** — Use our Reservation page for a step-by-step guided booking.\n2. **WhatsApp** — Message us at ${SALON.whatsapp} and we'll confirm your slot within minutes.\n\nWalk-ins are also welcome based on availability!`,
      suggestions: ["Book Online Now", "WhatsApp Booking", "View Services"],
      services: [],
    };
  }

  // ── Parking ─────────────────────────────────────────────────────────────────
  if (/\bpark/.test(msg)) {
    return {
      reply: `🅿️ Free parking is available at the Winston Mall basement — no stress finding a spot!`,
      suggestions: ["Location", "Book Appointment", "Opening Hours"],
      services: [],
    };
  }

  // ── Specific service price lookups (using live pricing) ─────────────────────

  // Haircut
  if (/haircut|hair cut|cut.*hair|cutting/.test(msg)) {
    const items = pricing["HAIR"] ?? [];
    if (items.length === 0) {
      return { reply: "Sorry, I couldn't find haircut pricing right now. Please call us at 0320-5814165.", suggestions: ["Call Us"], services: [] };
    }
    return {
      reply: `✂️ Our hair cutting services:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nAll cuts include a professional wash and styling finish.`,
      suggestions: ["Book a Haircut", "View Full Price List", "Book Appointment"],
      services: items.map(i => i.name),
    };
  }

  // Styling / Hair-Do
  if (/\bstyl|hair.?do\b|fiber styl|blowdry|blow.?dry/.test(msg)) {
    const items = pricing["STYLES"] ?? [];
    return {
      reply: `💇 Our hair styling options:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nPerfect for events, parties, or a fresh everyday look!`,
      suggestions: ["Book Styling", "Book Appointment", "View Pricing"],
      services: items.map(i => i.name),
    };
  }

  // Beard (coloring handled separately below)
  if (/\bbeard\b|\bshave\b|\btrim\b|\bstubble\b/.test(msg) && !/color|colour|dye/.test(msg)) {
    const beard = pricing["BEARD"] ?? [];
    const beardColor = pricing["BEARD COLORING"] ?? [];
    return {
      reply: `🧔 Our beard services:\n\n**Beard Grooming:**\n${beard.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\n**Beard Coloring (all brands):**\n${beardColor.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}`,
      suggestions: ["Book Beard Service", "Book Appointment", "View Pricing"],
      services: ["Beard Grooming", "Beard Coloring"],
    };
  }

  // Beard coloring specifically
  if (/beard.*(color|colour|dye)|color.*beard/.test(msg)) {
    const items = pricing["BEARD COLORING"] ?? [];
    return {
      reply: `🎨 Our beard coloring services:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}`,
      suggestions: ["Book Beard Coloring", "Book Appointment", "View Pricing"],
      services: items.map(i => i.name),
    };
  }

  // Hydra Facial (specific — check before general facial)
  if (/hydra/.test(msg)) {
    const facial = pricing["FACIALS"] ?? [];
    const item = facial.find(i => i.name.toLowerCase().includes("hydra"));
    if (item) {
      return {
        reply: `✨ **Hydra Facial** — ${formatPrice(item.price)}\n\nOur most popular facial! It deeply cleanses, exfoliates, and hydrates your skin, targeting fine lines, congested pores, and dullness — leaving you with an instant glow. Suitable for all skin types.`,
        suggestions: ["Book Hydra Facial", "View All Facials", "Book Appointment"],
        services: ["Hydra Facial"],
      };
    }
  }

  // Facials / Skin treatments
  if (/\bfacial|\bskin\b|face treat|\bglow\b|\bacne\b|\bpore|\bcomplexion|whitening/.test(msg)) {
    const items = pricing["FACIALS"] ?? [];
    return {
      reply: `🌿 Our luxury facial treatments:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nOur therapists will recommend the perfect one for your skin type during consultation.`,
      suggestions: ["Book a Facial", "Book Appointment", "View Pricing"],
      services: items.map(i => i.name),
    };
  }

  // Keratin
  if (/\bkeratin\b/.test(msg)) {
    const items = (pricing["TEXTURE SERVICES"] ?? []).filter(i => /keratin/i.test(i.name));
    return {
      reply: `💎 Our **Keratin Treatment** options:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nEliminates frizz, adds shine, and keeps hair smooth for months. Perfect for damaged or curly hair.`,
      suggestions: ["Book Keratin Treatment", "View Texture Services", "Book Appointment"],
      services: ["Keratin Treatment"],
    };
  }

  // Hair Botox
  if (/hair.?botox|botox/.test(msg)) {
    const items = (pricing["TEXTURE SERVICES"] ?? []).filter(i => /botox/i.test(i.name));
    return {
      reply: `✨ Our **Hair Botox** treatments:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nA deep conditioning treatment that repairs damage, reduces frizz, and restores softness — without altering your hair's natural texture.`,
      suggestions: ["Book Hair Botox", "View Texture Services", "Book Appointment"],
      services: ["Hair Botox"],
    };
  }

  // Texture / Perm / Smoothing
  if (/\btexture\b|\bsmooth\b|\bfrizz\b|\bperm\b|\brebond\b|\bstraighten/.test(msg)) {
    const texture = pricing["TEXTURE SERVICES"] ?? [];
    const perm = pricing["PERM SERVICES"] ?? [];
    return {
      reply: `💫 Our texture & smoothing services:\n\n**Texture Services:**\n${texture.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\n**Perm Services:**\n${perm.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}`,
      suggestions: ["Book Treatment", "View Pricing", "Book Appointment"],
      services: ["Hair Botox", "Hair Keratin", "Hair Perming"],
    };
  }

  // Protein / Dandruff / Treatments
  if (/\bprotein\b|\bdandruff\b|\btreatment\b|\bdamaged hair\b|\bdry hair\b|\bshine enhance\b/.test(msg)) {
    const items = pricing["TREATMENTS"] ?? [];
    return {
      reply: `🌱 Our hair treatments:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nOur stylists will assess your hair and recommend the best treatment for you.`,
      suggestions: ["Book Treatment", "View Pricing", "Book Appointment"],
      services: items.map(i => i.name),
    };
  }

  // Hair Coloring
  if (/\bcolor\b|\bcolour\b|\bhighlight\b|\bdye\b|\bbalayage\b|\ombre\b|loreal|keune|garnier|revlon|olivia|adore/.test(msg) && !/beard/.test(msg)) {
    const items = pricing["HAIR COLORING"] ?? [];
    return {
      reply: `🎨 Our hair coloring by brand:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nWe also offer full coloring, highlights, balayage, and ombre. Our colorists will find the perfect shade!`,
      suggestions: ["Book Hair Coloring", "View Gallery", "Book Appointment"],
      services: ["Hair Coloring"],
    };
  }

  // Massage
  if (/\bmassage\b|\brelax\b|\bstress\b/.test(msg)) {
    const items = pricing["MASSAGE"] ?? [];
    return {
      reply: `🧘 Our massage services:\n\n${items.map(i => `• ${i.name} Massage — ${formatPrice(i.price)}`).join("\n")}\n\nAll massages are performed by trained therapists for full relaxation.`,
      suggestions: ["Book Massage", "Book Appointment", "View All Services"],
      services: items.map(i => `${i.name} Massage`),
    };
  }

  // Polisher / Scrub / Mask
  if (/\bpolish\b|\bscrub\b|\bexfoliat\b|\bmask\b/.test(msg)) {
    const items = pricing["POLISHER"] ?? [];
    return {
      reply: `✨ Our polishing & skin treatments:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nDeeply exfoliate, brighten, and smooth your skin for a refreshed finish.`,
      suggestions: ["Book Polisher", "Book Appointment", "View Pricing"],
      services: items.map(i => i.name),
    };
  }

  // Wax
  if (/\bwax\b|\bwaxing\b/.test(msg)) {
    const items = pricing["WAX"] ?? [];
    return {
      reply: `🌿 Our waxing services:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}`,
      suggestions: ["Book Waxing", "Book Appointment", "View Pricing"],
      services: items.map(i => i.name),
    };
  }

  // Nails / Manicure / Pedicure
  if (/\bnail\b|\bmanicure\b|\bpedicure\b|\bmani\b|\bpedi\b/.test(msg)) {
    const items = pricing["NAIL CARE"] ?? [];
    return {
      reply: `💅 Our nail care services:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nOur nail technicians provide thorough care to keep your hands and feet flawless.`,
      suggestions: ["Book Nail Care", "Book Appointment", "View Pricing"],
      services: ["Manicure", "Pedicure"],
    };
  }

  // Party Grooming
  if (/\bgrooming\b|\bparty\b|\bevent\b|\boccasion\b/.test(msg)) {
    const items = pricing["GROOMING"] ?? [];
    return {
      reply: `🎉 Our grooming packages:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nPerfect for weddings, events, or any special occasion. You'll look your absolute best!`,
      suggestions: ["Book Party Grooming", "Book Appointment", "WhatsApp Us"],
      services: ["Party Grooming"],
    };
  }

  // Bridal / Wedding
  if (/\bbridal\b|\bbride\b|\bwedding\b|\bnikah\b|\bshadi\b|\bbarat\b|\bvalima\b/.test(msg)) {
    return {
      reply: `👑 We offer a complete **Bridal Grooming Package** — hair styling, facials, skin treatments, and more.\n\nFor a customised package tailored to your requirements, contact us:\n📞 ${SALON.phone[0]}\n💬 WhatsApp: ${SALON.whatsapp}`,
      suggestions: ["WhatsApp for Bridal Package", "Call Us", "View Services"],
      services: ["Party Grooming", "Hydra Facial"],
    };
  }

  // Price / Cost (general) ── live DB lookup
  if (/\bprice\b|\bcost\b|\brate\b|\bcharge\b|\bpkr\b|\brupee\b|\bfee\b|how much|kitna/.test(msg)) {
    // Try to find specific service matches from the query
    const words = msg.split(/\s+/);
    const matches = findPrices(words, pricing);

    if (matches.length > 0 && matches.length <= 6) {
      return {
        reply: `Here are the prices I found:\n\n${matches.map(i => `• ${i.name} (${i.category}) — ${formatPrice(i.price)}`).join("\n")}\n\nFor the full list, visit our Pricing page!`,
        suggestions: ["View Full Price List", "Book Appointment", "View Services"],
        services: [],
      };
    }

    // General pricing highlights from live DB
    const hairItems = pricing["HAIR"] ?? [];
    const facialItems = pricing["FACIALS"] ?? [];
    const beardItems = pricing["BEARD"] ?? [];
    const groomItems = pricing["GROOMING"] ?? [];
    const nailItems = pricing["NAIL CARE"] ?? [];

    const highlights = [
      hairItems[0] ? `${hairItems[0].name} — ${formatPrice(hairItems[0].price)}` : null,
      facialItems[0] ? `Hydra Facial — ${formatPrice(facialItems[0].price)}` : null,
      beardItems[0] ? `Beard — ${formatPrice(beardItems[0].price)}` : null,
      groomItems[0] ? `${groomItems[0].name} — ${formatPrice(groomItems[0].price)}` : null,
      nailItems[0] ? `${nailItems[0].name} — ${formatPrice(nailItems[0].price)}` : null,
    ].filter(Boolean);

    return {
      reply: `Here are some popular service prices:\n\n${highlights.map(h => `• ${h}`).join("\n")}\n\nFor the complete list, visit our **Pricing** page. Prices may vary slightly based on hair length and treatment complexity.`,
      suggestions: ["View Full Price List", "Book Appointment", "Contact Us"],
      services: [],
    };
  }

  // Services overview
  if (/\bservice\b|\boffer\b|do you (have|provide|do)|what.*do you|\btreatment\b/.test(msg)) {
    return {
      reply: `We offer a full range of luxury grooming services at ${SALON.name}:\n\n💇 **Hair** — Cuts, Styling, Coloring, Botox, Keratin, Perming, Treatments\n🧔 **Beard** — Grooming, Cleansing, Coloring\n🌿 **Skin** — Hydra Facial, HI Lift, Thalgo, Janssen, Dermacos & more\n✨ **Polisher** — Face, Arms, Hands, Feet, Masks\n🧘 **Massage** — Head, Shoulder, Back, Full Upper\n💅 **Nail Care** — Manicure & Pedicure\n💆 **Waxing** — Face, Neck, Ears, Cheeks\n🎉 **Grooming** — Party & Event Packages\n\nAll services available for both ladies and gents!`,
      suggestions: ["View Pricing", "Book Appointment", "Location & Hours"],
      services: [],
    };
  }

  // Default fallback
  return {
    reply: `I'm not quite sure I understood — could you try rephrasing? You can ask me:\n\n• "How much is a Hydra Facial?"\n• "Do you offer keratin treatment?"\n• "What are your opening hours?"\n• "How do I book an appointment?"\n\nOr contact us directly at **${SALON.phone[0]}** or WhatsApp **${SALON.whatsapp}**.`,
    suggestions: ["View Services", "Book Appointment", "Location & Hours", "Pricing"],
    services: [],
  };
}

// ─── Route ────────────────────────────────────────────────────────────────────

const router = Router();

router.post("/", async (req, res) => {
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }

  // Fetch live pricing from DB — always in sync with the Pricing page
  const livePricing = await fetchLivePricing();
  const { reply, suggestions, services } = buildReply(parsed.data.message, livePricing);
  res.json({ reply, suggestions, services });
});

export default router;
