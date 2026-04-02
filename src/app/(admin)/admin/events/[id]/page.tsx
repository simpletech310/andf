"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, Loader2, Users, Calendar, DollarSign,
  CheckCircle2, BarChart3, ClipboardList, Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Tab = "details" | "registrations" | "stats";

interface Registration {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: string;
  payment_status: string | null;
  checked_in: boolean;
  created_at: string;
}

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("details");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Edit form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState("in_person");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [priceCents, setPriceCents] = useState("");
  const [status, setStatus] = useState("draft");

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/events/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setEvent(data.event);
        setRegistrations(data.registrations || []);

        // Populate form
        setTitle(data.event.title || "");
        setDescription(data.event.description || "");
        setEventType(data.event.event_type || "in_person");
        setStartDate(data.event.start_date ? data.event.start_date.slice(0, 16) : "");
        setEndDate(data.event.end_date ? data.event.end_date.slice(0, 16) : "");
        setLocation(data.event.location || "");
        setCapacity(data.event.capacity ? String(data.event.capacity) : "");
        setPriceCents(data.event.price_cents ? String(data.event.price_cents / 100) : "0");
        setStatus(data.event.status || "draft");
      } catch (err: any) {
        setError(err.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          event_type: eventType,
          start_date: startDate ? new Date(startDate).toISOString() : null,
          end_date: endDate ? new Date(endDate).toISOString() : null,
          location,
          capacity: capacity ? parseInt(capacity) : null,
          price_cents: priceCents ? Math.round(parseFloat(priceCents) * 100) : 0,
          status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEvent(data.event);
      alert("Event updated successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to update event.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">{error || "Event not found"}</p>
        <Link href="/admin/events" className="text-gold-500 mt-4 inline-block">Back to Events</Link>
      </div>
    );
  }

  const checkedInCount = registrations.filter((r) => r.checked_in).length;
  const paidCount = registrations.filter((r) => r.payment_status === "paid").length;
  const capacityPct = event.capacity ? Math.round((registrations.length / event.capacity) * 100) : null;
  const totalRevenue = registrations
    .filter((r) => r.payment_status === "paid")
    .length * (event.price_cents || 0) / 100;

  const tabs = [
    { key: "details" as Tab, label: "Details", icon: Settings },
    { key: "registrations" as Tab, label: "Registrations", icon: ClipboardList },
    { key: "stats" as Tab, label: "Stats", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <Link href="/admin/events" className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-gold-500 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold text-foreground">{event.title}</h1>
          <Badge variant={event.status === "published" ? "success" : event.status === "draft" ? "warning" : event.status === "cancelled" ? "danger" : "default"}>
            {event.status}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-background-elevated rounded-lg w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-background-card text-foreground shadow-sm"
                : "text-foreground-muted hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Details Tab */}
      {tab === "details" && (
        <Card hover={false}>
          <CardHeader><CardTitle>Event Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input id="editTitle" label="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Textarea id="editDesc" label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground-muted">Event Type</label>
                <select
                  className="flex h-11 w-full rounded-lg bg-background-elevated border border-border px-4 text-foreground"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                >
                  <option value="in_person">In Person</option>
                  <option value="virtual">Virtual</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground-muted">Status</label>
                <select
                  className="flex h-11 w-full rounded-lg bg-background-elevated border border-border px-4 text-foreground"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input id="editStart" label="Start Date" type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              <Input id="editEnd" label="End Date" type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <Input id="editLocation" label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input id="editCapacity" label="Max Capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
              <Input id="editPrice" label="Ticket Price ($)" type="number" step="0.01" value={priceCents} onChange={(e) => setPriceCents(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Registrations Tab */}
      {tab === "registrations" && (
        <Card hover={false}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gold-500" />
              Registrations ({registrations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-3">Name</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-3">Email</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-3">Phone</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-3">Payment</th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-3">Checked In</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="border-b border-border last:border-0 hover:bg-background-elevated/50 transition-colors">
                      <td className="px-6 py-3 text-sm text-foreground">{reg.first_name} {reg.last_name}</td>
                      <td className="px-6 py-3 text-sm text-foreground-muted">{reg.email}</td>
                      <td className="px-6 py-3 text-sm text-foreground-muted">{reg.phone || "-"}</td>
                      <td className="px-6 py-3">
                        <Badge variant={reg.status === "confirmed" ? "success" : "default"}>{reg.status || "registered"}</Badge>
                      </td>
                      <td className="px-6 py-3">
                        <Badge variant={reg.payment_status === "paid" ? "success" : "warning"}>{reg.payment_status || "n/a"}</Badge>
                      </td>
                      <td className="px-6 py-3">
                        {reg.checked_in ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <span className="text-foreground-subtle text-sm">No</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {registrations.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-foreground-muted">
                        No registrations yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Tab */}
      {tab === "stats" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Capacity Filled",
                value: capacityPct !== null ? `${capacityPct}%` : "N/A",
                icon: Users,
                color: "text-blue-500 bg-blue-500/10",
              },
              {
                label: "Registered",
                value: String(registrations.length),
                icon: ClipboardList,
                color: "text-gold-500 bg-gold-500/10",
              },
              {
                label: "Checked In",
                value: `${checkedInCount} / ${registrations.length}`,
                icon: CheckCircle2,
                color: "text-emerald-500 bg-emerald-500/10",
              },
              {
                label: "Revenue Collected",
                value: `$${totalRevenue.toLocaleString()}`,
                icon: DollarSign,
                color: "text-green-500 bg-green-500/10",
              },
            ].map((stat) => (
              <Card key={stat.label} hover={false}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-foreground-muted">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {capacityPct !== null && (
            <Card hover={false}>
              <CardHeader><CardTitle>Capacity</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-4 rounded-full bg-background-elevated overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gold-500 transition-all"
                      style={{ width: `${Math.min(capacityPct, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground-muted">
                    {registrations.length} / {event.capacity}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
