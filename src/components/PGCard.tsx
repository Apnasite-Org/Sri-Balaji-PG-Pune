"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { inr, type PG } from "@/lib/data";
import { useApp } from "@/lib/store";

const badge: Record<PG["type"], string> = {
  Girls: "bg-pink-100 text-pink-800",
  Boys: "bg-blue-100 text-blue-900",
  "Co-living": "bg-sagesoft text-emerald-900",
};

const badgeLabel: Record<PG["type"], string> = {
  Girls: "👩 Girls PG",
  Boys: "👦 Boys PG",
  "Co-living": "🤝 Co-living",
};

export default function PGCard({ pg }: { pg: PG }) {
  const { openCallback } = useApp();
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-linen bg-white shadow-[0_12px_32px_rgba(185,90,60,0.10)] transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52">
        <Image src={pg.images[0]} alt={pg.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
        <span className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-extrabold shadow ${badge[pg.type]}`}>
          {badgeLabel[pg.type]}
        </span>
        {pg.flagship && (
          <span className="absolute top-3 right-3 rounded-full bg-terra px-3 py-1 text-xs font-extrabold text-white shadow">
            ⭐ Flagship
          </span>
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-leaf px-3 py-1 text-xs font-extrabold text-white">
          ● {pg.bedsLeft} beds left
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-xl leading-tight">{pg.name}</h3>
        <p className="flex items-center gap-1 text-sm text-faded">
          <MapPin size={14} /> {pg.locality} ·{" "}
          <Star size={14} className="fill-sun text-sun" /> {pg.rating} ({pg.reviewsCount})
        </p>
        <div className="my-1 grid grid-cols-3 gap-2">
          {([["Triple", pg.triple], ["Twin", pg.twin], ["Single", pg.single]] as const).map(([k, v]) => (
            <div key={k} className="rounded-xl border border-dashed border-linen bg-cream px-1 py-2 text-center text-xs">
              {k}
              <b className="block text-sm text-terradark">{inr(v)}/mo</b>
            </div>
          ))}
        </div>
        <div className="mt-auto flex gap-2 pt-1">
          <Link
            href={`/pgs/${pg.id}`}
            className="flex-1 rounded-full bg-terrasoft py-2.5 text-center text-sm font-bold text-terradark transition hover:bg-orange-200"
          >
            View details
          </Link>
          <button
            onClick={() => openCallback(pg.name)}
            className="flex-1 rounded-full bg-terra py-2.5 text-sm font-bold text-white shadow-lg shadow-terra/30 transition hover:bg-terradark"
          >
            Book visit
          </button>
        </div>
      </div>
    </div>
  );
}

export function SectionHead({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="mb-1 text-xs font-extrabold tracking-[0.16em] text-terradark uppercase">{kicker}</p>
        <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
      </div>
      {sub && <p className="max-w-md text-sm text-faded">{sub}</p>}
    </div>
  );
}
