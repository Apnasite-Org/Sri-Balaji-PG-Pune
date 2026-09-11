import Link from "next/link";
import { Home } from "lucide-react";
import { FLAGSHIP_MAPS_URL, OWNER_EMAIL, OWNER_PHONE, OWNER_PHONE_LABEL } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-[#2c221b] text-[#c9b6a6]">
      <div className="page-shell grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-terra text-lg text-white">
              <Home size={20} />
            </span>
            <span className="font-display text-xl font-bold text-white">
              Laxmi Balaji
              <small className="block font-body text-[10px] font-extrabold tracking-[0.22em] text-[#c9b6a6]">
                PG · PUNE
              </small>
            </span>
          </div>
          <p className="mt-3 text-sm">
            8 cozy PG homes across 5 Pune localities. Safe, homely and hassle-free — for
            students & working professionals.
          </p>
        </div>
        <div>
          <b className="mb-2 block text-white">Explore</b>
          <Link href="/pgs" className="block py-0.5 text-sm hover:text-white">Our PGs</Link>
          <Link href="/#prices" className="block py-0.5 text-sm hover:text-white">Prices</Link>
          <Link href="/#food" className="block py-0.5 text-sm hover:text-white">Food menu</Link>
          <Link href="/#reviews" className="block py-0.5 text-sm hover:text-white">Reviews</Link>
        </div>
        <div>
          <b className="mb-2 block text-white">Flagship PG</b>
          <a href={FLAGSHIP_MAPS_URL} target="_blank" rel="noreferrer" className="block py-0.5 text-sm hover:text-white">
            📍 PG-2 on Google Maps
          </a>
          <Link href="/pgs/pg2-hinjewadi" className="block py-0.5 text-sm hover:text-white">
            PG-2 · Hinjewadi Phase 1
          </Link>
          <Link href="/login" className="block py-0.5 text-sm hover:text-white">Resident login</Link>
        </div>
        <div>
          <b className="mb-2 block text-white">Reach us</b>
          <a href={`tel:${OWNER_PHONE}`} className="block py-0.5 text-sm hover:text-white">
            {OWNER_PHONE_LABEL}
          </a>
          <a href={`mailto:${OWNER_EMAIL}`} className="block py-0.5 text-sm hover:text-white">
            {OWNER_EMAIL}
          </a>
          <span className="block py-0.5 text-sm">Hinjewadi Phase 1, Pune 411057</span>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs opacity-70">
        © 2026 Laxmi Balaji PG, Pune · Crafted with warmth in Hinjewadi
      </p>
    </footer>
  );
}
