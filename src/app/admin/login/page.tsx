"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { ADMIN_PIN, ADMIN_SESSION_KEY } from "@/lib/admin-data";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  const go = () => {
    if (pin.trim() !== ADMIN_PIN) {
      setErr("Wrong PIN. Demo PIN is 1234.");
      return;
    }
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ at: Date.now() }));
    router.push("/admin");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="rounded-3xl border border-linen bg-white p-7 shadow-xl">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-white">
          <ShieldCheck size={24} />
        </span>
        <h1 className="mt-3 font-display text-3xl">Owner Admin</h1>
        <p className="mt-1 text-sm text-faded">
          One-stop command center for all 8 Laxmi Balaji buildings. Enter your admin PIN.
        </p>
        <input
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
          onKeyDown={(e) => e.key === "Enter" && go()}
          placeholder="••••"
          inputMode="numeric"
          type="password"
          className="mt-4 w-full rounded-xl border border-linen bg-[#fffefb] px-3.5 py-2.5 text-center text-xl tracking-[0.5em] outline-none focus:border-terra"
        />
        <button
          onClick={go}
          className="mt-2.5 w-full rounded-full bg-ink py-2.5 text-sm font-bold text-white transition hover:opacity-90"
        >
          Open dashboard →
        </button>
        <p className="mt-3 rounded-xl border border-dashed border-orange-300 bg-cream p-3 text-xs">
          🔑 Demo PIN: <b>1234</b> (change <code>ADMIN_PIN</code> in <code>src/lib/admin-data.ts</code>)
        </p>
        {err && (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>
        )}
      </div>
    </div>
  );
}
