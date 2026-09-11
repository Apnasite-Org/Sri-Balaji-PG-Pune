"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import PGCard from "@/components/PGCard";
import { FACILITIES, PGS, REVIEWS, inr } from "@/lib/data";
import { useApp } from "@/lib/store";

export default function PGDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { openCallback, toast } = useApp();
  const [photo, setPhoto] = useState(0);
  const pg = PGS.find((p) => p.id === id);
  if (!pg) return notFound();

  const others = PGS.filter((p) => p.id !== pg.id && (p.locality === pg.locality || p.type === pg.type)).slice(0, 3);

  return (
    <div className="page-shell py-8">
      <Link href="/pgs" className="inline-flex items-center gap-1 text-sm font-bold text-terradark hover:underline">
        <ArrowLeft size={15} /> All PGs
      </Link>

      <div className="mt-3 grid gap-6 lg:grid-cols-2">
        <div>
          <div className="relative h-72 overflow-hidden rounded-3xl shadow-lg sm:h-96">
            <Image src={pg.images[photo]} alt={pg.name} fill className="object-cover" priority />
            {pg.flagship && (
              <span className="absolute top-3 right-3 rounded-full bg-terra px-3 py-1 text-xs font-extrabold text-white shadow">
                ⭐ Flagship PG
              </span>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            {pg.images.map((u, i) => (
              <button
                key={u}
                onClick={() => setPhoto(i)}
                className={`relative h-16 w-24 overflow-hidden rounded-xl ${i === photo ? "ring-2 ring-terra" : "opacity-70"}`}
              >
                <Image src={u} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-extrabold tracking-[0.16em] text-terradark uppercase">
            {pg.locality} · {pg.for}
          </p>
          <h1 className="font-display text-4xl">{pg.name}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-faded">
            <MapPin size={14} /> {pg.address}
          </p>
          <p className="mt-1 text-sm">
            <Star size={14} className="inline fill-sun text-sun" /> <b>{pg.rating}</b> · {pg.reviewsCount} reviews ·{" "}
            <b className="text-leaf">● {pg.bedsLeft} beds left</b>
          </p>
          <p className="mt-3 text-[15px] text-cocoa">{pg.description}</p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {([["Triple", pg.triple], ["Twin / Double", pg.twin], ["Single", pg.single]] as const).map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-linen bg-white p-3 text-center shadow">
                <span className="text-xs text-faded">{k}</span>
                <b className="block font-display text-xl text-terradark">{inr(v)}</b>
                <span className="text-[11px] text-faded">/month all-inclusive</span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-linen bg-white p-4 text-sm shadow">
            <b>Nearby</b>
            <br />
            {pg.nearby.map(([a, b]) => (
              <span key={a} className="mt-1 block text-cocoa">
                📍 {a} — <b>{b}</b>
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => openCallback(pg.name)}
              className="rounded-full bg-terra px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-terra/30 transition hover:bg-terradark"
            >
              📞 Request callback
            </button>
            <button
              onClick={() => toast(`Visit for ${pg.name} noted! We'll confirm on SMS shortly.`)}
              className="rounded-full border border-linen bg-white px-6 py-2.5 text-sm font-bold transition hover:border-terra hover:text-terra"
            >
              📅 Schedule visit
            </button>
            <a
              href={pg.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-terrasoft px-6 py-2.5 text-sm font-bold text-terradark transition hover:bg-orange-200"
            >
              🗺️ Open location
            </a>
          </div>
        </div>
      </div>

      {/* facilities */}
      <h2 className="mt-10 font-display text-2xl">Facilities at {pg.short}</h2>
      <div className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {FACILITIES.map((f) => (
          <div key={f.title} className="rounded-2xl border border-linen bg-white p-3.5 text-sm shadow">
            <b>{f.title}</b>
            <span className="block text-xs text-faded">{f.desc}</span>
          </div>
        ))}
      </div>

      {/* map */}
      <h2 className="mt-10 font-display text-2xl">Building location</h2>
      <iframe
        title={`${pg.name} map`}
        src={`https://www.google.com/maps?q=${pg.lat},${pg.lng}&z=16&output=embed`}
        loading="lazy"
        className="mt-3 h-72 w-full rounded-3xl border border-linen shadow"
      />

      {/* reviews */}
      <h2 className="mt-10 font-display text-2xl">What residents say</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {REVIEWS.slice(0, 3).map((r) => (
          <div key={r.name} className="rounded-2xl border border-linen bg-white p-4 text-sm shadow">
            {"⭐".repeat(r.stars)}
            <p className="mt-1">“{r.text}”</p>
            <b className="mt-2 block">{r.name}</b>
            <span className="text-xs text-faded">{r.pg}</span>
          </div>
        ))}
      </div>

      {/* others */}
      {others.length > 0 && (
        <>
          <h2 className="mt-10 font-display text-2xl">You may also like</h2>
          <div className="mt-3 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <PGCard key={p.id} pg={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
