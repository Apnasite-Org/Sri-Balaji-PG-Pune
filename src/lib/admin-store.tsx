"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ADMIN_STATE_KEY,
  seedAdminState,
  type AdminState,
  type Payment,
  type Resident,
  type Room,
  type Sharing,
  type StaffMember,
  type Ticket,
} from "./admin-data";

interface AdminStore extends AdminState {
  ready: boolean;
  // rooms & beds
  vacateBed: (roomId: string, bedId: string) => void;
  addRoom: (buildingId: string, floor: number, number: string, sharing: Sharing) => void;
  // residents & payments
  addResident: (r: Omit<Resident, "id" | "due" | "status" | "lastReminder" | "dueDate"> & { status: "Paid" | "Due" }) => void;
  recordPayment: (residentId: string, amount: number, mode: string) => void;
  markReminderSent: (residentId: string) => void;
  removeResident: (residentId: string) => void;
  // staff
  addStaff: (s: Omit<StaffMember, "id">) => void;
  toggleSalaryPaid: (staffId: string) => void;
  removeStaff: (staffId: string) => void;
  // tickets
  addTicket: (t: Omit<Ticket, "id" | "at" | "st">) => void;
  setTicketStatus: (ticketId: string, st: Ticket["st"]) => void;
  // menu
  setMenuMeal: (day: string, meal: "b" | "l" | "s" | "d", text: string) => void;
  // misc
  resetAll: () => void;
}

const Ctx = createContext<AdminStore | null>(null);

export function useAdmin() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAdmin must be used inside AdminProvider");
  return v;
}

function load(): AdminState {
  try {
    const raw = localStorage.getItem(ADMIN_STATE_KEY);
    if (raw) return JSON.parse(raw) as AdminState;
  } catch {
    /* ignore */
  }
  const seed = seedAdminState();
  try {
    localStorage.setItem(ADMIN_STATE_KEY, JSON.stringify(seed));
  } catch {
    /* ignore */
  }
  return seed;
}

let uid = 1000;
const nid = (p: string) => `${p}-${Date.now().toString(36)}${uid++}`;

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState | null>(null);

  useEffect(() => {
    setState(load());
  }, []);

  useEffect(() => {
    if (state) {
      try {
        localStorage.setItem(ADMIN_STATE_KEY, JSON.stringify(state));
      } catch {
        /* ignore */
      }
    }
  }, [state]);

  const patch = useCallback((fn: (s: AdminState) => AdminState) => {
    setState((s) => (s ? fn(s) : s));
  }, []);

  const value: AdminStore | null = useMemo(() => {
    if (!state) return null;
    const base: AdminState = state;
    return {
      ...base,
      ready: true,

      vacateBed: (roomId, bedId) =>
        patch((s) => {
          const room = s.rooms.find((x) => x.id === roomId);
          const bed = room?.beds.find((b) => b.id === bedId);
          const occ = bed?.occupantId;
          return {
            ...s,
            rooms: s.rooms.map((x) =>
              x.id !== roomId
                ? x
                : { ...x, beds: x.beds.map((b) => (b.id === bedId ? { ...b, occupantId: null } : b)) }
            ),
            residents: occ ? s.residents.filter((r) => r.id !== occ) : s.residents,
          };
        }),

      addRoom: (buildingId, floor, number, sharing) =>
        patch((s) => {
          const count = sharing === "Triple" ? 3 : sharing === "Twin" ? 2 : 1;
          const roomId = `${buildingId}-r${number}-${Date.now().toString(36)}`;
          const room: Room = {
            id: roomId,
            buildingId,
            floor,
            number,
            sharing,
            beds: Array.from({ length: count }, (_, k) => ({
              id: `${roomId}-b${k + 1}`,
              label: `Bed ${k + 1}`,
              occupantId: null,
            })),
          };
          return { ...s, rooms: [...s.rooms, room] };
        }),

      addResident: (r) =>
        patch((s) => {
          const id = nid("res");
          const resident: Resident = {
            ...r,
            id,
            due: r.status === "Paid" ? 0 : r.rent,
            dueDate: "5 Oct 2026",
            lastReminder: null,
          };
          return {
            ...s,
            residents: [resident, ...s.residents],
            rooms: s.rooms.map((x) =>
              x.id !== r.roomId
                ? x
                : {
                    ...x,
                    beds: x.beds.map((b) =>
                      b.id === r.bedId ? { ...b, occupantId: id } : b
                    ),
                  }
            ),
          };
        }),

      recordPayment: (residentId, amount, mode) =>
        patch((s) => {
          const pay: Payment = {
            id: nid("PAY"),
            residentId,
            amount,
            date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
            mode,
          };
          return {
            ...s,
            payments: [pay, ...s.payments],
            residents: s.residents.map((r) => {
              if (r.id !== residentId) return r;
              const due = Math.max(0, r.due - amount);
              return { ...r, due, status: due === 0 ? "Paid" : "Due" };
            }),
          };
        }),

      markReminderSent: (residentId) =>
        patch((s) => ({
          ...s,
          residents: s.residents.map((r) =>
            r.id === residentId ? { ...r, lastReminder: new Date().toLocaleString() } : r
          ),
        })),

      removeResident: (residentId) =>
        patch((s) => ({
          ...s,
          residents: s.residents.filter((r) => r.id !== residentId),
          rooms: s.rooms.map((x) => ({
            ...x,
            beds: x.beds.map((b) => (b.occupantId === residentId ? { ...b, occupantId: null } : b)),
          })),
        })),

      addStaff: (s2) =>
        patch((s) => ({ ...s, staff: [{ ...s2, id: nid("st") }, ...s.staff] })),

      toggleSalaryPaid: (staffId) =>
        patch((s) => ({
          ...s,
          staff: s.staff.map((x) => (x.id === staffId ? { ...x, paidThisMonth: !x.paidThisMonth } : x)),
        })),

      removeStaff: (staffId) =>
        patch((s) => ({ ...s, staff: s.staff.filter((x) => x.id !== staffId) })),

      addTicket: (t) =>
        patch((s) => ({
          ...s,
          tickets: [
            {
              ...t,
              id: `T-${100 + s.tickets.length + 1}`,
              st: "Open",
              at: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
            },
            ...s.tickets,
          ],
        })),

      setTicketStatus: (ticketId, st) =>
        patch((s) => ({
          ...s,
          tickets: s.tickets.map((t) => (t.id === ticketId ? { ...t, st } : t)),
        })),

      setMenuMeal: (day, meal, text) =>
        patch((s) => {
          const prev = { b: "", l: "", s: "", d: "", ...(s.menuOverride[day] || {}) };
          prev[meal] = text;
          return {
            ...s,
            menuOverride: { ...s.menuOverride, [day]: prev },
          };
        }),

      resetAll: () => setState(seedAdminState()),
    };
  }, [state, patch]);

  if (!value) {
    return <div className="mx-auto max-w-6xl p-10 text-sm text-faded">Loading admin…</div>;
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
