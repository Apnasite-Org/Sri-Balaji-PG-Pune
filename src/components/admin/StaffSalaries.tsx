"use client";

import { useState } from "react";
import { Phone, Plus, Trash2 } from "lucide-react";
import { PGS } from "@/lib/data";
import { inr } from "@/lib/admin-data";
import { useAdmin } from "@/lib/admin-store";

const inp =
  "w-full rounded-xl border border-linen bg-white px-3 py-2 text-sm outline-none focus:border-terra";

export default function StaffSalaries() {
  const { staff, addStaff, toggleSalaryPaid, removeStaff } = useAdmin();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Warden");
  const [phone, setPhone] = useState("");
  const [bldg, setBldg] = useState("all");
  const [salary, setSalary] = useState("");

  const total = staff.reduce((n, s) => n + s.salary, 0);
  const paid = staff.filter((s) => s.paidThisMonth).reduce((n, s) => n + s.salary, 0);

  const doAdd = () => {
    if (name.trim().length < 2 || !salary) return;
    addStaff({
      name: name.trim(),
      role,
      phone: phone || "9800000000",
      buildingId: bldg,
      salary: Number(salary),
      paidThisMonth: false,
      joined: new Date().getFullYear().toString(),
    });
    setName(""); setPhone(""); setSalary(""); setShowAdd(false);
  };

  const bName = (id: string) => (id === "all" ? "All buildings" : PGS.find((p) => p.id === id)?.short || id);

  return (
    <>
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["👥 Total staff", `${staff.length}`, "on rolls"],
          ["💼 Monthly payroll", inr(total), "all salaries"],
          ["✅ Paid this month", inr(paid), `${staff.filter((s) => s.paidThisMonth).length} staff`],
          ["⏳ Pending salaries", inr(total - paid), `${staff.filter((s) => !s.paidThisMonth).length} staff`],
        ].map(([t, v, s]) => (
          <div key={t} className="rounded-2xl border border-linen bg-white p-4 shadow">
            <p className="text-xs font-bold">{t}</p>
            <b className="font-display text-xl">{v}</b>
            <span className="block text-xs text-faded">{s}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowAdd(!showAdd)}
        className="mb-3 flex items-center gap-1 rounded-full bg-terra px-4 py-2 text-sm font-bold text-white hover:bg-terradark"
      >
        <Plus size={15} /> Add staff
      </button>
      {showAdd && (
        <div className="mb-4 grid gap-2 rounded-3xl border border-dashed border-terra bg-terrasoft/40 p-4 sm:grid-cols-3 lg:grid-cols-6">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={inp} />
          <select value={role} onChange={(e) => setRole(e.target.value)} className={inp}>
            {["Manager", "Warden", "Cook", "Housekeeping", "Electrician", "Accountant", "Security"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Phone" inputMode="numeric" className={inp} />
          <select value={bldg} onChange={(e) => setBldg(e.target.value)} className={inp}>
            <option value="all">All buildings</option>
            {PGS.map((b) => (
              <option key={b.id} value={b.id}>{b.short}</option>
            ))}
          </select>
          <input value={salary} onChange={(e) => setSalary(e.target.value.replace(/\D/g, ""))} placeholder="Salary ₹" inputMode="numeric" className={inp} />
          <button onClick={doAdd} className="rounded-full bg-ink py-2 text-sm font-bold text-white">Add</button>
        </div>
      )}

      <div className="overflow-auto rounded-3xl border border-linen bg-white shadow">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="bg-ink text-left text-xs text-orange-100">
              {["Staff", "Role", "Posted at", "Salary", "This month", ""].map((h) => (
                <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-t border-linen hover:bg-cream">
                <td className="px-3 py-2">
                  <b>{s.name}</b>
                  <span className="block text-xs text-faded">
                    <a href={`tel:+91${s.phone}`} className="hover:underline">+91 {s.phone}</a> · since {s.joined}
                  </span>
                </td>
                <td className="px-3 py-2">{s.role}</td>
                <td className="px-3 py-2 text-xs">{bName(s.buildingId)}</td>
                <td className="px-3 py-2"><b>{inr(s.salary)}</b>/mo</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => toggleSalaryPaid(s.id)}
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      s.paidThisMonth ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-900"
                    }`}
                    title="Tap to toggle"
                  >
                    {s.paidThisMonth ? "✅ Paid" : "⏳ Pay now"}
                  </button>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-1.5">
                    <a href={`tel:+91${s.phone}`} className="rounded-full border border-linen p-1.5" title="Call">
                      <Phone size={13} />
                    </a>
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${s.name} from staff?`)) removeStaff(s.id);
                      }}
                      className="rounded-full border border-linen p-1.5 text-red-700"
                      title="Remove"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
