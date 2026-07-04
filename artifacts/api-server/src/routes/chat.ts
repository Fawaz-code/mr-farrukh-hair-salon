import { Router } from "express";
import { SendChatMessageBody } from "@workspace/api-zod";

// ─── Complete Salon Knowledge Base ────────────────────────────────────────────
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

// Exact official price list
const PRICING: Record<string, Array<{ name: string; price: number }>> = {
  "HAIR": [
    { name: "Regular Hair Cut (Wash & Styling)", price: 1300 },
    { name: "Kids Hair Cut", price: 700 },
  ],
  "STYLES": [
    { name: "Regular Styling", price: 500 },
    { name: "Fiber Styling", price: 500 },
    { name: "Hair-Do", price: 500 },
  ],
  "BEARD": [
    { name: "Beard", price: 700 },
    { name: "Cleansing & Scrubbing", price: 1500 },
  ],
  "BEARD COLORING": [
    { name: "Keune", price: 1500 },
    { name: "L'Oréal", price: 1500 },
    { name: "Just For Men", price: 1500 },
  ],
  "TREATMENTS": [
    { name: "Protein Dose", price: 3000 },
    { name: "Dandruff Control", price: 3000 },
    { name: "Shine Enhance", price: 3500 },
  ],
  "TEXTURE SERVICES": [
    { name: "Long Hair Botox", price: 18000 },
    { name: "Top Hair Botox", price: 10000 },
    { name: "Long Hair Keratin", price: 18000 },
    { name: "Top Hair Keratin", price: 10000 },
  ],
  "PERM SERVICES": [
    { name: "Long Hair Perming", price: 12000 },
    { name: "Top Hair Perming", price: 8000 },
  ],
  "HAIR COLORING": [
    { name: "Revlon", price: 2000 },
    { name: "G.K", price: 2000 },
    { name: "Olivia", price: 1200 },
    { name: "Adore", price: 1200 },
    { name: "Garnier", price: 2000 },
    { name: "L'Oréal", price: 2000 },
    { name: "Just For Men", price: 2500 },
    { name: "Apple", price: 2000 },
    { name: "Keune", price: 2500 },
  ],
  "FACIALS": [
    { name: "Hydra Facial", price: 12000 },
    { name: "HI Lift", price: 5000 },
    { name: "Dr. Derma", price: 7000 },
    { name: "Thalgo", price: 8000 },
    { name: "Janssen", price: 10000 },
    { name: "Dermaclear Medicated", price: 8000 },
    { name: "Skin Care", price: 4000 },
    { name: "Dermacos", price: 7000 },
  ],
  "POLISHER": [
    { name: "Face", price: 1000 },
    { name: "Arms", price: 1500 },
    { name: "Hands", price: 1000 },
    { name: "Feet", price: 2000 },
    { name: "Neck", price: 1000 },
    { name: "Black Mask", price: 500 },
    { name: "Mud Mask", price: 500 },
  ],
  "MASSAGE": [
    { name: "Head", price: 500 },
    { name: "Shoulder", price: 500 },
    { name: "Back", price: 500 },
    { name: "Full Upper", price: 1000 },
  ],
  "NAIL CARE": [
    { name: "Manicure / Pedicure", price: 5000 },
  ],
  "GROOMING": [
    { name: "Party Grooming (Cleansing & Scrubbing)", price: 4000 },
  ],
  "WAX": [
    { name: "Cheeks", price: 500 },
    { name: "Forehead", price: 500 },
    { name: "Ear", price: 500 },
    { name: "Neck", price: 1000 },
    { name: "Full Face Wax", price: 1000 },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(p: number) {
  return `PKR ${p.toLocaleString()}/-`;
}

/** Search pricing for items whose name or category loosely matches the query. */
function findPrices(keywords: string[]): Array<{ category: string; name: string; price: number }> {
  const results: Array<{ category: string; name: string; price: number }> = [];
  for (const [category, items] of Object.entries(PRICING)) {
    for (const item of items) {
      const haystack = `${category} ${item.name}`.toLowerCase();
      if (keywords.some(kw => haystack.includes(kw))) {
        results.push({ category, ...item });
      }
    }
  }
  return results;
}

function buildReply(message: string): { reply: string; suggestions: string[]; services: string[] } {
  const msg = message.toLowerCase();

  // ── Greeting ────────────────────────────────────────────────────────────────
  if (msg.match(/^(hi|hello|hey|salam|salaam|assalam|aoa|good morning|good afternoon|good evening)\b/)) {
    return {
      reply: `Welcome to ${SALON.name}! 🌟 I'm your AI Concierge, here to help you 24/7.\n\nI can assist you with:\n• Services & pricing\n• Opening hours & location\n• Booking appointments\n• Treatment recommendations\n\nHow can I assist you today?`,
      suggestions: ["View Services & Prices", "Book Appointment", "Location & Hours"],
      services: [],
    };
  }

  // ── Location / Address / Direction ─────────────────────────────────────────
  if (msg.match(/location|address|where|find us|direction|how to get|b-17|winston|mall/)) {
    return {
      reply: `📍 We are located at:\n**${SALON.location}**\n\nFree parking is available at the Winston Mall basement. Easily accessible from GT Road and the Islamabad Expressway.`,
      suggestions: ["Opening Hours", "Call Us", "Book Appointment"],
      services: [],
    };
  }

  // ── Hours / Timing ──────────────────────────────────────────────────────────
  if (msg.match(/\bhour|timing|opening.?hour|what.?time.*open|when.*open|close.*time|closing|are.*open/)) {
    return {
      reply: `🕐 Our opening hours are:\n\n• ${SALON.hours.weekdays}\n• ${SALON.hours.sunday}\n\nWalk-ins are welcome, but booking ahead guarantees your preferred time slot!`,
      suggestions: ["Book Appointment", "Location", "Call Us"],
      services: [],
    };
  }

  // ── Contact / Phone ─────────────────────────────────────────────────────────
  if (msg.match(/phone|call|contact|number|reach/)) {
    return {
      reply: `📞 You can reach us at:\n\n• ${SALON.phone[0]}\n• ${SALON.phone[1]}\n• WhatsApp: ${SALON.whatsapp}\n\nOur team typically responds within minutes!`,
      suggestions: ["WhatsApp Us", "Book Appointment", "Location"],
      services: [],
    };
  }

  // ── WhatsApp ────────────────────────────────────────────────────────────────
  if (msg.match(/whatsapp|wa\.me|message us/)) {
    return {
      reply: `💬 Our WhatsApp number is **${SALON.whatsapp}**.\n\nTap the green WhatsApp button on the bottom-right of the page to send us a pre-filled booking message instantly — it takes just seconds!`,
      suggestions: ["Book via WhatsApp", "Book Online", "Call Us"],
      services: [],
    };
  }

  // ── Booking / Appointment / Reservation ────────────────────────────────────
  if (msg.match(/book|appoint|reserv|schedule|slot/)) {
    return {
      reply: `📅 Booking is easy! You have two options:\n\n1. **Online Form** — Use our Reservation page on the website for a step-by-step booking experience.\n2. **WhatsApp** — Send us a message at ${SALON.whatsapp} and we'll confirm your slot within minutes.\n\nWalk-ins are also welcome based on availability!`,
      suggestions: ["Book Online Now", "WhatsApp Booking", "View Services"],
      services: [],
    };
  }

  // ── Parking ─────────────────────────────────────────────────────────────────
  if (msg.match(/park/)) {
    return {
      reply: `🅿️ Free parking is available at the Winston Mall basement — no stress finding a spot! The mall has a spacious, secure basement parking area.`,
      suggestions: ["Location", "Book Appointment", "Opening Hours"],
      services: [],
    };
  }

  // ── Haircut ─────────────────────────────────────────────────────────────────
  if (msg.match(/haircut|hair cut|cut my hair|cutting/)) {
    const items = PRICING["HAIR"];
    return {
      reply: `✂️ Our hair cutting services:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nAll cuts include a professional wash and styling finish. Our master stylists tailor each cut to your face shape and preferences.`,
      suggestions: ["Book a Haircut", "View Full Price List", "View Services"],
      services: ["Regular Hair Cut", "Kids Hair Cut"],
    };
  }

  // ── Styling ─────────────────────────────────────────────────────────────────
  if (msg.match(/styl|hair.do|fiber|blowdry|blow dry/)) {
    const items = PRICING["STYLES"];
    return {
      reply: `💇 Our hair styling options:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nPerfect for events, parties, or a fresh everyday look!`,
      suggestions: ["Book Styling", "Book Appointment", "View Pricing"],
      services: ["Regular Styling", "Fiber Styling", "Hair-Do"],
    };
  }

  // ── Beard ────────────────────────────────────────────────────────────────────
  if (msg.match(/beard|shave|trim|stubble/)) {
    const beard = PRICING["BEARD"];
    const beardColor = PRICING["BEARD COLORING"];
    return {
      reply: `🧔 Our beard services:\n\n**Beard Grooming:**\n${beard.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\n**Beard Coloring** (all brands):\n${beardColor.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nOur expert barbers will give you a sharp, well-groomed look!`,
      suggestions: ["Book Beard Service", "Book Appointment", "View Pricing"],
      services: ["Beard Grooming", "Beard Coloring"],
    };
  }

  // ── Hydra Facial specifically ───────────────────────────────────────────────
  if (msg.match(/hydra|hydrafacial/)) {
    const item = PRICING["FACIALS"].find(i => i.name === "Hydra Facial")!;
    return {
      reply: `✨ Our **Hydra Facial** is one of our most popular treatments!\n\nPrice: **${formatPrice(item.price)}**\n\nThe Hydra Facial deeply cleanses, exfoliates, and hydrates your skin using advanced technology. It targets fine lines, congested pores, and dull skin — leaving you with an instant glow. Suitable for all skin types.`,
      suggestions: ["Book Hydra Facial", "View All Facials", "Book Appointment"],
      services: ["Hydra Facial"],
    };
  }

  // ── Facial / Skin ────────────────────────────────────────────────────────────
  if (msg.match(/facial|skin|face treat|glow|acne|pore|complexion|whitening/)) {
    const items = PRICING["FACIALS"];
    return {
      reply: `🌿 Our luxury facial treatments:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nEach facial targets specific concerns — our skincare therapists will recommend the perfect one for your skin type during consultation.`,
      suggestions: ["Book a Facial", "Book Appointment", "View Pricing"],
      services: items.map(i => i.name),
    };
  }

  // ── Keratin ──────────────────────────────────────────────────────────────────
  if (msg.match(/keratin/)) {
    const items = PRICING["TEXTURE SERVICES"].filter(i => i.name.includes("Keratin"));
    return {
      reply: `💎 Our **Keratin Treatment** options:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nKeratin eliminates frizz, adds incredible shine, and keeps your hair smooth for months. Highly recommended for damaged, dry, or curly hair.`,
      suggestions: ["Book Keratin Treatment", "View All Treatments", "Book Appointment"],
      services: ["Keratin Treatment"],
    };
  }

  // ── Botox (hair) ─────────────────────────────────────────────────────────────
  if (msg.match(/botox|hair botox/)) {
    const items = PRICING["TEXTURE SERVICES"].filter(i => i.name.includes("Botox"));
    return {
      reply: `✨ Our **Hair Botox** treatments:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nHair Botox is a deep conditioning treatment that repairs damage, reduces frizz, and restores softness and shine — without altering your hair's natural texture.`,
      suggestions: ["Book Hair Botox", "View Texture Services", "Book Appointment"],
      services: ["Hair Botox"],
    };
  }

  // ── Texture / Botox / Keratin / Perm (general) ──────────────────────────────
  if (msg.match(/texture|smooth|frizz|perm|rebond|straight/)) {
    const texture = PRICING["TEXTURE SERVICES"];
    const perm = PRICING["PERM SERVICES"];
    return {
      reply: `💫 Our texture & smoothing services:\n\n**Texture Services:**\n${texture.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\n**Perm Services:**\n${perm.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}`,
      suggestions: ["Book Treatment", "View Pricing", "Book Appointment"],
      services: ["Hair Botox", "Hair Keratin", "Hair Perming"],
    };
  }

  // ── Protein / Dandruff / Treatment ──────────────────────────────────────────
  if (msg.match(/protein|dandruff|treatment|damaged|dry hair|brittle|shine/)) {
    const items = PRICING["TREATMENTS"];
    return {
      reply: `🌱 Our hair treatments:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nOur expert stylists will assess your hair and recommend the best treatment. Protein Dose is great for restoring strength, Dandruff Control targets scalp issues, and Shine Enhance adds brilliant lustre.`,
      suggestions: ["Book Treatment", "View Pricing", "Book Appointment"],
      services: items.map(i => i.name),
    };
  }

  // ── Hair Coloring ─────────────────────────────────────────────────────────────
  if (msg.match(/color|colour|highlight|dye|balayage|ombre|loreal|keune|garnier|revlon/)) {
    const items = PRICING["HAIR COLORING"];
    return {
      reply: `🎨 Our hair coloring services by brand:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nWe also offer full coloring, highlights, balayage, and ombre. Our colorists will help you choose the perfect shade for your look!`,
      suggestions: ["Book Hair Coloring", "View Gallery", "Book Appointment"],
      services: ["Hair Coloring", "Highlights", "Balayage"],
    };
  }

  // ── Massage ───────────────────────────────────────────────────────────────────
  if (msg.match(/massage|relax|stress|head massage|shoulder|back massage/)) {
    const items = PRICING["MASSAGE"];
    return {
      reply: `🧘 Our massage services:\n\n${items.map(i => `• ${i.name} Massage — ${formatPrice(i.price)}`).join("\n")}\n\nPerfect for relaxation and stress relief. All massages are performed by trained therapists.`,
      suggestions: ["Book Massage", "Book Appointment", "View All Services"],
      services: items.map(i => `${i.name} Massage`),
    };
  }

  // ── Polisher ──────────────────────────────────────────────────────────────────
  if (msg.match(/polish|scrub|exfoliat|mask|black mask|mud mask/)) {
    const items = PRICING["POLISHER"];
    return {
      reply: `✨ Our polishing & skin treatments:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nPolishing treatments deeply exfoliate, brighten, and smooth your skin for a refreshed, radiant finish.`,
      suggestions: ["Book Polisher", "Book Appointment", "View Pricing"],
      services: items.map(i => i.name),
    };
  }

  // ── Wax ───────────────────────────────────────────────────────────────────────
  if (msg.match(/wax|waxing|hair remov/)) {
    const items = PRICING["WAX"];
    return {
      reply: `🌿 Our waxing services:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nAll waxing is performed with professional-grade products by trained therapists.`,
      suggestions: ["Book Waxing", "Book Appointment", "View Pricing"],
      services: items.map(i => i.name),
    };
  }

  // ── Nails / Manicure / Pedicure ───────────────────────────────────────────────
  if (msg.match(/nail|manicure|pedicure|mani|pedi/)) {
    const items = PRICING["NAIL CARE"];
    return {
      reply: `💅 Our nail care services:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nOur nail technicians provide thorough care to keep your hands and feet looking flawless.`,
      suggestions: ["Book Nail Care", "Book Appointment", "View Pricing"],
      services: ["Manicure", "Pedicure"],
    };
  }

  // ── Grooming / Party ─────────────────────────────────────────────────────────
  if (msg.match(/grooming|party|event|occasion|special/)) {
    const items = PRICING["GROOMING"];
    return {
      reply: `🎉 Our special grooming services:\n\n${items.map(i => `• ${i.name} — ${formatPrice(i.price)}`).join("\n")}\n\nPerfect for weddings, events, or any special occasion. Our team will make sure you look your absolute best!`,
      suggestions: ["Book Party Grooming", "Book Appointment", "WhatsApp Us"],
      services: ["Party Grooming"],
    };
  }

  // ── Bridal / Wedding ──────────────────────────────────────────────────────────
  if (msg.match(/bridal|bride|wedding|nikah|shadi|barat|valima/)) {
    return {
      reply: `👑 We offer a complete **Bridal Grooming Package** for your special day — including hair styling, facials, skin treatments, and more.\n\nFor a customised package tailored to your requirements and date, please reach us directly:\n📞 ${SALON.phone[0]}\n💬 WhatsApp: ${SALON.whatsapp}`,
      suggestions: ["WhatsApp for Bridal Package", "Call Us", "View Services"],
      services: ["Bridal Hair Do", "Hydra Facial", "Party Grooming"],
    };
  }

  // ── Price / Cost (general) ────────────────────────────────────────────────────
  if (msg.match(/price|cost|rate|charge|pkr|rupee|fee|how much|kitna|amount/)) {
    // Check for specific service keywords in the message
    const specificMatches = findPrices(msg.split(/\s+/).filter(w => w.length > 3));
    if (specificMatches.length > 0 && specificMatches.length <= 5) {
      const lines = specificMatches.map(i => `• ${i.name} (${i.category}) — ${formatPrice(i.price)}`).join("\n");
      return {
        reply: `Here are the prices I found:\n\n${lines}\n\nFor the full list, visit our Pricing page!`,
        suggestions: ["View Full Price List", "Book Appointment", "View Services"],
        services: [],
      };
    }
    // General pricing overview
    const highlights = [
      `Hair Cut — ${formatPrice(1300)}`,
      `Hydra Facial — ${formatPrice(12000)}`,
      `Beard — ${formatPrice(700)}`,
      `Protein Dose — ${formatPrice(3000)}`,
      `Manicure/Pedicure — ${formatPrice(5000)}`,
      `Party Grooming — ${formatPrice(4000)}`,
    ];
    return {
      reply: `Here's a quick price overview of our popular services:\n\n${highlights.map(h => `• ${h}`).join("\n")}\n\nFor the complete price list, visit our **Pricing** page. Prices may vary slightly based on hair length and treatment complexity.`,
      suggestions: ["View Full Price List", "Book Appointment", "Contact Us"],
      services: [],
    };
  }

  // ── Services / What do you offer ─────────────────────────────────────────────
  if (msg.match(/service|offer|do you|available|what.*do|treatment|provide/)) {
    return {
      reply: `We offer a full range of luxury grooming services at ${SALON.name}:\n\n💇 **Hair** — Cuts, Styling, Coloring, Botox, Keratin, Perming, Treatments\n🧔 **Beard** — Grooming, Cleansing, Coloring\n🌿 **Skin** — Hydra Facial, HI Lift, Thalgo, Janssen, Dermacos & more\n✨ **Polisher** — Face, Arms, Hands, Feet, Masks\n🧘 **Massage** — Head, Shoulder, Back, Full Upper\n💅 **Nail Care** — Manicure & Pedicure\n💆 **Waxing** — Face, Neck, Ears, Cheeks\n🎉 **Grooming** — Party & Event Packages\n\nAll services available for both ladies and gents!`,
      suggestions: ["View Pricing", "Book Appointment", "Location & Hours"],
      services: [],
    };
  }

  // ── Default / Fallback ────────────────────────────────────────────────────────
  return {
    reply: `Thank you for your message! I'm not quite sure I understood — could you try rephrasing?\n\nYou can ask me about:\n• **Services & prices** (e.g. "How much is a haircut?")\n• **Facials** (e.g. "What facials do you offer?")\n• **Booking** (e.g. "How do I book an appointment?")\n• **Location & hours**\n\nOr contact us directly at **${SALON.phone[0]}** or WhatsApp **${SALON.whatsapp}**!`,
    suggestions: ["View Services", "Book Appointment", "Location & Hours", "Pricing"],
    services: [],
  };
}

// ─── Route ────────────────────────────────────────────────────────────────────
const router = Router();

router.post("/", (req, res) => {
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const { reply, suggestions, services } = buildReply(parsed.data.message);
  res.json({ reply, suggestions, services });
});

export default router;
