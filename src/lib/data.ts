// ─── Laxmi Balaji PG · central data ──────────────────────────────────────────
// TODO(owner): replace OWNER_PHONE / OWNER_WHATSAPP with the real numbers
// before handing the demo to the customer.

export const OWNER_PHONE = "+919000000000";
export const OWNER_PHONE_LABEL = "+91 90000 00000";
export const OWNER_EMAIL = "hello@laxmibalajipg.in";
export const DEMO_OTP = "1234";

export const FLAGSHIP_MAPS_URL = "https://maps.app.goo.gl/LUoaVLJdnkvi3kVaA";

export type PGType = "Boys" | "Girls" | "Co-living";

export interface PG {
  id: string;
  name: string;
  short: string;
  locality: string;
  for: string;
  type: PGType;
  address: string;
  mapsUrl: string;
  lat: number;
  lng: number;
  rating: number;
  reviewsCount: number;
  bedsTotal: number;
  bedsLeft: number;
  triple: number;
  twin: number;
  single: number;
  images: string[];
  nearby: [string, string][];
  tag: string;
  description: string;
  flagship?: boolean;
}

const img = (id: string) =>
  `https://images.unsplash.com/${id}?w=900&q=80&auto=format&fit=crop`;

export const PGS: PG[] = [
  {
    id: "pg2-hinjewadi",
    name: "Laxmi Balaji PG – 2",
    short: "PG-2 · Flagship",
    locality: "Hinjewadi Phase 1",
    for: "Boys",
    type: "Boys",
    address: "Hinjewadi Phase 1, Rajiv Gandhi Infotech Park, Pune 411057",
    mapsUrl: FLAGSHIP_MAPS_URL,
    lat: 18.5828156,
    lng: 73.6818665,
    rating: 4.6,
    reviewsCount: 210,
    bedsTotal: 80,
    bedsLeft: 6,
    // Single ₹7,000 / Twin ₹6,000 seen on MagicBricks listing "Balaji PG 2";
    // Triple bracket from NoBroker Hinjewadi listings (₹4,500+). Owner to confirm.
    triple: 5000,
    twin: 6000,
    single: 7000,
    images: [
      img("photo-1555854877-bab0e564b8d5"),
      img("photo-1522708323590-d24dbb6b0267"),
      img("photo-1595526114035-0d45ed16cfbf"),
    ],
    nearby: [
      ["Rajiv Gandhi Infotech Park", "8 min"],
      ["Laxmi Chowk", "4 min"],
      ["Grand Highstreet Mall", "10 min"],
    ],
    tag: "Flagship · Boys",
    description:
      "Our flagship boys PG in the heart of Hinjewadi Phase 1 — walkable to the IT park, with homely all-meals food, fast Wi-Fi and a warden who knows every resident by name.",
    flagship: true,
  },
  {
    id: "pg1-hinjewadi",
    name: "Laxmi Balaji PG – 1",
    short: "PG-1",
    locality: "Hinjewadi Phase 1",
    for: "Boys",
    type: "Boys",
    address: "Shivaji Chowk, Hinjewadi Phase 1, Pune 411057",
    mapsUrl: "https://www.google.com/maps?q=Hinjewadi+Phase+1+Shivaji+Chowk+Pune",
    lat: 18.5912,
    lng: 73.7389,
    rating: 4.5,
    reviewsCount: 164,
    bedsTotal: 64,
    bedsLeft: 5,
    triple: 4800,
    twin: 6000,
    single: 7200,
    images: [
      img("photo-1502672260266-1c1ef2d93688"),
      img("photo-1560448204-e02f11c3d0e2"),
    ],
    nearby: [
      ["Hyatt Place Hinjawadi", "3 min"],
      ["Vibgyor High School", "6 min"],
      ["Xion Mall", "8 min"],
    ],
    tag: "Near Shivaji Chowk",
    description:
      "The original Laxmi Balaji home near Shivaji Chowk — budget-friendly beds for IT professionals with the same kitchen and housekeeping standards as PG-2.",
  },
  {
    id: "pg3-wakad-girls",
    name: "Laxmi Balaji PG – 3",
    short: "PG-3",
    locality: "Wakad",
    for: "Girls",
    type: "Girls",
    address: "Bhumkar Chowk Road, Wakad, Pune 411057",
    mapsUrl: "https://www.google.com/maps?q=Wakad+Bhumkar+Chowk+Pune",
    lat: 18.5995,
    lng: 73.7597,
    rating: 4.7,
    reviewsCount: 188,
    bedsTotal: 56,
    bedsLeft: 4,
    triple: 6500,
    twin: 8000,
    single: 10500,
    images: [
      img("photo-1590490360182-c33d57733427"),
      img("photo-1631049307264-da0ec9d70304"),
    ],
    nearby: [
      ["Hinjewadi IT Park", "12 min"],
      ["E-Square Carnival Xion", "6 min"],
      ["DMart Wakad", "4 min"],
    ],
    tag: "Girls · Warden on-site",
    description:
      "Secure girls PG in Wakad with biometric entry, CCTV and a resident warden — popular with students and first-time working women.",
  },
  {
    id: "pg4-hinjewadi-girls",
    name: "Laxmi Balaji PG – 4",
    short: "PG-4",
    locality: "Hinjewadi Phase 2",
    for: "Girls",
    type: "Girls",
    address: "Hinjewadi Phase 2, near Megapolis Circle, Pune 411057",
    mapsUrl: "https://www.google.com/maps?q=Hinjewadi+Phase+2+Megapolis+Pune",
    lat: 18.578,
    lng: 73.709,
    rating: 4.6,
    reviewsCount: 142,
    bedsTotal: 60,
    bedsLeft: 7,
    triple: 6200,
    twin: 7800,
    single: 10000,
    images: [
      img("photo-1560185127-6ed189bf02f4"),
      img("photo-1560185893-a55cbc8c57e8"),
    ],
    nearby: [
      ["Megapolis IT Towers", "5 min"],
      ["Embassy Tech Zone", "9 min"],
      ["Local market", "3 min"],
    ],
    tag: "Girls · Near Megapolis",
    description:
      "Girls home minutes from Megapolis and Embassy Tech Zone — quiet study lounges and a mess menu tuned with resident feedback every month.",
  },
  {
    id: "pg5-baner",
    name: "Laxmi Balaji PG – 5",
    short: "PG-5",
    locality: "Baner",
    for: "Boys",
    type: "Boys",
    address: "Baner Main Road, near Balewadi Stadium, Pune 411045",
    mapsUrl: "https://www.google.com/maps?q=Baner+Main+Road+Balewadi+Stadium+Pune",
    lat: 18.5679,
    lng: 73.7708,
    rating: 4.5,
    reviewsCount: 129,
    bedsTotal: 72,
    bedsLeft: 8,
    triple: 6000,
    twin: 7500,
    single: 9800,
    images: [
      img("photo-1595526051245-4506e0005bd0"),
      img("photo-1554995207-c18c203602cb"),
    ],
    nearby: [
      ["Baner IT Hub", "10 min"],
      ["Balewadi Stadium", "5 min"],
      ["Baner food streets", "6 min"],
    ],
    tag: "Study lounges",
    description:
      "Baner home for students and young professionals — big study hall open till late, and Baner's famous food streets a short walk away.",
  },
  {
    id: "pg6-marunji",
    name: "Laxmi Balaji PG – 6",
    short: "PG-6",
    locality: "Marunji",
    for: "Boys",
    type: "Boys",
    address: "Marunji Road, near Alard College, Pune 411057",
    mapsUrl: "https://www.google.com/maps?q=Marunji+Road+Alard+College+Pune",
    lat: 18.576,
    lng: 73.671,
    rating: 4.4,
    reviewsCount: 98,
    bedsTotal: 48,
    bedsLeft: 9,
    triple: 4500,
    twin: 5800,
    single: 7000,
    images: [
      img("photo-1521017432531-fbd92d768814"),
      img("photo-1484154218962-a197022b5858"),
    ],
    nearby: [
      ["Alard University", "5 min"],
      ["Laxmi Chowk", "6 min"],
      ["Hinjewadi Phase 1", "12 min"],
    ],
    tag: "Budget friendly",
    description:
      "Our most budget-friendly home near Alard campus — ideal for students, with the same all-meals kitchen as every Laxmi Balaji PG.",
  },
  {
    id: "pg7-kharadi",
    name: "Laxmi Balaji PG – 7",
    short: "PG-7",
    locality: "Kharadi",
    for: "Co-living",
    type: "Co-living",
    address: "EON Park Road, Kharadi, Pune 411014",
    mapsUrl: "https://www.google.com/maps?q=EON+Park+Road+Kharadi+Pune",
    lat: 18.5511,
    lng: 73.934,
    rating: 4.6,
    reviewsCount: 151,
    bedsTotal: 90,
    bedsLeft: 5,
    triple: 7500,
    twin: 9500,
    single: 13000,
    images: [
      img("photo-1600607687939-ce8a6c25118c"),
      img("photo-1600566753086-00f18fb6b3ea"),
    ],
    nearby: [
      ["EON IT Park", "5 min walk"],
      ["World Trade Center", "7 min"],
      ["Pune Station", "20 min"],
    ],
    tag: "Co-living · IT crowd",
    description:
      "Co-living style home near EON IT Park for working professionals — private and twin rooms, chill lounge with smart TV, and weekend community dinners.",
  },
  {
    id: "pg8-wakad-colive",
    name: "Laxmi Balaji PG – 8",
    short: "PG-8",
    locality: "Wakad",
    for: "Co-living",
    type: "Co-living",
    address: "Wakad Bridge Road, near Phoenix Mall of Millennium, Pune 411057",
    mapsUrl: "https://www.google.com/maps?q=Wakad+Bridge+Road+Pune",
    lat: 18.602,
    lng: 73.762,
    rating: 4.7,
    reviewsCount: 176,
    bedsTotal: 84,
    bedsLeft: 6,
    triple: 7000,
    twin: 9000,
    single: 12000,
    images: [
      img("photo-1600210492486-724fe5c67fb0"),
      img("photo-1616486338812-3dadae4b4ace"),
    ],
    nearby: [
      ["Phoenix Mall of Millennium", "8 min"],
      ["Hinjewadi Phase 1", "15 min"],
      ["Bhumkar Chowk", "5 min"],
    ],
    tag: "Co-living · Newest",
    description:
      "Our newest co-living home near the Mall of Millennium — modern interiors, housekeeping six days a week, and rooms that get booked fast.",
  },
];

export const LOCALITIES = [
  { name: "Hinjewadi Phase 1", count: 2, note: "IT Park · Laxmi Chowk · Malls" },
  { name: "Hinjewadi Phase 2", count: 1, note: "Megapolis · Embassy Tech Zone" },
  { name: "Wakad", count: 2, note: "Xion Mall · Bhumkar Chowk" },
  { name: "Baner", count: 1, note: "IT Hub · Food streets" },
  { name: "Marunji", count: 1, note: "Alard Campus" },
  { name: "Kharadi", count: 1, note: "EON IT Park · WTC" },
];

export const FACILITIES = [
  { icon: "wifi", title: "High-speed Wi-Fi", desc: "Fibre in every room & lounge" },
  { icon: "meals", title: "All homely meals", desc: "Breakfast, lunch, dinner" },
  { icon: "shield", title: "CCTV + Warden", desc: "24×7 security, verified entry" },
  { icon: "clean", title: "Housekeeping", desc: "Daily cleaning, weekly linen" },
  { icon: "power", title: "Power + Water", desc: "Backup, geysers, RO water" },
  { icon: "laundry", title: "Laundry", desc: "Machines + ironing help" },
  { icon: "bed", title: "Furnished rooms", desc: "Bed, wardrobe, study desk" },
  { icon: "tv", title: "TV + Lounge", desc: "Smart TV, indoor games" },
];

export const MENU: Record<string, { b: string; l: string; s: string; d: string }> = {
  Monday: { b: "Masala Dosa + Filter Coffee", l: "Dal Tadka, Jeera Rice, Roti, Salad", s: "Kanda Bhaji + Chai", d: "Paneer Butter Masala + Roti + Gulab Jamun" },
  Tuesday: { b: "Aloo Paratha + Curd + Pickle", l: "Rajma Chawal + Roti + Buttermilk", s: "Veg Maggi + Lemon Tea", d: "Veg Biryani + Raita + Papad" },
  Wednesday: { b: "Poha + Jalebi + Chai", l: "Chicken Curry / Chole + Rice + Roti", s: "Corn Chaat + Coffee", d: "Dal Khichdi + Kadhi + Papad" },
  Thursday: { b: "Idli Sambar + Chutney", l: "Veg Kolhapuri + Bajra Roti + Salad", s: "Samosa + Chai", d: "Egg Curry / Paneer Lababdar + Roti" },
  Friday: { b: "Misal Pav + Buttermilk", l: "Pav Bhaji + Pulav + Raita", s: "Cake + Cold Coffee", d: "Dosa Night + Sambar + Payasam" },
  Saturday: { b: "Puri Bhaji + Sheera", l: "Chicken / Veg Biryani + Raita", s: "Pani Puri Counter", d: "Hakka Noodles + Manchurian" },
  Sunday: { b: "Chole Bhature", l: "Sunday Spl: Chicken / Paneer + Sweet", s: "Fruit + Milkshakes", d: "Khichdi Comfort + Kadhi" },
};

export const REVIEWS = [
  { name: "Sneha K.", pg: "PG-3 · Wakad", text: "Warden aunty knows everyone by name. My parents stopped worrying after the first video call.", stars: 5 },
  { name: "Rohit P.", pg: "PG-2 · Hinjewadi", text: "Walk to the IT park, Wi-Fi never lags in standup calls. Twin room is spacious, cleaning is daily.", stars: 5 },
  { name: "Aishwarya D.", pg: "PG-4 · Hinjewadi", text: "Biometric entry plus CCTV gave full confidence. Rooms are bright and cozy, not dull white boxes.", stars: 5 },
  { name: "Kunal M.", pg: "PG-7 · Kharadi", text: "Raised a tap issue at night, fixed by morning. Rent receipt and food menu in one login. Smooth.", stars: 4 },
  { name: "Pooja S.", pg: "PG-8 · Wakad", text: "Festival celebrations and weekend dinners — made friends for life. Triple room still feels private.", stars: 5 },
  { name: "Aditya R.", pg: "PG-6 · Marunji", text: "Best value near college. Extra roti without frowns, and the visit was arranged the same day.", stars: 4 },
];

export const FAQS: [string, string][] = [
  ["What is included in the rent?", "All meals (breakfast, lunch, evening snacks, dinner), Wi-Fi, electricity, water, housekeeping, laundry machines and maintenance. No brokerage, no hidden charges."],
  ["Can I visit PG-2 before booking?", "Yes! Visits are open 10 AM – 8 PM all days. Tap “Request Callback” or “Book Visit” — we confirm on call/SMS, usually within 30 minutes."],
  ["Where exactly is Laxmi Balaji PG-2?", "Hinjewadi Phase 1, near Laxmi Chowk and Rajiv Gandhi Infotech Park. Open the location on Google Maps from any PG card for exact directions."],
  ["What sharing options and prices?", "Triple from ~₹4,500, Twin/Double ~₹6,000–9,500, Single ~₹7,000–13,000 depending on the PG. PG-2 flagship: Single ₹7,000 / Twin ₹6,000."],
  ["Is food veg / non-veg?", "Daily veg meals plus non-veg (chicken/egg) three times a week. Jain options on request. The full weekly menu is on this site."],
  ["What is the notice / deposit policy?", "One-month notice. One-month refundable deposit, returned within 7 days of checkout after room check."],
];

export interface Resident {
  name: string;
  pgId: string;
  room: string;
  bed: string;
  rent: number;
  due: number;
  dueDate: string;
  status: "Due" | "Paid";
  lastPaid: string;
  deposit: number;
  since: string;
  warden: string;
}

// Demo residents for the login flow (mobile → OTP 1234)
export const RESIDENTS: Record<string, Resident> = {
  "9876543210": {
    name: "Aarav Mehta", pgId: "pg2-hinjewadi", room: "302-B · Twin Sharing",
    bed: "Bed 2 (window side)", rent: 6000, due: 6000, dueDate: "5 Oct 2026",
    status: "Due", lastPaid: "5 Sep 2026 · UPI", deposit: 6000,
    since: "Jan 2026", warden: "Suresh Patil",
  },
  "9123456780": {
    name: "Priya Sharma", pgId: "pg3-wakad-girls", room: "201-A · Twin Sharing",
    bed: "Bed 1", rent: 8000, due: 0, dueDate: "5 Oct 2026",
    status: "Paid", lastPaid: "2 Sep 2026 · UPI", deposit: 8000,
    since: "Mar 2025", warden: "Meena Joshi",
  },
};

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
