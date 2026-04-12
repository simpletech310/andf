"use client";

import { useState, useEffect } from "react";
import { Eye, MousePointer, SkipForward, DollarSign, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface AnalyticsData {
  summary: { views: number; clicks: number; skips: number; ctr: string; totalRevenue: number };
  chartData: { date: string; views: number; clicks: number }[];
  submissions: any[];
}

export default function AdAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/admin/ads/analytics");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Ad Analytics"
          description="Track ad impressions, click-through rates, and sponsor revenue."
        />
        <Link
          href="/admin/ads"
          className="text-sm text-foreground-muted hover:text-primary-600 transition-colors"
        >
          Back to Sponsors
        </Link>
      </div>

      {loading || !data ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-background-card animate-pulse" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard label="Total Views" value={data.summary.views.toLocaleString()} icon={Eye} />
            <StatCard label="Total Clicks" value={data.summary.clicks.toLocaleString()} icon={MousePointer} />
            <StatCard label="Skip Rate" value={`${data.summary.skips}`} icon={SkipForward} />
            <StatCard label="CTR" value={`${data.summary.ctr}%`} icon={TrendingUp} />
            <StatCard label="Revenue" value={`$${data.summary.totalRevenue.toLocaleString()}`} icon={DollarSign} />
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-border bg-background-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Impressions Over Time</h3>
            {data.chartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#999" }} tickFormatter={(d) => d.slice(5)} />
                    <YAxis tick={{ fontSize: 11, fill: "#999" }} />
                    <Tooltip
                      contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                      labelStyle={{ color: "#999" }}
                    />
                    <Legend />
                    <Bar dataKey="views" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="clicks" fill="#f0a030" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-foreground-muted text-center py-8">No impression data yet</p>
            )}
          </div>

          {/* Submissions table */}
          <div className="rounded-xl border border-border bg-background-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Sponsor Submissions</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-background-elevated/50">
                  <th className="text-left px-4 py-2 text-xs font-semibold text-foreground-muted uppercase">Sponsor</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-foreground-muted uppercase">Campaign</th>
                  <th className="text-center px-4 py-2 text-xs font-semibold text-foreground-muted uppercase">Status</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-foreground-muted uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.submissions.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-foreground-muted">No submissions</td></tr>
                ) : (
                  data.submissions.map((s: any) => (
                    <tr key={s.id} className="hover:bg-background-card/50">
                      <td className="px-4 py-3 text-sm text-foreground">{s.ad_sponsors?.business_name || "Unknown"}</td>
                      <td className="px-4 py-3 text-sm text-foreground-muted">{s.campaign_name || "—"}</td>
                      <td className="px-4 py-3 text-sm text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.payment_status === "paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                        }`}>
                          {s.payment_status || "pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-foreground">${Number(s.payment_amount || 0).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
