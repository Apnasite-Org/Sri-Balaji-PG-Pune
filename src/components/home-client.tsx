"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { LOCALITIES, MENU, OWNER_PHONE, OWNER_PHONE_LABEL, inr, PGS } from "@/lib/data";
import { useApp } from "@/lib/store";

// ─── Hero search → /pgs with filters ─────────────────────────────────────────
export function SearchCard() {
  const router = useRouter();
  const [loc, setLoc] = useState("");
  const [sharing, setSharing] = useState("");
  const [budget, setBudget] = useState("");

  const go = () => {
    const q = new URLSearchParams();
    if (loc) q.set("locality", loc);
    if (sharing) q.set("sharing", sharing);
    if (budget) q.set("budget", budget);
    router.push(`/pgs?${q.toString()}`);
  };

  const sel =
    "w-full rounded-xl border border-linen bg-white px-3 py-2.5 text-sm font-medium outline-none focus:border-terra";
  return (
    <div className="mt-5 rounded-3xl border border-linen bg-white p-4 shadow-[0_12px_32px_rgba(185,90,60,0.10)]">
      <div className="grid items-end gap-2.5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <label className="text-[11px] font-extrabold tracking-wider text-faded uppercase">
          Locality
          <select value={loc} onChange={(e) => setLoc(e.target.value)} className={`${sel} mt-1 normal-case`}>
            <option value="">All localities</option>
            {LOCALITIES.map((l) => (
              <option key={l.name}>{l.name}</option>
            ))}
          </select>
        </label>
        <label className="text-[11px] font-extrabold tracking-wider text-faded uppercase">
          Sharing
          <select value={sharing} onChange={(e) => setSharing(e.target.value)} className={`${sel} mt-1 normal-case`}>
            <option value="">Any sharing</option>
            <option>Single</option>
            <option>Twin</option>
            <option>Triple</option>
          </select>
        </label>
        <label className="text-[11px] font-extrabold tracking-wider text-faded uppercase">
          Budget
          <select value={budget} onChange={(e) => setBudget(e.target.value)} className={`${sel} mt-1 normal-case`}>
            <option value="">Any budget</option>
            <option value="6000">Under ₹6,000</option>
            <option value="8000">Under ₹8,000</option>
            <option value="12000">Under ₹12,000</option>
          </select>
        </label>
        <button
          onClick={go}
          className="flex items-center justify-center gap-1.5 rounded-full bg-terra px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-terra/30 transition hover:bg-terradark"
        >
          <Search size={16} /> Find my room
        </button>
      </div>
      <p className="mt-2 px-1 text-xs text-faded">
        Showing all 8 homes · starting {inr(Math.min(...PGS.map((p) => p.triple)))}/mo all-inclusive
      </p>
    </div>
  );
}

// ─── Food today (client: avoids date hydration mismatch) ─────────────────────
export function FoodSection() {
  const days = Object.keys(MENU);
  const [day, setDay] = useState("Monday");
  useEffect(() => {
    setDay(days[(new Date().getDay() + 6) % 7]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const m = MENU[day];
  const meals: [string, string][] = [
    ["🌅 Breakfast", m.b],
    ["☀️ Lunch", m.l],
    ["☕ Evening", m.s],
    ["🌙 Dinner", m.d],
  ];
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {meals.map(([t, v]) => (
          <div key={t} className="rounded-2xl border border-linen bg-white p-4 shadow">
            <b className="text-xs tracking-wider text-terradark uppercase">{t}</b>
            <p className="mt-1 font-semibold">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${
              d === day ? "border-ink bg-ink text-white" : "border-linen bg-white hover:border-terra"
            }`}
          >
            {d.slice(0, 3)}
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-2xl bg-ink p-5 text-sm text-orange-100 shadow-xl">
        <b className="text-white">📋 {day}&apos;s full menu</b>
        <br />🌅 Breakfast: {m.b}
        <br />☀️ Lunch: {m.l}
        <br />☕ Snacks: {m.s}
        <br />🌙 Dinner: {m.d}
        <br />
        <span className="text-xs opacity-70">
          Non-veg (chicken/egg) Wed · Sat · Sun · Jain on request
        </span>
      </div>
    </>
  );
}

// ─── Callback form (contact section) ─────────────────────────────────────────
export function CallbackForm() {
  const { toast } = useApp();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loc, setLoc] = useState(LOCALITIES[0].name);
  const [share, setShare] = useState("Twin");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(mobile)) {
      toast("Enter a valid 10-digit mobile number");
      return;
    }
    try {
      const arr = JSON.parse(localStorage.getItem("lb_callbacks") || "[]");
      arr.unshift({ name, mobile, loc, share, at: new Date().toISOString() });
      localStorage.setItem("lb_callbacks", JSON.stringify(arr));
    } catch {
      /* ignore */
    }
    setDone(true);
    toast(`Thanks ${name}! We'll call within 30 minutes.`);
    setName("");
    setMobile("");
  };

  const inp =
    "w-full rounded-xl border border-linen bg-[#fffefb] px-3.5 py-2.5 text-sm outline-none focus:border-terra";
  return (
    <form onSubmit={submit} className="grid gap-2.5 rounded-3xl bg-white p-6 text-ink shadow-2xl">
      <h3 className="font-display text-2xl">📞 Request a callback</h3>
      <p className="-mt-1 text-sm text-faded">
        Tell us where you&apos;d like to stay — or call{" "}
        <a href={`tel:${OWNER_PHONE}`} className="font-bold text-terradark">
          {OWNER_PHONE_LABEL}
        </a>
      </p>
      <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" className={inp} />
      <input
        value={mobile}
        onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
        required
        placeholder="Mobile number (10 digits)"
        inputMode="numeric"
        className={inp}
      />
      <select value={loc} onChange={(e) => setLoc(e.target.value)} className={inp}>
        {LOCALITIES.map((l) => (
          <option key={l.name}>{l.name}</option>
        ))}
        <option>Not sure yet</option>
      </select>
      <select value={share} onChange={(e) => setShare(e.target.value)} className={inp}>
        <option>Twin</option>
        <option>Triple</option>
        <option>Single</option>
      </select>
      <button className="rounded-full bg-terra py-2.5 text-sm font-bold text-white shadow-lg shadow-terra/30 transition hover:bg-terradark">
        Call me back →
      </button>
      {done && (
        <p className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          ✅ Thanks! We&apos;ll call you within 30 minutes (10 AM – 8 PM).
        </p>
      )}
    </form>
  );
}
