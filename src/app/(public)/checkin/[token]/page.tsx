"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, Calendar, User, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CheckinData {
  registration: {
    id: string;
    registrant_name: string;
    registrant_email: string;
    checked_in: boolean;
    checked_in_at: string | null;
    event_id: string;
  };
  event: {
    id: string;
    title: string;
    start_date: string;
    location: string | null;
  };
}

export default function PublicCheckinPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<CheckinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    async function fetchRegistration() {
      try {
        const res = await fetch(`/api/checkin/${token}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Invalid check-in link");
        }
        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchRegistration();
  }, [token]);

  const handleConfirmCheckIn = async () => {
    if (!data) return;
    setConfirming(true);
    try {
      const res = await fetch(
        `/api/admin/events/${data.event.id}/checkin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ registrationId: data.registration.id }),
        }
      );
      if (res.ok) {
        const result = await res.json();
        setData((prev) =>
          prev
            ? {
                ...prev,
                registration: {
                  ...prev.registration,
                  checked_in: true,
                  checked_in_at: result.checked_in_at,
                },
              }
            : prev
        );
      }
    } catch {
      setError("Check-in failed. Please try again.");
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">!</span>
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">
            Invalid Check-In Link
          </h1>
          <p className="text-foreground-muted">
            {error || "This check-in link is not valid. Please contact event staff."}
          </p>
        </div>
      </div>
    );
  }

  const { registration, event } = data;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6 py-12">
      <div className="w-full max-w-md">
        {registration.checked_in ? (
          /* Checked-in state */
          <div className="text-center rounded-3xl bg-white border-2 border-emerald-200 shadow-sm p-8 space-y-4">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              You're Checked In!
            </h1>
            <p className="text-foreground-muted">
              Welcome, <span className="font-semibold text-foreground">{registration.registrant_name}</span>!
            </p>
            <div className="rounded-xl bg-emerald-50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span className="font-medium">{event.title}</span>
              </div>
              {registration.checked_in_at && (
                <p className="text-xs text-emerald-600">
                  Checked in at {new Date(registration.checked_in_at).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Not yet checked in */
          <div className="rounded-3xl bg-white border border-neutral-200 shadow-sm p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome, {registration.registrant_name}!
              </h1>
              <p className="text-foreground-muted">
                You're registered for:
              </p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary-500" />
                <span className="font-semibold text-foreground">{event.title}</span>
              </div>
              {event.start_date && (
                <p className="text-xs text-foreground-muted ml-6">
                  {new Date(event.start_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
              {event.location && (
                <p className="text-xs text-foreground-muted ml-6">{event.location}</p>
              )}
            </div>

            <button
              onClick={handleConfirmCheckIn}
              disabled={confirming}
              className="w-full h-14 rounded-xl bg-emerald-500 text-white text-lg font-semibold hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {confirming ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Confirm Check-In
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
