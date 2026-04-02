"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Calendar, MoreVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Event {
  id: string;
  title: string;
  start_date: string;
  end_date: string | null;
  program_id: string | null;
  event_type: string;
  status: string;
  capacity: number | null;
  price_cents: number;
  registration_count: number;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/events?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEvents(data.events);
    } catch (err: any) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [statusFilter]);

  const filtered = events.filter((e) => {
    if (!search) return true;
    return e.title.toLowerCase().includes(search.toLowerCase());
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatPrice = (cents: number) => {
    if (!cents || cents === 0) return "Free";
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Events</h1>
          <p className="text-foreground-muted mt-1">Manage and create events</p>
        </div>
        <Link href="/admin/events/new">
          <Button variant="primary"><Plus className="h-4 w-4" /> New Event</Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
          <Input
            placeholder="Search events..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-11 rounded-lg bg-background-elevated border border-border px-4 text-sm text-foreground-muted"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-400">{error}</div>
      ) : (
        <Card hover={false}>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Event</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Date</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Status</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Registrations</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-4">Price</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((event) => (
                    <tr key={event.id} className="border-b border-border last:border-0 hover:bg-background-elevated/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <Link href={`/admin/events/${event.id}`} className="text-sm font-medium text-foreground hover:text-gold-500 transition-colors">
                            {event.title}
                          </Link>
                          <div className="text-xs text-foreground-subtle mt-0.5">
                            {event.event_type === "virtual" ? "Virtual" : event.event_type === "hybrid" ? "Hybrid" : "In Person"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-foreground-muted">
                          <Calendar className="h-4 w-4 text-gold-500" /> {formatDate(event.start_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={event.status === "published" ? "success" : event.status === "draft" ? "warning" : event.status === "cancelled" ? "danger" : "default"}>
                          {event.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-foreground-muted">
                          {event.registration_count}{event.capacity ? `/${event.capacity}` : ""}
                        </div>
                        {event.capacity && (
                          <div className="w-20 h-1.5 rounded-full bg-background-elevated mt-1">
                            <div className="h-full rounded-full bg-gold-500" style={{ width: `${Math.min((event.registration_count / event.capacity) * 100, 100)}%` }} />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground-muted">{formatPrice(event.price_cents)}</td>
                      <td className="px-6 py-4">
                        <Link href={`/admin/events/${event.id}`}>
                          <button className="p-2 text-foreground-subtle hover:text-foreground rounded-lg hover:bg-background-elevated transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-foreground-muted">
                        No events found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
