import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import PGCard, { SectionHead } from "@/components/PGCard";
import { CallbackForm, FoodSection, SearchCard } from "@/components/home-client";
import {
  FACILITIES,
  FAQS,
  FLAGSHIP_MAPS_URL,
  LOCALITIES,
  OWNER_EMAIL,
  OWNER_PHONE,
  OWNER_PHONE_LABEL,
  PGS,
  REVIEWS,
  inr,
} from "@/lib/data";

const FAC_ICON: Record<string, string> = {
  wifi: "📶",
  meals: "🍛",
  shield: "🛡️",
  clean: "🧹",
  power: "🔥",
  laundry: "👕",
  bed: "🛏️",
  tv: "📺",
};

export default function Home() {
  const flagship = PGS.find((p) => p.flagship)!;
  const featured = [flagship, ...PGS.filter((p) => !p.flagship).slice(0, 2)];

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="page-shell grid items-center gap-8 pt-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className="inline-block rounded-full border border-linen bg-white px-3.5 py-1.5 text-xs font-bold shadow">
            ✨ Hinjewadi&apos;s cozy PG family · Since 2019
          </span>
          <h1 className="mt-3 font-display text-4xl leading-[1.15] sm:text-6xl">
            <span className="font-hindi font-normal">घर जैसा comfort,</span>
            <br />
            <em className="text-terra">near Hinjewadi IT Park.</em>
          </h1>
          <p className="mt-3 max-w-xl text-cocoa">
            8 warm, well-kept Laxmi Balaji homes across Hinjewadi, Wakad, Baner, Marunji &
            Kharadi. Homely food, fast Wi-Fi, daily housekeeping — starting{" "}
            {inr(Math.min(...PGS.map((p) => p.triple)))}/mo all-inclusive.
          </p>
          <SearchCard />
          <div className="mt-5 flex gap-7">
            {[
              ["4.6★", "900+ Google reviews"],
              ["500+", "residents at home"],
              ["100%", "meals + Wi-Fi included"],
            ].map(([b, s]) => (
              <div key={s}>
                <b className="block font-display text-2xl">{b}</b>
                <span className="text-xs text-faded">{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="grid grid-cols-[1.2fr_0.8fr] grid-rows-[220px_170px] gap-3">
            <Image
              src={flagship.images[0]}
              alt="Cozy PG room"
              width={700}
              height={560}
              priority
              className="row-span-2 h-full w-full rounded-2xl object-cover shadow-lg"
            />
            <Image
              src={flagship.images[1]}
              alt="Bright living space"
              width={500}
              height={220}
              className="h-full w-full rounded-2xl object-cover shadow-lg"
            />
            <Image
              src={flagship.images[2]}
              alt="Comfortable bedroom"
              width={500}
              height={170}
              className="h-full w-full rounded-2xl object-cover shadow-lg"
            />
          </div>
          <div className="absolute top-3 right-3 rounded-xl border border-linen bg-white px-3 py-1.5 text-xs font-bold shadow">
            ⭐ 4.6 · Loved by residents
          </div>
          <div className="absolute -left-2 bottom-16 rounded-xl border border-linen bg-white px-3 py-1.5 text-xs font-semibold shadow">
            🍛 3 homely meals daily
          </div>
          <div className="absolute right-4 bottom-3 rounded-xl border border-linen bg-white px-3 py-1.5 text-xs font-semibold shadow">
            🔑 PG-2 Twin @ <b>{inr(flagship.twin)}/mo</b>
          </div>
        </div>
      </section>

      {/* ─── TRUST STRIP ─── */}
      <div className="page-shell mt-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl bg-ink px-5 py-3 text-sm text-orange-100">
          <span className="opacity-70">Minutes away from</span>
          <b>Infotech Park</b>·<b>Laxmi Chowk</b>·<b>Grand Highstreet</b>·<b>Xion Mall</b>·
          <b>Baner IT Hub</b>·<b>EON Kharadi</b>
        </div>
      </div>

      {/* ─── LOCALITIES ─── */}
      <section className="page-shell pt-14">
        <SectionHead
          kicker="Where we are"
          title="5 areas, 8 homes"
          sub="Live close to office or college. Every Laxmi Balaji PG is walkable to food streets, bus stops and daily essentials."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {LOCALITIES.map((l) => (
            <Link
              key={l.name}
              href={`/pgs?locality=${encodeURIComponent(l.name)}`}
              className="rounded-2xl border border-linen bg-white p-4 shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <b className="block text-sm">{l.name}</b>
              <span className="text-xs text-faded">{l.note}</span>
              <br />
              <em className="mt-1 inline-block rounded-full bg-sagesoft px-2.5 py-0.5 text-xs font-extrabold text-emerald-900 not-italic">
                {l.count} home{l.count > 1 ? "s" : ""}
              </em>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── PG LISTINGS ─── */}
      <section className="page-shell pt-14" id="pgs">
        <SectionHead
          kicker="Our PGs"
          title="Pick a home that feels like yours"
          sub="Flagship PG-2 in Hinjewadi Phase 1 leads the family — same kitchen, same care in all 8 homes."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <PGCard key={p.id} pg={p} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/pgs"
            className="inline-block rounded-full bg-ink px-7 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            See all 8 homes →
          </Link>
          <p className="mx-auto mt-4 max-w-2xl rounded-2xl border border-amber-200 bg-sunsoft px-4 py-3 text-sm">
            💛 All prices are <b>all-inclusive</b> — meals, Wi-Fi, electricity, water,
            housekeeping. No brokerage. No hidden charges.
          </p>
        </div>
      </section>

      {/* ─── FACILITIES ─── */}
      <section className="mt-14 border-y border-linen bg-white">
        <div className="page-shell py-14">
          <SectionHead
            kicker="Facilities"
            title="Everything you need, included"
            sub="One rent covers it all — the way India's best co-living brands do it, with a homely touch."
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
            {FACILITIES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-linen bg-cream p-4">
                <span className="text-2xl">{FAC_ICON[f.icon]}</span>
                <b className="mt-1 block text-sm">{f.title}</b>
                <span className="text-xs text-faded">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICES ─── */}
      <section className="page-shell pt-14" id="prices">
        <SectionHead
          kicker="Sharing & prices"
          title="Simple plans, honest pricing"
          sub="Single for privacy, twin for balance, triple for savings. Same warmth in every room."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { t: "Triple Sharing", r: "₹4,500 – ₹7,500", pts: ["Spacious 3-bed room", "Personal cupboard + desk", "All meals + Wi-Fi included"], hot: false },
            { t: "Twin / Double Sharing", r: "₹5,800 – ₹9,500", pts: ["Roomier beds, more privacy", "Mostly attached bath", "All meals + Wi-Fi included"], hot: true },
            { t: "Single Room", r: "₹7,000 – ₹13,000", pts: ["Your own private room", "Ideal for WFH / study", "All meals + Wi-Fi included"], hot: false },
          ].map((c) => (
            <div
              key={c.t}
              className={`relative rounded-3xl border-2 bg-white p-6 shadow ${c.hot ? "border-terra shadow-xl" : "border-linen"}`}
            >
              {c.hot && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-terra px-4 py-0.5 text-xs font-extrabold text-white">
                  Most loved
                </span>
              )}
              <p className="text-xs font-extrabold tracking-wider text-terradark uppercase">{c.t}</p>
              <h3 className="font-display text-3xl">
                {c.r}
                <span className="font-body text-sm font-semibold text-faded">/mo</span>
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-cocoa">
                {c.pts.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <Link
                href={`/pgs?sharing=${c.t.startsWith("Triple") ? "Triple" : c.t.startsWith("Twin") ? "Twin" : "Single"}`}
                className={`mt-4 block rounded-full py-2.5 text-center text-sm font-bold transition ${
                  c.hot ? "bg-terra text-white hover:bg-terradark" : "bg-terrasoft text-terradark hover:bg-orange-200"
                }`}
              >
                See rooms →
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-5 overflow-auto rounded-2xl border border-linen bg-white">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-ink text-left text-orange-100">
                {["PG Home", "Locality", "For", "Triple", "Twin", "Single", ""].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PGS.map((p) => (
                <tr key={p.id} className="border-t border-linen hover:bg-cream">
                  <td className="px-4 py-3">
                    <b>{p.name}</b>
                    <br />
                    <span className="text-xs text-faded">{p.for} · ⭐{p.rating}</span>
                  </td>
                  <td className="px-4 py-3">{p.locality}</td>
                  <td className="px-4 py-3">{p.for}</td>
                  <td className="px-4 py-3">{inr(p.triple)}</td>
                  <td className="px-4 py-3">{inr(p.twin)}</td>
                  <td className="px-4 py-3">{inr(p.single)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/pgs/${p.id}`} className="font-bold text-terradark underline">
                      Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── FOOD ─── */}
      <section className="mt-14 border-y border-linen bg-gradient-to-b from-parchment to-cream" id="food">
        <div className="page-shell py-14">
          <SectionHead
            kicker="Mess & kitchen"
            title="What's food today?"
            sub="A rotating 7-day menu, made fresh in-house. Residents check this daily after login too."
          />
          <FoodSection />
        </div>
      </section>

      {/* ─── GALLERY ─── */}
      <section className="page-shell pt-14">
        <SectionHead kicker="Glimpses" title="Real rooms, real warmth" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {PGS.slice(0, 4).flatMap((p) => p.images.slice(0, 1)).concat([
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=600&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&q=80&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80&auto=format&fit=crop",
          ]).slice(0, 8).map((u) => (
            <Image
              key={u}
              src={u}
              alt="Laxmi Balaji PG glimpse"
              width={500}
              height={340}
              className="h-44 w-full rounded-2xl object-cover shadow"
            />
          ))}
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <section className="mt-14 border-y border-linen bg-white" id="reviews">
        <div className="page-shell py-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-extrabold tracking-[0.16em] text-terradark uppercase">Reviews</p>
              <h2 className="font-display text-3xl sm:text-4xl">Loved by residents</h2>
            </div>
            <a
              href={FLAGSHIP_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-amber-200 bg-sunsoft px-4 py-2 text-sm font-bold hover:underline"
            >
              ⭐ 4.6 · Review us on Google Maps →
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-2xl border border-linen bg-cream p-5">
                <span className="text-sm">{"⭐".repeat(r.stars)}</span>
                <p className="mt-1 text-sm">“{r.text}”</p>
                <b className="mt-2 block text-sm">{r.name}</b>
                <span className="text-xs text-faded">{r.pg}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="page-shell pt-14">
        <SectionHead kicker="Good to know" title="Questions, answered" />
        <div className="grid gap-2.5">
          {FAQS.map(([q, a]) => (
            <details key={q} className="rounded-2xl border border-linen bg-white px-5 py-3.5 shadow">
              <summary className="cursor-pointer font-bold">{q}</summary>
              <p className="mt-1 text-sm text-faded">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section className="mt-14 bg-gradient-to-br from-ink to-[#5a4030] text-orange-100" id="contact">
        <div className="page-shell grid items-start gap-8 py-14 lg:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-extrabold tracking-[0.16em] text-orange-300 uppercase">
              Visit or talk to us
            </p>
            <h2 className="font-display text-3xl text-white sm:text-4xl">
              Come for chai,
              <br />
              stay for the vibe.
            </h2>
            <p className="mt-2 text-sm opacity-80">
              Visits open 10 AM – 8 PM, all days. We usually call back within 30 minutes.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                📞{" "}
                <a href={`tel:${OWNER_PHONE}`} className="font-bold text-orange-200">
                  {OWNER_PHONE_LABEL}
                </a>{" "}
                (call / WhatsApp)
              </li>
              <li>
                ✉️ <a href={`mailto:${OWNER_EMAIL}`} className="text-orange-200">{OWNER_EMAIL}</a>
              </li>
              <li className="flex items-start gap-1">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                <span>
                  PG-2: Hinjewadi Phase 1, near Laxmi Chowk, Pune 411057 ·{" "}
                  <a href={FLAGSHIP_MAPS_URL} target="_blank" rel="noreferrer" className="font-bold text-orange-200 underline">
                    Open in Google Maps →
                  </a>
                </span>
              </li>
            </ul>
            <iframe
              title="Laxmi Balaji PG-2 map"
              src="https://www.google.com/maps?q=18.5828156,73.6818665&z=17&output=embed"
              loading="lazy"
              className="mt-4 h-56 w-full rounded-2xl shadow-xl"
            />
          </div>
          <CallbackForm />
        </div>
      </section>
    </>
  );
}
