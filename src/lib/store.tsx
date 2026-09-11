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

export interface Ticket {
  id: string;
  cat: string;
  msg: string;
  st: string;
  at: string;
}

interface AppStore {
  phone: string | null;
  login: (phone: string) => void;
  logout: () => void;
  openCallback: (pgName?: string) => void;
  toast: (msg: string) => void;
}

const Ctx = createContext<AppStore | null>(null);

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside Providers");
  return v;
}

const ticketKey = (phone: string) => `lb_tickets_${phone}`;

export function getTickets(phone: string): Ticket[] {
  try {
    return JSON.parse(localStorage.getItem(ticketKey(phone)) || "[]");
  } catch {
    return [];
  }
}

export function addTicket(phone: string, t: Ticket) {
  const all = getTickets(phone);
  all.unshift(t);
  localStorage.setItem(ticketKey(phone), JSON.stringify(all));
}

export function Providers({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState<string | null>(null);
  const [cbOpen, setCbOpen] = useState(false);
  const [cbPg, setCbPg] = useState<string>("");
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("lb_session") || "null");
      if (s?.phone) setPhone(s.phone);
    } catch {
      /* ignore */
    }
  }, []);

  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const login = useCallback((p: string) => {
    setPhone(p);
    localStorage.setItem("lb_session", JSON.stringify({ phone: p }));
  }, []);

  const logout = useCallback(() => {
    setPhone(null);
    localStorage.removeItem("lb_session");
  }, []);

  const openCallback = useCallback((pgName = "") => {
    setCbPg(pgName);
    setCbOpen(true);
  }, []);

  const value = useMemo(
    () => ({ phone, login, logout, openCallback, toast }),
    [phone, login, logout, openCallback, toast]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <CallbackDialog open={cbOpen} pg={cbPg} onClose={() => setCbOpen(false)} />
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[200] flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-xl"
          >
            {t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

function CallbackDialog({
  open,
  pg,
  onClose,
}: {
  open: boolean;
  pg: string;
  onClose: () => void;
}) {
  const { toast } = useApp();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) setDone(false);
  }, [open ]);

  if (!open) return null;

  const submit = () => {
    if (name.trim().length < 2 || !/^[0-9]{10}$/.test(mobile.trim())) {
      toast("Please add your name + valid 10-digit number");
      return;
    }
    try {
      const arr = JSON.parse(localStorage.getItem("lb_callbacks") || "[]");
      arr.unshift({ name, mobile, pg, at: new Date().toISOString() });
      localStorage.setItem("lb_callbacks", JSON.stringify(arr));
    } catch {
      /* ignore */
    }
    setDone(true);
    toast("Callback requested! Talk soon 💛");
    setTimeout(onClose, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-ink/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-cream p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between">
          <h3 className="font-display text-2xl">📞 Request a callback</h3>
          <button
            onClick={onClose}
            className="rounded-full border border-linen bg-white px-2.5 py-1 text-sm"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <p className="mb-4 text-sm text-faded">
          {pg ? (
            <>
              For <b className="text-ink">{pg}</b> —{" "}
            </>
          ) : null}
          we usually call back within 30 minutes (10 AM – 8 PM).
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="mb-2 w-full rounded-xl border border-linen bg-white px-3.5 py-2.5 text-sm outline-none focus:border-terra"
        />
        <input
          value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
          placeholder="Mobile number (10 digits)"
          inputMode="numeric"
          className="mb-3 w-full rounded-xl border border-linen bg-white px-3.5 py-2.5 text-sm outline-none focus:border-terra"
        />
        <button
          onClick={submit}
          className="w-full rounded-full bg-terra py-2.5 text-sm font-bold text-white shadow-lg shadow-terra/30 transition hover:bg-terradark"
        >
          Call me back →
        </button>
        {done && (
          <p className="mt-3 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
            ✅ Noted! We&apos;ll call you shortly.
          </p>
        )}
      </div>
    </div>
  );
}
