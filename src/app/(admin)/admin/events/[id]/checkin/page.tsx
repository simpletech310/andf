"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  Search, CheckCircle2, Users, ArrowLeft, Undo2, Phone, Mail,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface Registration {
  id: string;
  registrant_name: string;
  registrant_email: string;
  registrant_phone: string | null;
  status: string;
  payment_status: string;
  amount_paid: number | null;
  checked_in: boolean;
  checked_in_at: string | null;
  ticket_type: string | null;
}

interface EventInfo {
  id: string;
  title: string;
  capacity: number | null;
  checked_in_count: number;
}

export default function EventCheckinPage() {
  const { id: eventId } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventInfo | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/events/${eventId}/checkin`);
      const data = await res.json();
      setEvent(data.event);
      setRegistrations(data.registrations || []);
    } catch (err) {
      console.error("Failed to load check-in data:", err);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchData();
    searchRef.current?.focus();
  }, [fetchData]);

  const handleCheckIn = async (registrationId: string) => {
    setActionLoading(registrationId);
    try {
      const res = await fetch(`/api/admin/events/${eventId}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId }),
      });
      if (res.ok) {
        const data = await res.json();
        setRegistrations((prev) =>
          prev.map((r) =>
            r.id === registrationId
              ? { ...r, checked_in: true, checked_in_at: data.checked_in_at }
              : r
          )
        );
        setEvent((prev) =>
          prev ? { ...prev, checked_in_count: prev.checked_in_count + 1 } : prev
        );
      }
    } catch (err) {
      console.error("Check-in failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUndoCheckIn = async (registrationId: string) => {
    setActionLoading(registrationId);
    try {
      const res = await fetch(`/api/admin/events/${eventId}/checkin`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId }),
      });
      if (res.ok) {
        setRegistrations((prev) =>
          prev.map((r) =>
            r.id === registrationId
              ? { ...r, checked_in: false, checked_in_at: null }
              : r
          )
        );
        setEvent((prev) =>
          prev ? { ...prev, checked_in_count: Math.max(prev.checked_in_count - 1, 0) } : prev
        );
      }
    } catch (err) {
      console.error("Undo check-in failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = registrations.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.registrant_name.toLowerCase().includes(q) ||
      r.registrant_email.toLowerCase().includes(q)
    );
  });

  const checkedInCount = registrations.filter((r) => r.checked_in).length;
  const totalCount = registrations.length;
  const progressPct = totalCount > 0 ? (checkedInCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-4 w-full" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Back link + event title */}
      <div>
        <Link
          href={`/admin/events`}
          className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>
        <h1 className="text-2xl font-display font-bold text-foreground">
          {event?.title || "Event Check-In"}
        </h1>
      </div>

      {/* Progress bar */}
      <div className="p-4 rounded-xl bg-background-card border border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Users className="h-4 w-4 text-emerald-500" />
            <span>{checkedInCount} / {totalCount} checked in</span>
          </div>
          <span className="text-sm font-semibold text-emerald-500">
            {progressPct.toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-background-elevated overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Search bar — full width, large */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-subtle" />
        <input
          ref={searchRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full h-14 pl-12 pr-4 rounded-xl bg-background-elevated border border-border text-xl text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-colors"
          autoFocus
        />
      </div>

      {/* Registration cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-foreground-muted">
            {search ? "No matching registrations found." : "No registrations for this event."}
          </div>
        )}
        {filtered.map((reg) => (
          <div
            key={reg.id}
            className={`rounded-xl border-2 p-4 transition-all ${
              reg.checked_in
                ? "border-emerald-500 bg-emerald-500/5"
                : "border-border bg-background-card"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {reg.checked_in && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  )}
                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {reg.registrant_name}
                  </h3>
                </div>
                <div className="flex flex-col gap-1 mt-1.5">
                  <span className="text-sm text-foreground-muted flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {reg.registrant_email}
                  </span>
                  {reg.registrant_phone && (
                    <span className="text-sm text-foreground-muted flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      {reg.registrant_phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap gap-2 mb-3">
              {reg.ticket_type && (
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                  {reg.ticket_type}
                </span>
              )}
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  reg.payment_status === "paid"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : reg.payment_status === "free"
                    ? "bg-background-elevated text-foreground-muted"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {reg.payment_status === "paid"
                  ? `Paid${reg.amount_paid ? ` $${(reg.amount_paid / 100).toFixed(0)}` : ""}`
                  : reg.payment_status}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  reg.status === "confirmed"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-background-elevated text-foreground-muted"
                }`}
              >
                {reg.status}
              </span>
            </div>

            {/* Check-in action */}
            {reg.checked_in ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-400">
                  Checked in at{" "}
                  {reg.checked_in_at
                    ? new Date(reg.checked_in_at).toLocaleTimeString()
                    : ""}
                </span>
                <button
                  onClick={() => handleUndoCheckIn(reg.id)}
                  disabled={actionLoading === reg.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-background-elevated text-foreground-muted text-sm font-medium hover:text-foreground transition-colors disabled:opacity-50"
                >
                  <Undo2 className="h-4 w-4" />
                  Undo
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleCheckIn(reg.id)}
                disabled={actionLoading === reg.id}
                className="w-full h-14 rounded-xl bg-emerald-500 text-white text-lg font-semibold hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading === reg.id ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Check In
                  </>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
