"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ADMIN_SESSION_KEY } from "@/lib/admin-data";
import { AdminProvider } from "@/lib/admin-store";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY) || "null");
      if (s) {
        setOk(true);
        return;
      }
    } catch {
      /* ignore */
    }
    router.replace("/admin/login");
  }, [router]);

  if (!ok) return <p className="mx-auto max-w-md px-4 py-16 text-sm text-faded">Checking access…</p>;

  return (
    <AdminProvider>
      <AdminDashboard />
    </AdminProvider>
  );
}
