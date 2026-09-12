// ─── Admin data layer: types, deterministic seed, WhatsApp helpers ────────────
import { PGS } from "./data";

export const ADMIN_PIN = "1234"; // demo PIN shown on the admin login page
export const ADMIN_SESSION_KEY = "lb_admin";
export const ADMIN_STATE_KEY = "lb_admin_v1";

export type Sharing = "Triple" | "Twin" | "Single";

export interface Bed {
  id: string;
  label: string;
  occupantId: string | null;
}

export interface Room {
  id: string;
  buildingId: string;
  floor: number;
  number: string;
  sharing: Sharing;
  beds: Bed[];
}

export interface Resident {
  id: string;
  name: string;
  phone: string; // 10 digits
  buildingId: string;
  roomId: string;
  bedId: string;
  sharing: Sharing;
  rent: number;
  due: number;
  dueDate: string;
  status: "Paid" | "Due";
  since: string;
  lastReminder: string | null;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  buildingId: string; // building id or "all"
  salary: number;
  paidThisMonth: boolean;
  joined: string;
}

export interface Ticket {
  id: string;
  buildingId: string;
  room: string;
  cat: string;
  msg: string;
  st: "Open" | "In Progress" | "Resolved";
  at: string;
  raisedBy: string;
}

export interface Payment {
  id: string;
  residentId: string;
  amount: number;
  date: string;
  mode: string;
}

export interface AdminState {
  rooms: Room[];
  residents: Resident[];
  staff: StaffMember[];
  tickets: Ticket[];
  payments: Payment[];
  menuOverride: Record<string, Partial<{ b: string; l: string; s: string; d: string }>>;
}

// ─── deterministic RNG so seed data is stable ────────────────────────────────
function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NAMES = [
  "Aarav Mehta", "Rohan Patil", "Sahil Khan", "Kunal Mhatre", "Aditya Rao",
  "Vikram Singh", "Nikhil Joshi", "Saurabh Yadav", "Imran Shaikh", "Deepak Kumar",
  "Priya Sharma", "Sneha Kulkarni", "Pooja Deshmukh", "Aishwarya Nair", "Kavya Reddy",
  "Ritu Verma", "Neha Pawar", "Divya Menon", "Shreya Iyer", "Anjali Gupta",
  "Manish Tiwari", "Gaurav Shinde", "Pranav Kulkarni", "Ritesh Agarwal", "Varun Nair",
  "Karan Malhotra", "Siddharth Bose", "Ankit Mishra", "Rahul Verma", "Tejas Jadhav",
  "Pallavi Rane", "Komal Singh", "Rucha Patil", "Tanvi Desai", "Megha Kulkarni",
  "Simran Kaur", "Naina Shah", "Ishita Rao", "Sakshi Pawar", "Mitali Joshi",
  "Farhan Qureshi", "Yash Thakur", "Omkar Mane", "Chetan Bhosale", "Nilesh Pawar",
  "Swapnil Gaikwad", "Akshay Londhe", "Sandeep Kale",
];

const SHARING_CYCLE: Sharing[] = ["Triple", "Triple", "Twin", "Twin", "Single"];
const BEDS: Record<Sharing, number> = { Triple: 3, Twin: 2, Single: 1 };

export function seedAdminState(): AdminState {
  const r = mulberry(42);
  const rooms: Room[] = [];
  const residents: Resident[] = [];
  let ni = 0;

  for (const b of PGS) {
    const floors = b.bedsTotal > 85 ? 4 : 3;
    const targetRooms = Math.max(6, Math.round(b.bedsTotal / 2.2));
    const perFloor = Math.ceil(targetRooms / floors);
    for (let f = 1; f <= floors; f++) {
      for (let i = 1; i <= perFloor; i++) {
        const sharing = SHARING_CYCLE[(f * perFloor + i) % SHARING_CYCLE.length];
        const number = `${f}0${i}`;
        const roomId = `${b.id}-r${number}`;
        const beds: Bed[] = Array.from({ length: BEDS[sharing] }, (_, k) => ({
          id: `${roomId}-b${k + 1}`,
          label: `Bed ${k + 1}`,
          occupantId: null,
        }));
        rooms.push({ id: roomId, buildingId: b.id, floor: f, number, sharing, beds });
      }
    }
  }

  // Occupy ~85% of beds with generated residents
  for (const room of rooms) {
    const pg = PGS.find((p) => p.id === room.buildingId)!;
    for (const bed of room.beds) {
      if (r() > 0.85) continue; // vacant
      const id = `res-${residents.length + 1}`;
      const name = NAMES[ni++ % NAMES.length];
      const price =
        room.sharing === "Triple" ? pg.triple : room.sharing === "Twin" ? pg.twin : pg.single;
      const paid = r() > 0.32;
      residents.push({
        id,
        name,
        phone: `98${String(10000000 + Math.floor(r() * 89999999))}`,
        buildingId: room.buildingId,
        roomId: room.id,
        bedId: bed.id,
        sharing: room.sharing,
        rent: price,
        due: paid ? 0 : price,
        dueDate: "5 Oct 2026",
        status: paid ? "Paid" : "Due",
        since: r() > 0.5 ? "2026" : "2025",
        lastReminder: null,
      });
      bed.occupantId = id;
    }
  }

  // Pin the two app-demo residents to fixed rooms so both logins agree
  const pin = (phone: string, name: string, buildingId: string, sharing: Sharing) => {
    const room = rooms.find((x) => x.buildingId === buildingId && x.sharing === sharing);
    if (!room) return;
    const bed = room.beds[0];
    if (bed.occupantId) {
      residents.splice(residents.findIndex((x) => x.id === bed.occupantId), 1);
    }
    const pg = PGS.find((p) => p.id === buildingId)!;
    const price = sharing === "Triple" ? pg.triple : sharing === "Twin" ? pg.twin : pg.single;
    const id = `res-demo-${phone}`;
    residents.unshift({
      id, name, phone, buildingId, roomId: room.id, bedId: bed.id, sharing,
      rent: price, due: phone === "9876543210" ? price : 0, dueDate: "5 Oct 2026",
      status: phone === "9876543210" ? "Due" : "Paid",
      since: "2026", lastReminder: null,
    });
    bed.occupantId = id;
  };
  pin("9876543210", "Aarav Mehta", "pg2-hinjewadi", "Twin");
  pin("9123456780", "Priya Sharma", "pg3-wakad-girls", "Twin");

  const staff: StaffMember[] = [
    { id: "st1", name: "Rajesh Nair", role: "Manager", phone: "9810010011", buildingId: "all", salary: 35000, paidThisMonth: true, joined: "2019" },
    { id: "st2", name: "Suresh Patil", role: "Warden", phone: "9810010012", buildingId: "pg2-hinjewadi", salary: 22000, paidThisMonth: true, joined: "2020" },
    { id: "st3", name: "Meena Joshi", role: "Warden", phone: "9810010013", buildingId: "pg3-wakad-girls", salary: 20000, paidThisMonth: false, joined: "2021" },
    { id: "st4", name: "Santosh Yadav", role: "Warden", phone: "9810010014", buildingId: "pg7-kharadi", salary: 20000, paidThisMonth: true, joined: "2022" },
    { id: "st5", name: "Laxman Pawar", role: "Cook", phone: "9810010015", buildingId: "pg2-hinjewadi", salary: 18000, paidThisMonth: true, joined: "2020" },
    { id: "st6", name: "Sunita Kale", role: "Cook", phone: "9810010016", buildingId: "pg3-wakad-girls", salary: 16000, paidThisMonth: false, joined: "2023" },
    { id: "st7", name: "Ramesh Gupta", role: "Cook", phone: "9810010017", buildingId: "pg7-kharadi", salary: 17000, paidThisMonth: true, joined: "2021" },
    { id: "st8", name: "Anita Shinde", role: "Housekeeping", phone: "9810010018", buildingId: "pg2-hinjewadi", salary: 12000, paidThisMonth: true, joined: "2022" },
    { id: "st9", name: "Vikas Mane", role: "Housekeeping", phone: "9810010019", buildingId: "pg5-baner", salary: 11000, paidThisMonth: false, joined: "2024" },
    { id: "st10", name: "Prakash Jadhav", role: "Electrician", phone: "9810010020", buildingId: "all", salary: 16000, paidThisMonth: true, joined: "2021" },
    { id: "st11", name: "Kavita Desai", role: "Accountant", phone: "9810010021", buildingId: "all", salary: 25000, paidThisMonth: false, joined: "2020" },
  ];

  const tickets: Ticket[] = [
    { id: "T-101", buildingId: "pg2-hinjewadi", room: "302", cat: "Plumbing / Water", msg: "Tap leaking in common washroom, 3rd floor", st: "Open", at: "11 Sep 2026", raisedBy: "Aarav Mehta" },
    { id: "T-102", buildingId: "pg7-kharadi", room: "104", cat: "WiFi / Electricity", msg: "Wi-Fi slow in room 104 since yesterday", st: "In Progress", at: "10 Sep 2026", raisedBy: "Kunal M." },
    { id: "T-103", buildingId: "pg3-wakad-girls", room: "Mess", cat: "Food / Mess", msg: "Request less spicy dal for dinner", st: "Resolved", at: "8 Sep 2026", raisedBy: "Sneha K." },
    { id: "T-104", buildingId: "pg5-baner", room: "201", cat: "Cleaning", msg: "Balcony cleaning pending for 2 days", st: "Open", at: "11 Sep 2026", raisedBy: "Warden" },
  ];

  const payments: Payment[] = residents
    .filter((x) => x.status === "Paid")
    .slice(0, 40)
    .map((x, i) => ({
      id: `PAY-${2000 + i}`,
      residentId: x.id,
      amount: x.rent,
      date: `${2 + (i % 4)} Sep 2026`,
      mode: i % 3 === 0 ? "Cash" : "UPI",
    }));

  return { rooms, residents, staff, tickets, payments, menuOverride: {} };
}

// ─── WhatsApp deep link ──────────────────────────────────────────────────────
export const waLink = (phone10: string, message: string) =>
  `https://wa.me/91${phone10}?text=${encodeURIComponent(message)}`;

export const rentReminderMsg = (name: string, pgName: string, due: number, dueDate: string) =>
  `Namaste ${name}! 🙏 This is *Laxmi Balaji PG* (${pgName}). Your rent of *₹${due.toLocaleString("en-IN")}* for October is due by *${dueDate}*. Please pay via UPI/cash at the office. Reply here for receipt. Thank you! 💛`;

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
