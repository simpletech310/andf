"use client";

import { useEffect, useState } from "react";
import { DollarSign, Users, Calendar, TrendingUp, ArrowUpRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardData {
  stats: {
    totalDonationsMonth: number;
    donationCountMonth: number;
    totalLeads: number;
    newLeadsMonth: number;
    activeEvents: number;
    registrationsMonth: number;
    totalRaisedAllTime: number;
  };
  recentDonations: { id: string; name: string; amount: number; type: string; date: string }[];
  recentLeads: { id: string; name: string; email: string; source: string; status: string; date: string }[];
  upcomingEvents: { id: string; title: string; date: string; registrations: number; capacity: number }[];
}

function formatCurrency(amount: number): string {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
  }
  return `$${amount.toLocaleString()}`;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load dashboard");
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-400">{error || "Failed to load dashboard"}</p>
      </div>
    );
  }

  const { stats, recentDonations, recentLeads, upcomingEvents } = data;

  const statCards = [
    { title: "Total Donations", value: formatCurrency(stats.totalDonationsMonth), icon: DollarSign, period: "This month" },
    { title: "New Leads", value: String(stats.newLeadsMonth), icon: Users, period: "This month" },
    { title: "Active Events", value: String(stats.activeEvents), icon: Calendar, period: "Upcoming" },
    { title: "Registrations", value: String(stats.registrationsMonth), icon: TrendingUp, period: "This month" },
  ];

  const goalProgress = stats.totalDonationsMonth > 0
    ? Math.min(Math.round((stats.totalDonationsMonth / 20000) * 100), 100)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-foreground-muted mt-1">Welcome back. Here&apos;s what&apos;s happening with ANDF.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} hover={false}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-gold-500" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                  <ArrowUpRight className="h-3 w-3" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-foreground-subtle">{stat.period}</div>
              </div>
              <div className="text-sm text-foreground-muted mt-1">{stat.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card hover={false}>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.length === 0 && (
                <p className="text-sm text-foreground-subtle">No leads yet.</p>
              )}
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-background-elevated flex items-center justify-center text-sm font-semibold text-gold-500">
                      {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{lead.name}</div>
                      <div className="text-xs text-foreground-subtle">{lead.source}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={lead.status === "donor" ? "gold" : lead.status === "engaged" ? "success" : "default"}>
                      {lead.status}
                    </Badge>
                    <div className="text-xs text-foreground-subtle mt-1">{lead.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card hover={false}>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-foreground-subtle">No upcoming events.</p>
              )}
              {upcomingEvents.map((event) => {
                const percent = event.capacity > 0 ? (event.registrations / event.capacity) * 100 : 0;
                return (
                  <div key={event.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-foreground">{event.title}</div>
                        <div className="text-xs text-foreground-subtle">{event.date}</div>
                      </div>
                      <div className="text-right text-xs text-foreground-muted">
                        {event.registrations}/{event.capacity}
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-background-elevated overflow-hidden">
                      <div className="h-full rounded-full bg-gold-500 transition-all" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Donations */}
        <Card hover={false}>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDonations.length === 0 && (
                <p className="text-sm text-foreground-subtle">No donations yet.</p>
              )}
              {recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gold-500/10 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-gold-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{donation.name}</div>
                      <div className="text-xs text-foreground-subtle">{donation.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gold-500">${donation.amount}</div>
                    <Badge variant={donation.type === "Monthly" ? "info" : "default"} className="mt-1">
                      {donation.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card hover={false}>
          <CardHeader>
            <CardTitle>Quick Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-foreground-muted">Monthly Goal</span>
                  <span className="text-foreground font-medium">${stats.totalDonationsMonth.toLocaleString()} / $20,000</span>
                </div>
                <div className="h-3 rounded-full bg-background-elevated overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400" style={{ width: `${goalProgress}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background-elevated text-center">
                  <div className="text-2xl font-bold text-foreground">{stats.totalLeads.toLocaleString()}</div>
                  <div className="text-xs text-foreground-subtle">Total Leads</div>
                </div>
                <div className="p-4 rounded-xl bg-background-elevated text-center">
                  <div className="text-2xl font-bold text-foreground">{stats.donationCountMonth}</div>
                  <div className="text-xs text-foreground-subtle">Donations This Month</div>
                </div>
                <div className="p-4 rounded-xl bg-background-elevated text-center">
                  <div className="text-2xl font-bold text-foreground">{stats.activeEvents}</div>
                  <div className="text-xs text-foreground-subtle">Active Events</div>
                </div>
                <div className="p-4 rounded-xl bg-background-elevated text-center">
                  <div className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalRaisedAllTime)}</div>
                  <div className="text-xs text-foreground-subtle">Total Raised</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
