"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PGCard, { SectionHead } from "@/components/PGCard";
import { PGS } from "@/lib/data";

function List() {
  const q = useSearchParams();
  const type = q.get("type") || "All";
  const locality = q.get("locality") || "";
  const sharing = q.get("sharing") || "";
  const budget = Number(q.get("budget") || 0);

  const res = PGS.filter(
    (p) =>
      (type === "All" || p.type === type) &&
      (!locality || p.locality === locality) &&
      (!budget || Math.min(p.triple, p.twin, p.single) <= budget)
  );

  const shown = sharing
    ? [...res].sort((a, b) =>
        sharing === "Single" ? a.single - b.single : sharing === "Twin" ? a.twin - b.twin : a.triple - b.triple
      )
    : res;

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        {["All", "Boys", "Girls", "Co-living"].map((t) => (
          <a
            key={t}
            href={`/pgs${t === "All" ? "" : `?type=${t}`}`}
            className={`rounded-full border px-4 py-1.5 text-sm font-bold transition ${
              type === t ? "border-ink bg-ink text-white" : "border-linen bg-white hover:border-terra"
            }`}
          >
            {t === "All" ? `All 8` : t === "Co-living" ? "Co-living" : `${t}`}
          </a>
        ))}
      </div>
      <p className="mb-4 text-sm text-faded">
        Showing {shown.length} home{shown.length !== 1 ? "s" : ""}
        {locality ? ` in ${locality}` : ""} · all prices all-inclusive, zero brokerage.
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((p) => (
          <PGCard key={p.id} pg={p} />
        ))}
      </div>
    </>
  );
}

export default function PGsPage() {
  return (
    <div className="page-shell py-10">
      <SectionHead
        kicker="Our PGs"
        title="All 8 Laxmi Balaji homes"
        sub="Filter by Boys / Girls / Co-living, or search from the home page by locality and budget."
      />
      <Suspense fallback={<p className="text-sm text-faded">Loading homes…</p>}>
        <List />
      </Suspense>
    </div>
  );
}
