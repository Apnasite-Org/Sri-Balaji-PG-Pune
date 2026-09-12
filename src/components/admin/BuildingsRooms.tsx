"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PGS } from "@/lib/data";
import type { Sharing } from "@/lib/admin-data";
import { useAdmin } from "@/lib/admin-store";

export default function BuildingsRooms() {
  const { rooms, residents, vacateBed, addRoom } = useAdmin();
  const [bldg, setBldg] = useState(PGS[0].id);
  const [showAdd, setShowAdd] = useState(false);
  const [floor, setFloor] = useState("1");
  const [number, setNumber] = useState("");
  const [sharing, setSharing] = useState<Sharing>("Twin");

  const bRooms = useMemo(
    () => rooms.filter((r) => r.buildingId === bldg).sort((a, b) => a.number.localeCompare(b.number)),
    [rooms, bldg]
  );
  const beds = bRooms.flatMap((r) => r.beds);
  const occ = beds.filter((b) => b.occupantId).length;
  const byFloor = useMemo(() => {
    const m = new Map<number, typeof bRooms>();
    for (const r of bRooms) {
      if (!m.has(r.floor)) m.set(r.floor, []);
      m.get(r.floor)!.push(r);
    }
    return [...m.entries()].sort((a, b) => a[0] - b[0]);
  }, [bRooms]);

  const nameOf = (id: string | null) => residents.find((r) => r.id === id)?.name || "—";

  const submitRoom = () => {
    if (!number.trim()) return;
    addRoom(bldg, Number(floor) || 1, number.trim(), sharing);
    setNumber("");
    setShowAdd(false);
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {PGS.map((b) => (
          <button
            key={b.id}
            onClick={() => setBldg(b.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${
              bldg === b.id ? "border-ink bg-ink text-white" : "border-linen bg-white hover:border-terra"
            }`}
          >
            {b.short}
          </button>
        ))}
      </div>

      {(() => {
        const b = PGS.find((x) => x.id === bldg)!;
        return (
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-3xl border border-linen bg-white p-4 shadow">
            <div>
              <h3 className="font-display text-xl">{b.name}</h3>
              <p className="text-xs text-faded">📍 {b.address}</p>
            </div>
            <div className="ml-auto flex gap-4 text-center">
              <div><b className="font-display text-xl">{bRooms.length}</b><span className="block text-xs text-faded">rooms</span></div>
              <div><b className="font-display text-xl">{occ}/{beds.length}</b><span className="block text-xs text-faded">beds full</span></div>
              <div><b className="font-display text-xl">{beds.length - occ}</b><span className="block text-xs text-faded">vacant</span></div>
            </div>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-1 rounded-full bg-terra px-4 py-2 text-sm font-bold text-white hover:bg-terradark"
            >
              <Plus size={15} /> Add room
            </button>
          </div>
        );
      })()}

      {showAdd && (
        <div className="mb-4 grid gap-2 rounded-3xl border border-dashed border-terra bg-terrasoft/40 p-4 sm:grid-cols-4">
          <label className="text-xs font-bold">Floor
            <input value={floor} onChange={(e) => setFloor(e.target.value)} inputMode="numeric" className="mt-1 w-full rounded-xl border border-linen bg-white px-3 py-2 text-sm" />
          </label>
          <label className="text-xs font-bold">Room no.
            <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g. 305" className="mt-1 w-full rounded-xl border border-linen bg-white px-3 py-2 text-sm" />
          </label>
          <label className="text-xs font-bold">Sharing
            <select value={sharing} onChange={(e) => setSharing(e.target.value as Sharing)} className="mt-1 w-full rounded-xl border border-linen bg-white px-3 py-2 text-sm">
              <option>Triple</option><option>Twin</option><option>Single</option>
            </select>
          </label>
          <button onClick={submitRoom} className="self-end rounded-full bg-ink py-2 text-sm font-bold text-white">
            Create room
          </button>
        </div>
      )}

      {byFloor.map(([f, list]) => (
        <div key={f} className="mb-4">
          <h4 className="mb-2 text-sm font-extrabold tracking-wider text-faded uppercase">Floor {f}</h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((r) => (
              <div key={r.id} className="rounded-2xl border border-linen bg-white p-3.5 shadow">
                <div className="flex items-center justify-between">
                  <b>Room {r.number}</b>
                  <span className="rounded-full bg-parchment px-2.5 py-0.5 text-xs font-bold">{r.sharing}</span>
                </div>
                <div className="mt-2 space-y-1.5">
                  {r.beds.map((bd) => (
                    <div
                      key={bd.id}
                      className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs ${
                        bd.occupantId ? "bg-sagesoft" : "border border-dashed border-linen bg-cream"
                      }`}
                    >
                      <span className="font-bold">{bd.label}</span>
                      <span className="flex-1 truncate">{bd.occupantId ? `🟢 ${nameOf(bd.occupantId)}` : "⚪ Vacant"}</span>
                      {bd.occupantId && (
                        <button
                          onClick={() => {
                            if (confirm(`Check out ${nameOf(bd.occupantId)} from Room ${r.number}?`)) vacateBed(r.id, bd.id);
                          }}
                          className="font-bold text-red-700 underline"
                          title="Check out resident"
                        >
                          Vacate
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
