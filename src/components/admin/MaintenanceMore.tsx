"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone, Plus, Trash2 } from "lucide-react";
import { MENU, PGS } from "@/lib/data";
import type { Ticket } from "@/lib/admin-data";
import { useAdmin } from "@/lib/admin-store";

const inp =
  "w-full rounded-xl border border-linen bg-white px-3 py-2 text-sm outline-none focus:border-terra";

interface Callback {
  name: string;
  mobile: string;
  pg?: string;
  loc?: string;
  share?: string;
  at: string;
}

interface AppTicket {
  phone: string;
  id: string;
  cat: string;
  msg: string;
  st: string;
  at: string;
}

function readCallbacks(): Callback[] {
  try {
    return JSON.parse(localStorage.getItem("lb_callbacks") || "[]");
  } catch {
    return [];
  }
}

// Tickets raised from the resident app (keys lb_tickets_<phone>)
function readAppTickets(): AppTicket[] {
  const out: AppTicket[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("lb_tickets_")) {
        const phone = k.replace("lb_tickets_", "");
        const arr = JSON.parse(localStorage.getItem(k) || "[]");
        for (const t of arr) out.push({ phone, ...t });
      }
    }
  } catch {
    /* ignore */
  }
  return out;
}

const MEALS: [string, "b" | "l" | "s" | "d", string][] = [
  ["🌅 Breakfast", "b", "b"],
  ["☀️ Lunch", "l", "l"],
  ["☕ Evening snacks", "s", "s"],
  ["🌙 Dinner", "d", "d"],
];

export default function MaintenanceMore() {
  const { tickets, addTicket, setTicketStatus, menuOverride, setMenuMeal } = useAdmin();
  const [filter, setFilter] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [bldg, setBldg] = useState(PGS[0].id);
  const [room, setRoom] = useState("");
  const [cat, setCat] = useState("Plumbing / Water");
  const [msg, setMsg] = useState("");
  const [callbacks, setCallbacks] = useState<Callback[]>([]);
  const [appTickets, setAppTickets] = useState<AppTicket[]>([]);
  const [imported, setImported] = useState<string[]>([]);
  const [menuDay, setMenuDay] = useState("Monday");

  useEffect(() => {
    setCallbacks(readCallbacks());
    setAppTickets(readAppTickets());
  }, []);

  const shown = tickets.filter((t) => filter === "All" || t.st === filter);
  const bName = (id: string) => PGS.find((p) => p.id === id)?.short || id;

  const doAdd = () => {
    if (!msg.trim()) return;
    addTicket({ buildingId: bldg, room: room.trim() || "—", cat, msg: msg.trim(), raisedBy: "Admin" });
    setMsg(""); setRoom(""); setShowAdd(false);
  };

  const delCallback = (i: number) => {
    const next = callbacks.filter((_, k) => k !== i);
    setCallbacks(next);
    try {
      localStorage.setItem("lb_callbacks", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const importAppTicket = (t: AppTicket) => {
    addTicket({
      buildingId: PGS[0].id,
      room: "—",
      cat: t.cat,
      msg: `${t.msg} (via app, +91 ${t.phone})`,
      raisedBy: `App user ${t.phone}`,
    });
    setImported((x) => [...x, t.id + t.phone]);
  };

  const stColor = (st: string) =>
    st === "Resolved" ? "bg-green-100 text-green-800" : st === "In Progress" ? "bg-blue-100 text-blue-900" : "bg-amber-100 text-amber-900";

  return (
    <>
      {/* ─── Tickets ─── */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="font-display text-xl">Maintenance tickets ({tickets.length})</h3>
        {["All", "Open", "In Progress", "Resolved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 text-xs font-bold ${filter === f ? "border-ink bg-ink text-white" : "border-linen bg-white"}`}
          >
            {f}
          </button>
        ))}
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="ml-auto flex items-center gap-1 rounded-full bg-terra px-4 py-1.5 text-sm font-bold text-white hover:bg-terradark"
        >
          <Plus size={14} /> New ticket
        </button>
      </div>

      {showAdd && (
        <div className="mb-3 grid gap-2 rounded-3xl border border-dashed border-terra bg-terrasoft/40 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <select value={bldg} onChange={(e) => setBldg(e.target.value)} className={inp}>
            {PGS.map((b) => (
              <option key={b.id} value={b.id}>{b.short}</option>
            ))}
          </select>
          <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room (e.g. 302)" className={inp} />
          <select value={cat} onChange={(e) => setCat(e.target.value)} className={inp}>
            {["Plumbing / Water", "WiFi / Electricity", "Food / Mess", "Cleaning", "Room change", "Other"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Issue description…" className={inp} />
          <button onClick={doAdd} className="rounded-full bg-ink py-2 text-sm font-bold text-white">Create</button>
        </div>
      )}

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((t: Ticket) => (
          <div key={t.id} className="rounded-2xl border border-linen bg-white p-3.5 text-sm shadow">
            <div className="flex items-center gap-2">
              <b>{t.id}</b>
              <span className="text-xs text-faded">{bName(t.buildingId)} · R{t.room}</span>
              <select
                value={t.st}
                onChange={(e) => setTicketStatus(t.id, e.target.value as Ticket["st"])}
                className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${stColor(t.st)}`}
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
            <p className="mt-1"><b>{t.cat}:</b> {t.msg}</p>
            <p className="text-xs text-faded">{t.raisedBy} · {t.at}</p>
          </div>
        ))}
        {shown.length === 0 && <p className="text-sm text-faded">No tickets in this state.</p>}
      </div>

      {/* ─── App tickets ─── */}
      {appTickets.length > 0 && (
        <div className="mt-5 rounded-3xl border border-linen bg-white p-4 shadow">
          <h3 className="font-display text-xl">📱 Raised from resident app ({appTickets.length})</h3>
          <div className="mt-2 space-y-1.5 text-sm">
            {appTickets.map((t) => {
              const key = t.id + t.phone;
              const done = imported.includes(key);
              return (
                <div key={key} className="flex items-center gap-2 rounded-xl bg-cream px-3 py-2">
                  <span className="flex-1"><b>{t.cat}</b> — {t.msg} <span className="text-xs text-faded">(+91 {t.phone} · {t.at})</span></span>
                  <button
                    disabled={done}
                    onClick={() => importAppTicket(t)}
                    className={`rounded-full px-3 py-1 text-xs font-bold ${done ? "bg-sagesoft text-emerald-900" : "bg-ink text-white"}`}
                  >
                    {done ? "✓ Imported" : "Import →"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {/* ─── Enquiries / callbacks ─── */}
        <div className="rounded-3xl border border-linen bg-white p-4 shadow">
          <h3 className="font-display text-xl">📞 Callback enquiries ({callbacks.length})</h3>
          <div className="mt-2 max-h-72 space-y-1.5 overflow-auto text-sm">
            {callbacks.length === 0 && <p className="text-sm text-faded">No enquiries yet — they appear here when visitors request a callback on the site.</p>}
            {callbacks.map((c, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl bg-cream px-3 py-2">
                <div className="min-w-0 flex-1">
                  <b>{c.name}</b> <span className="text-faded">+91 {c.mobile}</span>
                  <span className="block text-xs text-faded">
                    {c.pg || c.loc || ""} {c.share ? `· ${c.share}` : ""} · {new Date(c.at).toLocaleString()}
                  </span>
                </div>
                <a href={`tel:+91${c.mobile}`} className="rounded-full border border-linen bg-white p-1.5" title="Call">
                  <Phone size={13} />
                </a>
                <a
                  href={`https://wa.me/91${c.mobile}?text=${encodeURIComponent(`Namaste ${c.name}! 🙏 This is Laxmi Balaji PG. Thanks for your enquiry${c.pg ? ` for ${c.pg}` : ""} — when can we arrange your visit?`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#25D366] p-1.5 text-white"
                  title="WhatsApp"
                >
                  <MessageCircle size={13} />
                </a>
                <button onClick={() => delCallback(i)} className="rounded-full border border-linen bg-white p-1.5 text-red-700" title="Done / delete">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Menu editor ─── */}
        <div className="rounded-3xl border border-linen bg-white p-4 shadow">
          <h3 className="font-display text-xl">🍛 Weekly menu editor</h3>
          <p className="text-xs text-faded">Edits go live on the website&apos;s “What&apos;s food today?” instantly.</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {Object.keys(MENU).map((d) => (
              <button
                key={d}
                onClick={() => setMenuDay(d)}
                className={`rounded-full border px-3 py-1 text-xs font-bold ${menuDay === d ? "border-ink bg-ink text-white" : "border-linen bg-white"}`}
              >
                {d.slice(0, 3)}
              </button>
            ))}
          </div>
          <div className="mt-2 space-y-1.5">
            {MEALS.map(([label, key]) => (
              <label key={key} className="block text-xs font-bold">
                {label}
                <input
                  defaultValue={(menuOverride[menuDay]?.[key] || MENU[menuDay][key]) as string}
                  key={menuDay + key}
                  onBlur={(e) => {
                    if (e.target.value.trim()) setMenuMeal(menuDay, key, e.target.value.trim());
                  }}
                  className={inp + " mt-0.5 font-normal"}
                />
              </label>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-faded">Tip: click out of a box to save it.</p>
        </div>
      </div>
    </>
  );
}
