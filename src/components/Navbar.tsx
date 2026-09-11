"use client";

import Link from "next/link";
import { useState } from "react";
import { Home, Menu, Phone, UserRound, X } from "lucide-react";
import { useApp } from "@/lib/store";

const LINKS = [
  { href: "/pgs", label: "Our PGs" },
  { href: "/#prices", label: "Prices" },
  { href: "/#food", label: "Food" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const { phone, openCallback } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-ink text-xs text-orange-100">
        <div className="page-shell flex flex-wrap justify-between gap-1 py-1.5">
          <span>🏠 8 homes · Hinjewadi · Wakad · Baner · Marunji · Kharadi</span>
          <span className="hidden sm:inline">Visits open 10 AM – 8 PM, all days</span>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-linen bg-cream/90 backdrop-blur-md">
        <div className="page-shell flex items-center gap-4 py-2.5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-terra text-lg text-white shadow-lg shadow-terra/25">
              <Home size={20} />
            </span>
            <span className="font-display text-xl leading-none font-bold">
              Laxmi Balaji
              <small className="block font-body text-[10px] font-extrabold tracking-[0.22em] text-faded">
                PG · PUNE
              </small>
            </span>
          </Link>
          <nav className="ml-auto hidden items-center gap-5 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-semibold text-cocoa hover:text-terra"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <button
              onClick={() => openCallback()}
              className="hidden items-center gap-1.5 rounded-full border border-linen bg-white px-4 py-2 text-sm font-bold transition hover:border-terra hover:text-terra sm:flex"
            >
              <Phone size={15} /> Callback
            </button>
            <Link
              href={phone ? "/dashboard" : "/login"}
              className="flex items-center gap-1.5 rounded-full bg-terra px-4 py-2 text-sm font-bold text-white shadow-lg shadow-terra/30 transition hover:bg-terradark"
            >
              <UserRound size={15} />
              {phone ? "Dashboard" : "Login"}
            </Link>
            <button
              className="rounded-lg border border-linen bg-white p-2 lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 border-t border-linen bg-cream px-4 py-3 lg:hidden">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 text-sm font-semibold hover:bg-parchment"
              >
                {l.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                openCallback();
              }}
              className="mt-1 rounded-full border border-linen bg-white px-4 py-2 text-sm font-bold"
            >
              📞 Request Callback
            </button>
          </nav>
        )}
      </header>
    </>
  );
}
