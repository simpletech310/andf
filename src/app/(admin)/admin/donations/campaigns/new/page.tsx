"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewCampaignPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    goal_amount: "",
    start_date: "",
    end_date: "",
    status: "draft",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/donations/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          goal_amount: parseFloat(form.goal_amount) || 0,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/admin/donations/campaigns/${data.campaign.id}`);
      }
    } catch (error) {
      console.error("Failed to create campaign:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/donations/campaigns" className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-elevated transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <PageHeader title="New Campaign" description="Create a fundraising campaign with a goal and timeline." />
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="rounded-xl border border-border bg-background-card p-6 space-y-4">
          <Input label="Campaign Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Summer Band Camp 2026" />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Tell donors what this campaign is for..." />
          <Input label="Goal Amount ($)" type="number" value={form.goal_amount} onChange={(e) => setForm({ ...form, goal_amount: e.target.value })} placeholder="10000" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            <Input label="End Date" type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground-muted block mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving || !form.name}>
            <Save className="h-4 w-4" /> {saving ? "Creating..." : "Create Campaign"}
          </Button>
        </div>
      </form>
    </div>
  );
}
