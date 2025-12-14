import React from 'react'
import { Shield, Users } from 'lucide-react'

import AdminLayout from '../components/AdminLayout'

export default function UsersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="mt-2 text-white/60">Role-based UI and permissions (placeholder).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-white/60" />
              <p className="font-semibold text-white">User management</p>
            </div>
            <p className="text-white/60 mt-3">
              In production, this page will list user accounts, roles, activity, and moderation tools.
            </p>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-neonCyan" />
              <p className="font-semibold text-white">Audit logs</p>
            </div>
            <p className="text-white/60 mt-3">
              Planned: immutable audit logs for edits, publishing, and role changes.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
