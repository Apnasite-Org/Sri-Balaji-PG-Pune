"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BedDouble,
  Building2,
  ConciergeBell,
  Home,
  LayoutDashboard,
  LogOut,
  RotateCcw,
  Users,
  Wallet,
} from "lucide-react";
import { ADMIN_SESSION_KEY } from "@/lib/admin-data";
import { useAdmin } from "@/lib/admin-store";
import Overview from "./Overview";
import BuildingsRooms from "./BuildingsRooms";
import ResidentsPayments from "./ResidentsPayments";
import StaffSalaries from "./StaffSalaries";
import MaintenanceMore from "./MaintenanceMore";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "buildings", label: "Buildings & Rooms", icon: Building2 },
  { id: "residents", label: "Residents & Payments", icon: Users },
  { id: "staff", label: "Staff & Salaries", icon: Wallet },
  { id: "maintenance", label: "Maintenance & More", icon: ConciergeBell },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminDashboard() {
  const [tab, setTab] = useState<TabId>("overview");
  const { resetAll } = useAdmin();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    router.push("/admin/login");
  };

  return (
    <div className="page-shell py-6">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white">
          <Home size={22} />
        </span>
        <div>
          <h1 className="font-display text-2xl leading-none sm:text-3xl">Owner Command Center</h1>
          <p className="text-xs text-faded">Laxmi Balaji PG · 8 buildings · live demo data in this browser</p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <Link
            href="/"
            className="rounded-full border border-linen bg-white px-4 py-1.5 text-xs font-bold hover:border-terra"
          >
            ← View site
          </Link>
          <button
            onClick={() => {
              if (confirm("Reset all demo data to defaults?")) resetAll();
            }}
            className="flex items-center gap-1 rounded-full border border-linen bg-white px-4 py-1.5 text-xs font-bold hover:border-terra"
          >
            <RotateCcw size={13} /> Reset demo
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1 rounded-full bg-ink px-4 py-1.5 text-xs font-bold text-white"
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      {/* tab bar */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold transition ${
              tab === t.id
                ? "border-ink bg-ink text-white shadow"
                : "border-linen bg-white hover:border-terra"
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <Overview go={setTab} />}
      {tab === "buildings" && <BuildingsRooms />}
      {tab === "residents" && <ResidentsPayments />}
      {tab === "staff" && <StaffSalaries />}
      {tab === "maintenance" && <MaintenanceMore />}
      <p className="mt-6 flex items-center gap-1 text-xs text-faded">
        <BedDouble size={13} /> All changes save automatically in this browser (demo mode). Connect a backend later for multi-device sync.
      </p>
    </div>
  );
}
