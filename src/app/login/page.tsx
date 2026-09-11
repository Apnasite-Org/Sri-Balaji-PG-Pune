"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEMO_OTP } from "@/lib/data";
import { useApp } from "@/lib/store";

export default function LoginPage() {
  const { login, toast, phone } = useApp();
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");

  if (phone) {
    router.replace("/dashboard");
    return <p className="mx-auto max-w-md px-4 py-16 text-sm text-faded">Redirecting to dashboard…</p>;
  }

  const send = () => {
    if (!/^[0-9]{10}$/.test(mobile)) {
      setErr("Enter a valid 10-digit mobile number.");
      return;
    }
    setErr("");
    setStep(2);
  };

  const verify = () => {
    if (otp.trim() !== DEMO_OTP) {
      setErr("Incorrect OTP. Demo OTP is 1234.");
      return;
    }
    login(mobile);
    toast("Welcome! Logged in successfully 🎉");
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="rounded-3xl border border-linen bg-white p-7 shadow-xl">
        {step === 1 ? (
          <>
            <h1 className="font-display text-3xl">👋 Welcome to Laxmi Balaji</h1>
            <p className="mt-1 text-sm text-faded">
              Login with your mobile number. Residents see rent & room; newcomers see rooms for them.
            </p>
            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile number"
              inputMode="numeric"
              className="mt-4 w-full rounded-xl border border-linen bg-[#fffefb] px-3.5 py-2.5 text-sm outline-none focus:border-terra"
            />
            <button
              onClick={send}
              className="mt-2.5 w-full rounded-full bg-terra py-2.5 text-sm font-bold text-white shadow-lg shadow-terra/30 transition hover:bg-terradark"
            >
              Send OTP →
            </button>
            <div className="mt-3 rounded-xl border border-dashed border-orange-300 bg-cream p-3 text-xs">
              📱 <b>Try demo:</b>
              <br />
              Resident:{" "}
              <button className="font-bold text-terradark underline" onClick={() => setMobile("9876543210")}>
                98765 43210
              </button>{" "}
              (Aarav · PG-2)
              <br />
              Resident:{" "}
              <button className="font-bold text-terradark underline" onClick={() => setMobile("9123456780")}>
                91234 56780
              </button>{" "}
              (Priya · PG-3)
              <br />
              New visitor: any other 10-digit number
            </div>
          </>
        ) : (
          <>
            <h1 className="font-display text-3xl">🔐 Enter OTP</h1>
            <p className="mt-1 text-sm text-faded">
              Sent to <b>+91 {mobile}</b>. (Demo OTP: <b>1234</b>)
            </p>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="••••"
              inputMode="numeric"
              className="mt-4 w-full rounded-xl border border-linen bg-[#fffefb] px-3.5 py-2.5 text-center text-xl tracking-[0.5em] outline-none focus:border-terra"
            />
            <button
              onClick={verify}
              className="mt-2.5 w-full rounded-full bg-terra py-2.5 text-sm font-bold text-white shadow-lg shadow-terra/30 transition hover:bg-terradark"
            >
              Verify & continue →
            </button>
            <button onClick={() => setStep(1)} className="mt-2 text-sm font-bold text-terradark underline">
              ← change number
            </button>
          </>
        )}
        {err && (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>
        )}
      </div>
    </div>
  );
}
