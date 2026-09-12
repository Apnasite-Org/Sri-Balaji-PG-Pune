"use client";

import { MessageCircle } from "lucide-react";
import { PGS } from "@/lib/data";
import { inr, rentReminderMsg, waLink } from "@/lib/admin-data";
import { useAdmin } from "@/lib/admin-store";

export default function Overview({ go }: { go: (t: "buildings" | "residents" | "staff" | "maintenance") => void }) {
  const { rooms, residents, staff, tickets, payments } = useAdmin();

  const totalBeds = rooms.reduce((n, r) => n + r.beds.length, 0);
  const occBeds = rooms.reduce((n, r) => n + r.beds.filter((b) => b.occupantId).length, 0);
  const occPct = totalBeds ? Math.round((occBeds / totalBeds) * 100) : 0;
  const expected = residents.reduce((n, r) => n + r.rent, 0);
  const collected = payments.reduce((n, p) => n + p.amount, 0);
  const dues = residents.filter((r) => r.status === "Due");
  const duesTotal = dues.reduce((n, r) => n + r.due, 0);
  const openTickets = tickets.filter((t) => t.st !== "Resolved");
  const payroll = staff.reduce((n, s) => n + s.salary, 0);
  const payrollPaid = staff.filter((s) => s.paidThisMonth).reduce((n, s) => n + s.salary, 0);

  const kpis: [string, string, string, string][] = [
    ["🛏️ Occupancy", `${occBeds}/${totalBeds} beds`, `${occPct}% full`, "bg-sagesoft"],
    ["💰 Expected rent", inr(expected), "this month", "bg-terrasoft"],
    ["✅ Collected", inr(collected), `${payments.length} receipts`, "bg-green-100"],
    ["⏰ Pending dues", inr(duesTotal), `${dues.length} residents`, "bg-amber-100"],
    ["🛠️ Open tickets", `${openTickets.length}`, "need attention", "bg-red-100"],
    ["👥 Staff payroll", `${inr(payrollPaid)} / ${inr(payroll)}`, `${staff.length} staff`, "bg-blue-100"],
  ];

  const perBuilding = PGS.map((b) => {
    const br = rooms.filter((x) => x.buildingId === b.id);
    const beds = br.reduce((n, x) => n + x.beds.length, 0);
    const occ = br.reduce((n, x) => n + x.beds.filter((bb) => bb.occupantId).length, 0);
    const due = residents.filter((x) => x.buildingId === b.id && x.status === "Due").length;
    return { b, beds, occ, due, pct: beds ? Math.round((occ / beds) * 100) : 0 };
  });

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map(([t, v, s, c]) => (
          <div key={t} className={`rounded-2xl border border-linen p-4 shadow ${c}`}>
            <p className="text-xs font-bold">{t}</p>
            <b className="font-display text-xl">{v}</b>
            <span className="block text-xs opacity-70">{s}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* occupancy */}
        <div className="rounded-3xl border border-linen bg-white p-5 shadow">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-xl">Occupancy by building</h3>
            <button onClick={() => go("buildings")} className="text-xs font-bold text-terradark underline">
              Manage rooms →
            </button>
          </div>
          <div className="mb-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-faded">
            <span>🟢 Available — plenty of beds</span>
            <span>🟠 Few beds left</span>
            <span>🔴 Almost full</span>
          </div>
          <div className="space-y-2.5">
            {perBuilding.map(({ b, beds, occ, pct }) => (
              <div key={b.id}>
                <div className="flex justify-between text-xs font-semibold">
                  <span>{b.short} · {b.locality}</span>
                  <span>{occ}/{beds} · {beds - occ} left</span>
                </div>
                <div
                  className="h-2.5 overflow-hidden rounded-full bg-parchment"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${b.short} occupancy ${pct} percent`}
                >
                  <div
                    className={`h-full rounded-full ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-sun" : "bg-leaf"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* dues needing WhatsApp nudge */}
        <div className="rounded-3xl border border-linen bg-white p-5 shadow">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-xl">Top dues — nudge on WhatsApp</h3>
            <button onClick={() => go("residents")} className="text-xs font-bold text-terradark underline">
              All residents →
            </button>
          </div>
          <div className="space-y-2">
            {dues.slice(0, 5).map((r) => {
              const pg = PGS.find((p) => p.id === r.buildingId);
              return (
                <div key={r.id} className="flex items-center gap-2 rounded-xl border border-linen bg-cream p-2.5 text-sm">
                  <div className="min-w-0 flex-1">
                    <b>{r.name}</b> <span className="text-faded">· {pg?.short}</span>
                    <span className="block text-xs text-red-700">{inr(r.due)} due by {r.dueDate}</span>
                  </div>
                  <a
                    href={waLink(r.phone, rentReminderMsg(r.name, pg?.name || "Laxmi Balaji PG", r.due, r.dueDate))}
                    target="_blank"
                    rel="noreferrer"
                    className="flex shrink-0 items-center gap-1 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white"
                  >
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                </div>
              );
            })}
            {dues.length === 0 && <p className="text-sm text-faded">🎉 Zero dues. Everything collected!</p>}
          </div>
        </div>

        {/* recent payments */}
        <div className="rounded-3xl border border-linen bg-white p-5 shadow">
          <h3 className="mb-3 font-display text-xl">Recent collections</h3>
          <div className="space-y-1.5 text-sm">
            {payments.slice(0, 6).map((p) => {
              const r = residents.find((x) => x.id === p.residentId);
              return (
                <div key={p.id} className="flex justify-between border-b border-dashed border-linen pb-1.5">
                  <span>{r?.name || "—"} <span className="text-xs text-faded">· {p.mode} · {p.date}</span></span>
                  <b className="text-leaf">{inr(p.amount)}</b>
                </div>
              );
            })}
          </div>
        </div>

        {/* open tickets */}
        <div className="rounded-3xl border border-linen bg-white p-5 shadow">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-xl">Maintenance needing action</h3>
            <button onClick={() => go("maintenance")} className="text-xs font-bold text-terradark underline">
              All tickets →
            </button>
          </div>
          <div className="space-y-1.5 text-sm">
            {openTickets.slice(0, 6).map((t) => {
              const pg = PGS.find((p) => p.id === t.buildingId);
              return (
                <div key={t.id} className="flex justify-between gap-2 border-b border-dashed border-linen pb-1.5">
                  <span><b>{t.id}</b> · {t.cat} · {pg?.short} R{t.room}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${t.st === "Open" ? "bg-amber-100 text-amber-900" : "bg-blue-100 text-blue-900"}`}>{t.st}</span>
                </div>
              );
            })}
            {openTickets.length === 0 && <p className="text-sm text-faded">All clear — no open tickets.</p>}
          </div>
        </div>
      </div>
    </>
  );
}
