"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Target, DollarSign, Calendar, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/admin/stat-card";
import { format } from "date-fns";

interface Campaign {
  id: string;
  name: string;
  description: string;
  goal_amount: number;
  raised_amount: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  is_featured: boolean;
  donationCount: number;
  progressPercent: number;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-neutral-500/10 text-neutral-400",
  active: "bg-emerald-500/10 text-emerald-600",
  completed: "bg-primary-50 text-primary-600",
  cancelled: "bg-red-500/10 text-red-600",
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch("/api/admin/donations/campaigns");
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  const totalRaised = campaigns.reduce((sum, c) => sum + Number(c.raised_amount), 0);
  const totalGoal = campaigns.reduce((sum, c) => sum + Number(c.goal_amount), 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Fundraising Campaigns"
          description="Create and manage donation campaigns with goals, progress tracking, and donor engagement."
        />
        <Link href="/admin/donations/campaigns/new">
          <Button><Plus className="h-4 w-4" /> New Campaign</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Raised" value={`$${totalRaised.toLocaleString()}`} icon={DollarSign} />
        <StatCard label="Campaign Goal" value={`$${totalGoal.toLocaleString()}`} icon={Target} />
        <StatCard label="Active Campaigns" value={activeCampaigns.toString()} icon={TrendingUp} />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-28 rounded-xl bg-background-card animate-pulse" />)}
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-border">
          <Target className="h-12 w-12 text-foreground-subtle mx-auto mb-4" />
          <p className="text-foreground-muted mb-2">No campaigns yet</p>
          <Link href="/admin/donations/campaigns/new">
            <Button><Plus className="h-4 w-4" /> Create Your First Campaign</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/admin/donations/campaigns/${campaign.id}`}
              className="block p-6 rounded-xl border border-border bg-background-card hover:border-primary-200 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{campaign.name}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[campaign.status]}`}>
                      {campaign.status}
                    </span>
                    {campaign.is_featured && <Badge variant="gold">Featured</Badge>}
                  </div>
                  {campaign.description && (
                    <p className="text-sm text-foreground-muted mt-1 line-clamp-1">{campaign.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-display font-bold text-secondary-600">
                    ${Number(campaign.raised_amount).toLocaleString()}
                  </p>
                  <p className="text-xs text-foreground-subtle">
                    of ${Number(campaign.goal_amount).toLocaleString()} goal
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-background-elevated overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
                  style={{ width: `${campaign.progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-foreground-subtle">
                <span>{campaign.progressPercent}% funded &middot; {campaign.donationCount} donations</span>
                <div className="flex items-center gap-3">
                  {campaign.start_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(campaign.start_date), "MMM d")}
                      {campaign.end_date && ` - ${format(new Date(campaign.end_date), "MMM d, yyyy")}`}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
