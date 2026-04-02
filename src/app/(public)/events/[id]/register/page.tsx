"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function RegisterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresPayment, setRequiresPayment] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  const fetchQrCode = useCallback(async (registrationId: string) => {
    setQrLoading(true);
    try {
      const res = await fetch(`/api/events/${id}/register/qr?registrationId=${registrationId}`);
      if (res.ok) {
        const data = await res.json();
        setQrCodeUrl(data.qrCodeUrl);
      }
    } catch {
      // QR code is supplementary; don't block success state
    } finally {
      setQrLoading(false);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formDataObj = new FormData(form);

    const firstName = (formDataObj.get("firstName") as string) || "";
    const lastName = (formDataObj.get("lastName") as string) || "";
    const registrantName = `${firstName} ${lastName}`.trim();
    const registrantEmail = (formDataObj.get("email") as string) || "";
    const registrantPhone = (formDataObj.get("phone") as string) || "";
    const age = formDataObj.get("age") ? Number(formDataObj.get("age")) : undefined;
    const guardianName = (formDataObj.get("guardian") as string) || "";
    const emergencyContact = (formDataObj.get("emergency") as string) || "";
    const specialRequirements = (formDataObj.get("special") as string) || "";

    try {
      const res = await fetch(`/api/events/${id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrantName,
          registrantEmail,
          registrantPhone,
          formData: {
            firstName,
            lastName,
            age,
            guardianName,
            emergencyContact,
            specialRequirements,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setRequiresPayment(data.requiresPayment);
      setSubmitted(true);

      // Fetch QR code in the background
      if (data.registration?.id) {
        fetchQrCode(data.registration.id);
      }
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQr = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = "event-checkin-qr.png";
    link.click();
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-24 px-6">
        <div className="mx-auto max-w-lg text-center space-y-6">
          <motion.div
            className="mx-auto h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Check className="h-10 w-10 text-primary-500" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold text-foreground">Registration Complete!</h1>
          <p className="text-foreground-muted">
            {requiresPayment
              ? "Registration confirmed! Payment details will be sent to your email."
              : "Thank you for registering. You\u2019ll receive a confirmation email shortly with all the details."}
          </p>

          {/* QR Code Section */}
          {qrLoading && (
            <div className="flex items-center justify-center gap-2 text-foreground-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating your check-in QR code...</span>
            </div>
          )}
          {qrCodeUrl && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="mx-auto w-48 h-48 rounded-xl overflow-hidden bg-white p-2 shadow-md">
                <Image
                  src={qrCodeUrl}
                  alt="Check-in QR Code"
                  width={192}
                  height={192}
                  className="w-full h-full"
                  unoptimized
                />
              </div>
              <p className="text-sm text-foreground-muted">
                Show this QR code at the event for quick check-in
              </p>
              <Button variant="secondary" size="sm" onClick={handleDownloadQr}>
                <Download className="h-4 w-4 mr-2" /> Download QR Code
              </Button>
            </motion.div>
          )}

          <div className="flex justify-center gap-4">
            <Link href={`/events/${id}`}>
              <Button variant="secondary">Back to Event</Button>
            </Link>
            <Link href="/events">
              <Button variant="primary">View All Events</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="mx-auto max-w-2xl">
        <Link href={`/events/${id}`} className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-primary-500 transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Event
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">Event Registration</h1>
          <p className="mt-2 text-foreground-muted">Fill out the form below to reserve your spot.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input id="firstName" name="firstName" label="First Name" placeholder="John" required />
              <Input id="lastName" name="lastName" label="Last Name" placeholder="Doe" required />
            </div>

            <Input id="email" name="email" label="Email Address" type="email" placeholder="john@example.com" required />
            <Input id="phone" name="phone" label="Phone Number" type="tel" placeholder="(555) 555-5555" required />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input id="age" name="age" label="Participant Age" type="number" placeholder="14" min={5} max={99} required />
              <Input id="guardian" name="guardian" label="Parent/Guardian Name" placeholder="Jane Doe" />
            </div>

            <Input id="emergency" name="emergency" label="Emergency Contact" placeholder="Name - Phone" required />

            <Textarea
              id="special"
              name="special"
              label="Special Requirements or Notes"
              placeholder="Any dietary restrictions, accessibility needs, or other information we should know..."
            />

            <div className="flex items-start gap-3">
              <input type="checkbox" id="terms" className="mt-1 accent-primary-500" required />
              <label htmlFor="terms" className="text-sm text-foreground-muted">
                I agree to the terms and conditions and confirm that the information provided is accurate.
                For minors, I confirm I am the parent/guardian.
              </label>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
