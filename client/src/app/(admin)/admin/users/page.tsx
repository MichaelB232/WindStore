"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Trash2,
  Loader2,
  Users as UsersIcon,
  Search,
  ShieldCheck,
} from "lucide-react";
import AdminTopbar from "@/src/components/admin/AdminTopbar";
import PageHeader from "@/src/components/admin/PageHeader";
import EmptyState from "@/src/components/admin/EmptyState";
import ConfirmDialog from "@/src/components/admin/ConfirmDialog";
import { Button } from "@/src/components/ui/shadcn/button";
import { Input } from "@/src/components/ui/shadcn/input";
import {
  getAllUsersAdmin,
  deleteUserAdmin,
} from "@/src/services/admin/admin.service";
import { AdminUser } from "@/src/lib/admin/AdminType";
import { getErrorMessage } from "@/src/utils/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [target, setTarget] = useState<AdminUser | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAllUsersAdmin();
        setUsers(data);
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to load users"));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [users, search]);

  const handleDelete = async () => {
    if (!target) return;
    try {
      const message = await deleteUserAdmin(target.id);
      toast.success(message);
      setUsers((prev) => prev.filter((u) => u.id !== target.id));
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete user"));
    }
  };

  return (
    <>
      <AdminTopbar
        title="Users"
        description="Manage registered customers and admins"
      />

      <div className="p-8">
        <PageHeader
          title={`${filtered.length} user${filtered.length === 1 ? "" : "s"}`}
        />

        <div className="relative mb-4 max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Search by username or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-accent" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="No users found"
            description="No matching users."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-alt text-left text-xs font-medium text-text-secondary">
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-alt/50">
                    <td className="px-4 py-3 font-medium text-text-primary">
                      {user.username}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent-muted px-2.5 py-1 text-xs font-medium text-accent">
                          <ShieldCheck className="size-3" /> Admin
                        </span>
                      ) : (
                        <span className="rounded-full bg-surface-alt px-2.5 py-1 text-xs font-medium text-text-secondary">
                          Customer
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="text-danger hover:bg-danger/10 disabled:opacity-30"
                          disabled={user.role === "admin"}
                          onClick={() => setTarget(user)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!target}
        onOpenChange={(open) => !open && setTarget(null)}
        title="Delete user"
        description={`Are you sure you want to delete "${target?.username}"? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </>
  );
}
