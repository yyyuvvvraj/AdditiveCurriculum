// src/components/AdminContent.tsx
"use client";
import React, { useState } from "react";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "operator";
  active: boolean;
};

const demoUsers: UserRow[] = [
  { id: "u1", name: "Alice Sharma", email: "alice@vb.com", role: "admin", active: true },
  { id: "u2", name: "Ravi Kumar", email: "ravi@vb.com", role: "manager", active: true },
  { id: "u3", name: "Sana Patel", email: "sana@vb.com", role: "operator", active: false },
];

function UsersTable() {
  const [users, setUsers] = useState<UserRow[]>(demoUsers);

  function toggleActive(id: string) {
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, active: !u.active } : u)),
    );
  }

  function promoteToAdmin(id: string) {
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, role: "admin" } : u)),
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border shadow-lg overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900">Users &amp; Roles</h3>
        <div className="text-sm text-slate-500">Manage access and roles</div>
      </div>

      <table className="w-full table-auto min-w-[640px]">
        <thead className="text-left text-sm text-slate-600 border-b">
          <tr>
            <th className="px-3 py-2">Name</th>
            <th className="px-3 py-2">Email</th>
            <th className="px-3 py-2">Role</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.id} className="hover:bg-slate-50">
              <td className="px-3 py-3 font-medium text-slate-900">{u.name}</td>
              <td className="px-3 py-3 text-slate-700">{u.email}</td>
              <td className="px-3 py-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-100 text-xs text-slate-700 capitalize">
                  {u.role}
                </span>
              </td>
              <td className="px-3 py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    u.active
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {u.active ? "Active" : "Disabled"}
                </span>
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(u.id)}
                    className={`px-3 py-1 rounded text-xs font-medium shadow-sm transition ${
                      u.active
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {u.active ? "Disable" : "Enable"}
                  </button>
                  {u.role !== "admin" && (
                    <button
                      onClick={() => promoteToAdmin(u.id)}
                      className="px-3 py-1 rounded bg-amber-400 text-slate-900 text-xs font-semibold shadow-sm hover:bg-amber-300"
                    >
                      Promote
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NotificationsCard() {
  return (
    <div className="bg-white rounded-2xl p-4 border shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-slate-900">Notification channels</h4>
        <div className="text-xs text-slate-500">Email / SMS / Webhook</div>
      </div>

      <div className="space-y-3 text-sm text-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Low stock email</div>
            <div className="text-xs text-slate-500">Supply chain team</div>
          </div>
          <input type="checkbox" defaultChecked className="h-4 w-4" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Critical downtime SMS</div>
            <div className="text-xs text-slate-500">Engineers</div>
          </div>
          <input type="checkbox" className="h-4 w-4" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Webhook (ERP)</div>
            <div className="text-xs text-slate-500">Push reorder events</div>
          </div>
          <div className="text-xs text-emerald-600 font-medium">configured</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        Edit endpoints and escalation chains in Webhooks settings.
      </div>
    </div>
  );
}

function ThresholdsCard() {
  return (
    <div className="bg-white rounded-2xl p-4 border shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-slate-900">Thresholds &amp; Rules</h4>
        <div className="text-xs text-slate-500">Inventory / Downtime</div>
      </div>

      <div className="space-y-4 text-sm text-slate-700">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-medium">Brake Pad reorder point</div>
            <div className="text-xs text-slate-500">Current: 20 units</div>
          </div>
          <button className="px-3 py-1 rounded border border-sky-300 text-xs font-medium text-sky-700 hover:bg-sky-50">
            Edit
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-medium">Downtime alert delay</div>
            <div className="text-xs text-slate-500">Trigger after 5 minutes</div>
          </div>
          <button className="px-3 py-1 rounded border border-sky-300 text-xs font-medium text-sky-700 hover:bg-sky-50">
            Edit
          </button>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        Use rules to auto-escalate critical events and create PO drafts.
      </div>
    </div>
  );
}

function IntegrationsCard() {
  return (
    <div className="bg-white rounded-2xl p-4 border shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-slate-900">System &amp; Integrations</h4>
        <div className="text-xs text-slate-500">SCADA / ERP / BI</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="text-sm text-slate-700 space-y-2">
          <div>
            <div className="font-medium">ERP (Purchase)</div>
            <div className="text-xs text-slate-500">
              Push POs to ERP via webhook or SFTP
            </div>
          </div>

          <div>
            <div className="font-medium">Power BI embed</div>
            <div className="text-xs text-slate-500">
              Add embed token for secure reports
            </div>
          </div>

          <button className="mt-2 px-3 py-1.5 rounded bg-amber-400 text-slate-900 text-xs font-semibold shadow-sm hover:bg-amber-300">
            Configure
          </button>
        </div>

        <div className="hidden md:block">
          {/* Put an actual image into /public/admin-integration-preview.png */}
          <div className="w-full h-28 rounded-md border bg-slate-50 flex items-center justify-center text-xs text-slate-400">
            Integration preview
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-5">
          Admin Console
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <UsersTable />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NotificationsCard />
              <ThresholdsCard />
            </div>
          </div>

          <div className="space-y-4">
            <IntegrationsCard />
            <div className="bg-white rounded-2xl p-4 border shadow-lg text-sm text-slate-700">
              <div className="font-semibold mb-3">Quick actions</div>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 rounded bg-amber-400 text-slate-900 font-semibold text-sm shadow hover:bg-amber-300">
                  Create Purchase Request
                </button>
                <button className="w-full px-3 py-2 rounded border text-sm hover:bg-slate-50">
                  Run Sync (SCADA)
                </button>
                <button className="w-full px-3 py-2 rounded border text-sm hover:bg-slate-50">
                  Export Audit Log
                </button>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                Audit logs and integrations are visible here. Use with caution.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
