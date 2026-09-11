"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PGCard from "@/components/PGCard";
import { MENU, PGS, RESIDENTS, inr } from "@/lib/data";
import { addTicket, getTickets, useApp, type Ticket } from "@/lib/store";

type Tab = "room" | "rent" | "food" | "help";

export default function DashboardPage() {
  const { phone, logout, toast } = useApp();
  const [tab, setTab] = useState<Tab>("room");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [paidNow, setPaidNow] = useState(false);
  const [cat, setCat] = useState("Plumbing / Water");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (phone) setTickets(getTickets(phone));
  }, [phone]);

  if (!phone) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-3xl">Please login first</h1>
        <p className="mt-1 text-sm text-faded">Your dashboard lives behind a mobile OTP login.</p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-full bg-terra px-6 py-2.5 text-sm font-bold text-white"
        >
          Go to login →
        </Link>
      </div>
    );
  }

  const resident = RESIDENTS[phone];
  const days = Object.keys(MENU);
  const today = days[(new Date().getDay() + 6) % 7];
  const m = MENU[today];

  // ─── Newcomer (no room yet) ───
  if (!resident) {
    const rec = [...PGS].sort((a, b) => a.twin - b.twin).slice(0, 3);
    return (
      <div className="page-shell py-10">
        <p className="text-xs font-extrabold tracking-[0.16em] text-terradark uppercase">Welcome</p>
        <h1 className="font-display text-4xl">Hi, guest! Let&apos;s find your room 🏠</h1>
        <p className="mt-1 text-sm text-faded">
          Logged in as +91 {phone} · No active booking yet ·{" "}
          <button onClick={logout} className="font-bold text-terradark underline">Logout</button>
        </p>
        <p className="mt-4">
          Based on popularity, here are <b>3 cozy picks</b> with beds available right now:
        </p>
        <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rec.map((p) => (
            <PGCard key={p.id} pg={p} />
          ))}
        </div>
      </div>
    );
  }

  // ─── Resident ───
  const pg = PGS.find((p) => p.id === resident.pgId)!;
  const isPaid = paidNow || resident.status === "Paid";
  const due = paidNow ? 0 : resident.due;

  const pay = () => {
    setPaidNow(true);
    const t: Ticket = {
      id: "PAY" + Date.now().toString().slice(-5),
      cat: "Payment",
      msg: `Rent ${inr(resident.rent)} paid successfully. Receipt on SMS.`,
      st: "Resolved",
      at: new Date().toLocaleString(),
    };
    addTicket(phone, t);
    setTickets(getTickets(phone));
    toast("Payment successful (demo) ✅ Receipt saved.");
  };

  const raise = () => {
    if (msg.trim().length < 4) {
      toast("Please describe the issue briefly");
      return;
    }
    addTicket(phone, {
      id: "T" + Date.now().toString().slice(-5),
      cat,
      msg: msg.trim(),
      st: "Open",
      at: new Date().toLocaleString(),
    });
    setTickets(getTickets(phone));
    setMsg("");
    toast("Ticket raised! Warden notified 🛠️");
  };

  const tabs: [Tab, string][] = [
    ["room", "🛏️ My Room"],
    ["rent", "💰 Rent & Dues"],
    ["food", "🍛 Food Today"],
    ["help", "🛠️ Raise Concern"],
  ];

  return (
    <div className="page-shell py-10">
      <p className="text-xs font-extrabold tracking-[0.16em] text-terradark uppercase">Resident dashboard</p>
      <h1 className="font-display text-4xl">Namaste, {resident.name.split(" ")[0]}! 👋</h1>
      <p className="mt-1 text-sm text-faded">
        +91 {phone} ·{" "}
        <button onClick={logout} className="font-bold text-terradark underline">Logout</button>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tabs.map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${
              tab === k ? "border-ink bg-ink text-white" : "border-linen bg-white hover:border-terra"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-3xl border border-linen bg-white p-6 shadow">
        {tab === "room" && (
          <>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {[
                ["🏠 PG Home", `${pg.name}, ${pg.locality}`],
                ["🚪 Room", `${resident.room} · ${resident.bed}`],
                ["📅 Staying since", resident.since],
                ["👮 Warden", resident.warden],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-linen bg-cream p-3 text-sm">
                  <b>{k}</b>
                  <br />
                  {v}
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-faded">
              📍 {pg.address} ·{" "}
              <a href={pg.mapsUrl} target="_blank" rel="noreferrer" className="font-bold text-terradark underline">
                Open in Maps
              </a>{" "}
              · <Link href={`/pgs/${pg.id}`} className="font-bold text-terradark underline">View my PG</Link>
            </p>
          </>
        )}

        {tab === "rent" && (
          <>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="rounded-xl border border-linen bg-cream p-3 text-sm">
                <b>💰 Monthly rent</b>
                <br />
                {inr(resident.rent)} (meals + Wi-Fi incl.)
              </div>
              <div className="rounded-xl border border-linen bg-cream p-3 text-sm">
                <b>📌 Status</b>
                <br />
                {isPaid ? (
                  <b className="text-leaf">✅ Paid — nothing due</b>
                ) : (
                  <b className="text-red-700">⏰ {inr(due)} due by {resident.dueDate}</b>
                )}
              </div>
              <div className="rounded-xl border border-linen bg-cream p-3 text-sm">
                <b>🧾 Last paid</b>
                <br />
                {paidNow ? "Just now · UPI (demo)" : resident.lastPaid}
              </div>
              <div className="rounded-xl border border-linen bg-cream p-3 text-sm">
                <b>🔐 Deposit</b>
                <br />
                {inr(resident.deposit)} (refundable)
              </div>
            </div>
            {!isPaid ? (
              <button
                onClick={pay}
                className="mt-4 rounded-full bg-terra px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-terra/30 transition hover:bg-terradark"
              >
                Pay {inr(due)} now (UPI / Card) →
              </button>
            ) : (
              <p className="mt-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
                All clear! Receipt sent on SMS.
              </p>
            )}
            <p className="mt-2 text-xs text-faded">Demo checkout — no real money moves.</p>
          </>
        )}

        {tab === "food" && (
          <>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {([["🌅 Breakfast", m.b], ["☀️ Lunch", m.l], ["☕ Evening", m.s], ["🌙 Dinner", m.d]] as const).map(([t, v]) => (
                <div key={t} className="rounded-xl border border-linen bg-cream p-3 text-sm">
                  <b className="text-xs tracking-wider text-terradark uppercase">{t}</b>
                  <p className="mt-0.5 font-semibold">{v}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-faded">
              ✨ Today is <b>{today}</b> · Mess: 7:30–10 AM · 12:30–2:30 PM · 5–6 PM · 7:30–9:30 PM
            </p>
          </>
        )}

        {tab === "help" && (
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <b>Raise a concern / ticket</b>
              <select
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="mt-2 w-full rounded-xl border border-linen bg-[#fffefb] px-3 py-2.5 text-sm outline-none focus:border-terra"
              >
                {["Plumbing / Water", "WiFi / Electricity", "Food / Mess", "Cleaning", "Room change", "Other"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={3}
                placeholder="Describe the issue… e.g. Tap leaking in 302 washroom"
                className="mt-2 w-full rounded-xl border border-linen bg-[#fffefb] px-3 py-2.5 text-sm outline-none focus:border-terra"
              />
              <button
                onClick={raise}
                className="mt-2 w-full rounded-full bg-terra py-2.5 text-sm font-bold text-white transition hover:bg-terradark"
              >
                Submit ticket →
              </button>
            </div>
            <div>
              <b>My tickets ({tickets.length})</b>
              <div className="mt-2 max-h-64 space-y-2 overflow-auto">
                {tickets.length === 0 && (
                  <p className="text-sm text-faded">No tickets yet. We usually resolve within 24 hrs.</p>
                )}
                {tickets.map((t) => (
                  <div key={t.id} className="rounded-xl border border-linen bg-cream p-3 text-sm">
                    <b>#{t.id}</b> · {t.cat} ·{" "}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                        t.st === "Resolved" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {t.st}
                    </span>
                    <br />
                    {t.msg}
                    <br />
                    <span className="text-xs text-faded">{t.at}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
