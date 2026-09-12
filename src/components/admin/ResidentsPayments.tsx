"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Phone, Plus, Trash2 } from "lucide-react";
import { PGS } from "@/lib/data";
import { inr, rentReminderMsg, waLink } from "@/lib/admin-data";
import { useAdmin } from "@/lib/admin-store";

const inp =
  "w-full rounded-xl border border-linen bg-white px-3 py-2 text-sm outline-none focus:border-terra";

export default function ResidentsPayments() {
  const {
    rooms, residents, payments,
    addResident, recordPayment, removeResident, markReminderSent,
  } = useAdmin();
  const [q, setQ] = useState("");
  const [bldg, setBldg] = useState("all");
  const [onlyDues, setOnlyDues] = useState(false);
  const [payFor, setPayFor] = useState<string | null>(null);
  const [amt, setAmt] = useState("");
  const [mode, setMode] = useState("UPI");
  const [showAdd, setShowAdd] = useState(false);

  // add-resident form
  const [fName, setFName] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fBldg, setFBldg] = useState(PGS[0].id);
  const [fRoom, setFRoom] = useState("");
  const [fSince, setFSince] = useState("2026");

  const list = useMemo(
    () =>
      residents.filter(
        (r) =>
          (bldg === "all" || r.buildingId === bldg) &&
          (!onlyDues || r.status === "Due") &&
          (!q || r.name.toLowerCase().includes(q.toLowerCase()) || r.phone.includes(q))
      ),
    [residents, bldg, onlyDues, q]
  );

  const duesTotal = residents.filter((r) => r.status === "Due").reduce((n, r) => n + r.due, 0);

  const vacantBeds = useMemo(
    () =>
      rooms
        .filter((r) => r.buildingId === fBldg)
        .flatMap((r) => r.beds.filter((b) => !b.occupantId).map((b) => ({ room: r, bed: b }))),
    [rooms, fBldg]
  );

  const doPay = (id: string, due: number) => {
    const a = Number(amt) || due;
    recordPayment(id, a, mode);
    setPayFor(null);
    setAmt("");
  };

  const doAdd = () => {
    if (fName.trim().length < 2 || !/^[0-9]{10}$/.test(fPhone) || !fRoom) return;
    const [roomId, bedId] = fRoom.split("|");
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;
    const price =
      room.sharing === "Triple"
        ? PGS.find((p) => p.id === room.buildingId)!.triple
        : room.sharing === "Twin"
          ? PGS.find((p) => p.id === room.buildingId)!.twin
          : PGS.find((p) => p.id === room.buildingId)!.single;
    addResident({
      name: fName.trim(), phone: fPhone, buildingId: room.buildingId,
      roomId, bedId, sharing: room.sharing, rent: price, since: fSince,
      status: "Due",
    });
    setFName(""); setFPhone(""); setFRoom(""); setShowAdd(false);
  };

  const roomLabel = (roomId: string) => {
    const r = rooms.find((x) => x.id === roomId);
    return r ? `R${r.number} · ${r.sharing}` : "—";
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="🔍 Search name / phone…"
          className="min-w-52 flex-1 rounded-full border border-linen bg-white px-4 py-2 text-sm outline-none focus:border-terra sm:max-w-xs"
        />
        <select value={bldg} onChange={(e) => setBldg(e.target.value)} className="rounded-full border border-linen bg-white px-3 py-2 text-sm">
          <option value="all">All buildings</option>
          {PGS.map((b) => (
            <option key={b.id} value={b.id}>{b.short}</option>
          ))}
        </select>
        <button
          onClick={() => setOnlyDues(!onlyDues)}
          className={`rounded-full border px-4 py-2 text-sm font-bold ${onlyDues ? "border-red-700 bg-red-700 text-white" : "border-linen bg-white"}`}
        >
          Dues only ({residents.filter((r) => r.status === "Due").length})
        </button>
        <span className="rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-900">
          Total dues: {inr(duesTotal)}
        </span>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="ml-auto flex items-center gap-1 rounded-full bg-terra px-4 py-2 text-sm font-bold text-white hover:bg-terradark"
        >
          <Plus size={15} /> Check-in resident
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 grid gap-2 rounded-3xl border border-dashed border-terra bg-terrasoft/40 p-4 sm:grid-cols-3 lg:grid-cols-6">
          <input value={fName} onChange={(e) => setFName(e.target.value)} placeholder="Full name" className={inp} />
          <input value={fPhone} onChange={(e) => setFPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit phone" inputMode="numeric" className={inp} />
          <select value={fBldg} onChange={(e) => { setFBldg(e.target.value); setFRoom(""); }} className={inp}>
            {PGS.map((b) => (
              <option key={b.id} value={b.id}>{b.short}</option>
            ))}
          </select>
          <select value={fRoom} onChange={(e) => setFRoom(e.target.value)} className={inp}>
            <option value="">Vacant bed… ({vacantBeds.length})</option>
            {vacantBeds.slice(0, 60).map(({ room, bed }) => (
              <option key={bed.id} value={`${room.id}|${bed.id}`}>
                R{room.number} · {bed.label} ({room.sharing})
              </option>
            ))}
          </select>
          <input value={fSince} onChange={(e) => setFSince(e.target.value)} placeholder="Since" className={inp} />
          <button onClick={doAdd} className="rounded-full bg-ink py-2 text-sm font-bold text-white">Check in</button>
        </div>
      )}

      <div className="overflow-auto rounded-3xl border border-linen bg-white shadow">
        <table className="w-full min-w-[860px] border-collapse text-sm">
          <thead>
            <tr className="bg-ink text-left text-xs text-orange-100">
              {["Resident", "Building / Room", "Rent", "Status", "Reminder", "Actions"].map((h) => (
                <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.slice(0, 120).map((r) => {
              const pg = PGS.find((p) => p.id === r.buildingId);
              return (
                <tr key={r.id} className="border-t border-linen hover:bg-cream">
                  <td className="px-3 py-2">
                    <b>{r.name}</b>
                    <span className="block text-xs text-faded">
                      <a href={`tel:+91${r.phone}`} className="hover:underline">+91 {r.phone}</a> · since {r.since}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs">{pg?.short} · {roomLabel(r.roomId)}</td>
                  <td className="px-3 py-2">
                    {inr(r.rent)}
                    {r.status === "Due" && <span className="block text-xs font-bold text-red-700">{inr(r.due)} due</span>}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${r.status === "Paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {r.status === "Due" ? (
                      <a
                        href={waLink(r.phone, rentReminderMsg(r.name, pg?.name || "Laxmi Balaji PG", r.due, r.dueDate))}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => markReminderSent(r.id)}
                        className="inline-flex items-center gap-1 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white"
                        title="Send rent reminder on WhatsApp"
                      >
                        <MessageCircle size={13} /> Remind
                      </a>
                    ) : (
                      <span className="text-xs text-faded">—</span>
                    )}
                    {r.lastReminder && <span className="block text-[11px] text-faded">nudged: {r.lastReminder}</span>}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => { setPayFor(payFor === r.id ? null : r.id); setAmt(""); }}
                        className="rounded-full bg-terrasoft px-3 py-1.5 text-xs font-bold text-terradark"
                      >
                        {r.status === "Due" ? "Collect" : "Record"}
                      </button>
                      <a
                        href={`tel:+91${r.phone}`}
                        className="rounded-full border border-linen p-1.5"
                        title="Call"
                      >
                        <Phone size={13} />
                      </a>
                      <button
                        onClick={() => {
                          if (confirm(`Check out ${r.name}? Bed will become vacant.`)) removeResident(r.id);
                        }}
                        className="rounded-full border border-linen p-1.5 text-red-700"
                        title="Check out"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    {payFor === r.id && (
                      <div className="mt-1.5 flex gap-1">
                        <input
                          value={amt}
                          onChange={(e) => setAmt(e.target.value.replace(/\D/g, ""))}
                          placeholder={`${r.due}`}
                          inputMode="numeric"
                          className="w-20 rounded-lg border border-linen px-2 py-1 text-xs"
                        />
                        <select value={mode} onChange={(e) => setMode(e.target.value)} className="rounded-lg border border-linen px-1 py-1 text-xs">
                          <option>UPI</option><option>Cash</option><option>Bank</option>
                        </select>
                        <button onClick={() => doPay(r.id, r.due)} className="rounded-lg bg-leaf px-2 py-1 text-xs font-bold text-white">
                          ✓
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {list.length > 120 && (
          <p className="p-3 text-xs text-faded">Showing first 120 of {list.length} — use search / filters to narrow down.</p>
        )}
      </div>

      <h3 className="mt-6 mb-2 font-display text-xl">Latest receipts ({payments.length})</h3>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {payments.slice(0, 8).map((p) => {
          const r = residents.find((x) => x.id === p.residentId);
          return (
            <div key={p.id} className="rounded-2xl border border-linen bg-white p-3 text-sm shadow">
              <b>{inr(p.amount)}</b> <span className="text-xs text-faded">· {p.mode}</span>
              <span className="block text-xs">{r?.name || "—"} · {p.date}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
