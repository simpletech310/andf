"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Save, Trash2, DollarSign, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { format } from "date-fns";

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch(`/api/admin/donations/campaigns/${id}`);
        const data = await res.json();
        setCampaign(data.campaign);
        setDonations(data.donations || []);
        setEditForm(data.campaign);
      } catch (error) {
        console.error("Failed:", error);
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/donations/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          description: editForm.description,
          goal_amount: parseFloat(editForm.goal_amount) || 0,
          status: editForm.status,
          start_date: editForm.start_date || null,
          end_date: editForm.end_date || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCampaign(data.campaign);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await fetch(`/api/admin/donations/campaigns/${id}`, { method: "DELETE" });
    router.push("/admin/donations/campaigns");
  };

  if (loading) {
    return <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-background-card animate-pulse" />)}</div>;
  }

  if (!campaign) {
    return <div className="text-center py-20 text-foreground-muted">Campaign not found</div>;
  }

  const progress = campaign.goal_amount > 0 ? Math.min(100, Math.round((campaign.raised_amount / campaign.goal_amount) * 100)) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/donations/campaigns" className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-elevated transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <PageHeader title={campaign.name} description={campaign.description || "No description"} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditing(!editing)}>
            <Edit2 className="h-4 w-4" /> Edit
          </Button>
          <Button variant="outline" className="text-red-600" onClick={() => setShowDelete(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Raised" value={`$${Number(campaign.raised_amount).toLocaleString()}`} icon={DollarSign} />
        <StatCard label="Goal" value={`$${Number(campaign.goal_amount).toLocaleString()}`} icon={TrendingUp} />
        <StatCard label="Donors" value={donations.length.toString()} icon={Users} />
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-border bg-background-card p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">{progress}% Funded</span>
          <span className="text-sm text-foreground-muted capitalize">{campaign.status}</span>
        </div>
        <div className="w-full h-3 rounded-full bg-background-elevated overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="rounded-xl border border-border bg-background-card p-6 space-y-4">
          <Input label="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          <Textarea label="Description" value={editForm.description || ""} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
          <Input label="Goal Amount ($)" type="number" value={editForm.goal_amount} onChange={(e) => setEditForm({ ...editForm, goal_amount: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={editForm.start_date?.split("T")[0] || ""} onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })} />
            <Input label="End Date" type="date" value={editForm.end_date?.split("T")[0] || ""} onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground-muted block mb-1.5">Status</label>
            <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4" /> {saving ? "Saving..." : "Save"}</Button>
          </div>
        </div>
      )}

      {/* Donations list */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border"><h3 className="text-sm font-semibold text-foreground">Campaign Donations</h3></div>
        <table className="w-full">
          <thead>
            <tr className="bg-background-elevated/50">
              <th className="text-left px-4 py-2 text-xs font-semibold text-foreground-muted uppercase">Donor</th>
              <th className="text-right px-4 py-2 text-xs font-semibold text-foreground-muted uppercase">Amount</th>
              <th className="text-left px-4 py-2 text-xs font-semibold text-foreground-muted uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {donations.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-foreground-muted">No donations yet</td></tr>
            ) : (
              donations.map((d: any) => (
                <tr key={d.id} className="hover:bg-background-card/50">
                  <td className="px-4 py-3 text-sm text-foreground">{d.donor_name || d.donor_email}</td>
                  <td className="px-4 py-3 text-sm text-right text-secondary-600 font-medium">${Number(d.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-foreground-muted">{format(new Date(d.created_at), "MMM d, yyyy")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Campaign"
        message="This will permanently delete this campaign. Donations linked to it will remain but lose the campaign association."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
