import { Router } from "express";
import { SendChatMessageBody } from "@workspace/api-zod";

const router = Router();

// Knowledge base for the AI receptionist
const KNOWLEDGE = {
  location: "Ground Floor, Winston Mall, D-Block, B-17, Islamabad",
  hours: "Monday to Saturday: 10:00 AM – 9:00 PM | Sunday: 11:00 AM – 8:00 PM",
  phone: ["0320-5814165", "0347-7268791"],
  whatsapp: "+92 347 7268791",
  parking: "Free parking available at Winston Mall basement",
  directions: "Located in Winston Mall, D-Block, B-17 Islamabad — easily accessible from GT Road and Expressway",
  services: {
    hair: ["Hair Cut", "Hair Styling", "Hair Botox", "Hair Keratin", "Hair Coloring", "Hair Perming", "Protein Treatment", "Dandruff Control"],
    facials: ["Hydra Facial", "HI Lift", "Dr Derma", "Thalgo", "Janssen", "Dermaclear", "Dermacos"],
    massage: ["Head Massage", "Shoulder Massage", "Back Massage", "Full Upper Massage"],
    wax: ["Full Face Wax", "Cheeks Wax", "Forehead Wax", "Ear Wax", "Neck Wax"],
    nails: ["Manicure", "Pedicure"],
    beard: ["Beard Trim", "Beard Cleansing", "Beard Coloring"],
  },
  pricing: {
    "Hair Cut": 500,
    "Hair Styling": 800,
    "Hair Botox": 5000,
    "Hair Keratin": 7000,
    "Hydra Facial": 3500,
    "Manicure": 800,
    "Pedicure": 1000,
    "Head Massage": 600,
    "Beard Trim": 300,
  },
  brands: ["Wella", "Loreal", "Kerastase", "Redken", "Schwarzkopf"],
};

function buildReply(message: string): { reply: string; suggestions: string[]; services: string[] } {
  const msg = message.toLowerCase();

  // Location
  if (msg.includes("location") || msg.includes("where") || msg.includes("address") || msg.includes("find")) {
    return {
      reply: `We are located at ${KNOWLEDGE.location}. Free parking is available at the mall basement. We're easily accessible from GT Road and Expressway.`,
      suggestions: ["Get Directions", "Opening Hours", "Contact Us"],
      services: [],
    };
  }

  // Hours
  if (msg.includes("hour") || msg.includes("open") || msg.includes("time") || msg.includes("close") || msg.includes("when")) {
    return {
      reply: `Our working hours are:\n${KNOWLEDGE.hours}\nWe'd love to have you visit us!`,
      suggestions: ["Book Appointment", "Location", "Call Us"],
      services: [],
    };
  }

  // Booking
  if (msg.includes("book") || msg.includes("appoint") || msg.includes("reserv") || msg.includes("schedule")) {
    return {
      reply: "You can book an appointment through our online booking form, or send us a WhatsApp message at +92 347 7268791. Our team will confirm your slot within minutes!",
      suggestions: ["Book Online", "WhatsApp Booking", "Call Us"],
      services: [],
    };
  }

  // Phone / contact
  if (msg.includes("phone") || msg.includes("call") || msg.includes("contact") || msg.includes("number")) {
    return {
      reply: `You can reach us at:\n📞 ${KNOWLEDGE.phone[0]}\n📞 ${KNOWLEDGE.phone[1]}\n💬 WhatsApp: ${KNOWLEDGE.whatsapp}`,
      suggestions: ["Book Appointment", "Location", "Opening Hours"],
      services: [],
    };
  }

  // WhatsApp
  if (msg.includes("whatsapp") || msg.includes("wa") || msg.includes("message")) {
    return {
      reply: `Our WhatsApp number is ${KNOWLEDGE.whatsapp}. Click the WhatsApp button on the bottom right to send us a pre-filled booking message instantly!`,
      suggestions: ["WhatsApp Booking", "Book Online", "Call Us"],
      services: [],
    };
  }

  // Parking
  if (msg.includes("park")) {
    return {
      reply: `${KNOWLEDGE.parking}. Winston Mall has a spacious basement parking area — no stress finding a spot!`,
      suggestions: ["Location", "Directions", "Book Appointment"],
      services: [],
    };
  }

  // Damaged hair
  if (msg.includes("damaged") || msg.includes("dry") || msg.includes("frizz") || msg.includes("brittle")) {
    return {
      reply: "For damaged or dry hair, we highly recommend our **Keratin Treatment** or **Protein Treatment** — both restore shine, eliminate frizz, and deeply nourish your hair. Our stylists will assess your hair type and recommend the best option.",
      suggestions: ["Book Keratin Treatment", "View Pricing", "Talk to a Stylist"],
      services: ["Hair Keratin", "Protein Treatment", "Hair Botox"],
    };
  }

  // Bridal
  if (msg.includes("bridal") || msg.includes("bride") || msg.includes("wedding") || msg.includes("nikah") || msg.includes("shadi")) {
    return {
      reply: "We offer a complete Bridal Grooming Package for your special day — including hair styling, bridal makeup, facials, and more. Please call or WhatsApp us for a customized package tailored to your needs!",
      suggestions: ["Book Bridal Package", "WhatsApp Booking", "Call Us"],
      services: ["Bridal Hair Do", "Bridal Makeup", "Hydra Facial"],
    };
  }

  // Hair color
  if (msg.includes("color") || msg.includes("colour") || msg.includes("highlight") || msg.includes("dye") || msg.includes("balayage")) {
    return {
      reply: `We offer premium hair coloring using international brands: ${KNOWLEDGE.brands.join(", ")}. Services include full coloring, highlights, balayage, ombre, and more. Our colorists will help you choose the perfect shade!`,
      suggestions: ["Book Hair Coloring", "View Pricing", "View Gallery"],
      services: ["Hair Coloring", "Highlights", "Balayage"],
    };
  }

  // Facial / skin
  if (msg.includes("facial") || msg.includes("skin") || msg.includes("face") || msg.includes("glow") || msg.includes("acne")) {
    return {
      reply: "We offer a range of luxury facials including Hydra Facial, HI Lift, Dr Derma, Thalgo, Janssen, Dermaclear, and Dermacos. Each targets specific skin concerns — our therapists will recommend the best one for your skin type.",
      suggestions: ["Book a Facial", "View Pricing", "Book Appointment"],
      services: KNOWLEDGE.services.facials,
    };
  }

  // Massage
  if (msg.includes("massage") || msg.includes("relax") || msg.includes("stress")) {
    return {
      reply: "Our massage services include Head, Shoulder, Back, and Full Upper Body Massage. Perfect for relaxation and stress relief. Available for both ladies and gents.",
      suggestions: ["Book Massage", "View Pricing", "Book Appointment"],
      services: KNOWLEDGE.services.massage,
    };
  }

  // Beard
  if (msg.includes("beard") || msg.includes("shave") || msg.includes("trim")) {
    return {
      reply: "We offer professional Beard Trim, Beard Cleansing, and Beard Coloring services. Our expert barbers will give you a sharp, well-groomed look.",
      suggestions: ["Book Beard Service", "View Pricing", "Book Appointment"],
      services: KNOWLEDGE.services.beard,
    };
  }

  // Price
  if (msg.includes("price") || msg.includes("cost") || msg.includes("rate") || msg.includes("charge") || msg.includes("pkr") || msg.includes("rupee")) {
    const priceList = Object.entries(KNOWLEDGE.pricing)
      .map(([name, price]) => `${name}: PKR ${price}`)
      .join(" | ");
    return {
      reply: `Here are some of our popular service prices:\n${priceList}\nFor the complete price list, visit our Pricing page. Prices may vary based on hair length and treatment complexity.`,
      suggestions: ["View Full Price List", "Book Appointment", "Contact Us"],
      services: [],
    };
  }

  // Products
  if (msg.includes("product") || msg.includes("brand") || msg.includes("shampoo") || msg.includes("keratin brand")) {
    return {
      reply: `We use only premium international products including ${KNOWLEDGE.brands.join(", ")}. All treatments are performed with professional-grade products for best results.`,
      suggestions: ["View Services", "Book Appointment", "Contact Us"],
      services: [],
    };
  }

  // Services general
  if (msg.includes("service") || msg.includes("offer") || msg.includes("do you") || msg.includes("available")) {
    return {
      reply: "We offer a full range of luxury grooming services: Hair Services (Cut, Styling, Coloring, Botox, Keratin), Premium Facials, Massage, Waxing, Nail Care, Beard Grooming, and Bridal Packages — for both ladies and gents.",
      suggestions: ["View All Services", "View Pricing", "Book Appointment"],
      services: [],
    };
  }

  // Default greeting / fallback
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("salam") || msg.includes("hey") || msg.length < 10) {
    return {
      reply: "Welcome to Mr Farrukh Hair Saloon! I'm your AI Concierge. I can help you with our services, pricing, location, opening hours, and booking. How can I assist you today?",
      suggestions: ["View Services", "Book Appointment", "Location & Hours", "Pricing"],
      services: [],
    };
  }

  // Generic fallback
  return {
    reply: "Thank you for your message! For personalised assistance, please call us at 0320-5814165 or send us a WhatsApp message at +92 347 7268791. Our team is happy to help!",
    suggestions: ["Call Us", "WhatsApp Booking", "Book Online", "View Services"],
    services: [],
  };
}

router.post("/", (req, res) => {
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const { reply, suggestions, services } = buildReply(parsed.data.message);
  res.json({ reply, suggestions, services });
});

export default router;
