"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewEventPage() {
  const router = useRouter();
  const [formPrompt, setFormPrompt] = useState("");
  const [generatingForm, setGeneratingForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedFields, setGeneratedFields] = useState<Array<{ name: string; label: string; type: string; required: boolean }>>([]);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [programId, setProgramId] = useState("");
  const [eventType, setEventType] = useState("in_person");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");

  const handleGenerateForm = async () => {
    if (!formPrompt) return;
    setGeneratingForm(true);
    try {
      const res = await fetch("/api/ai/generate-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventDescription: formPrompt }),
      });
      const data = await res.json();
      if (data.formSchema?.fields) {
        setGeneratedFields(data.formSchema.fields);
      }
    } catch (err) {
      console.error("Form generation failed:", err);
    }
    setGeneratingForm(false);
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!title || !startDate) {
      alert("Title and Start Date are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          program_id: programId || null,
          event_type: eventType,
          start_date: new Date(startDate).toISOString(),
          end_date: endDate ? new Date(endDate).toISOString() : null,
          location,
          capacity: capacity || null,
          price_cents: price ? parseFloat(price) : 0,
          status,
          registration_form_schema: generatedFields.length > 0 ? { fields: generatedFields } : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push("/admin/events");
    } catch (err: any) {
      alert(err.message || "Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link href="/admin/events" className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-gold-500 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>
        <h1 className="text-3xl font-display font-bold text-foreground">Create New Event</h1>
      </div>

      <div className="space-y-6">
        <Card hover={false}>
          <CardHeader><CardTitle>Event Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input id="eventTitle" label="Event Title" placeholder="Summer Band Camp 2026" required value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea id="eventDesc" label="Description" placeholder="Describe your event..." value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground-muted">Program</label>
                <select
                  className="flex h-11 w-full rounded-lg bg-background-elevated border border-border px-4 text-foreground"
                  value={programId}
                  onChange={(e) => setProgramId(e.target.value)}
                >
                  <option value="">Select program</option>
                  <option value="band-camp">Band Camp</option>
                  <option value="drone-experience">Drone Experience</option>
                  <option value="topgolf">TopGolf</option>
                  <option value="mentorship">Mentorship</option>
                  <option value="hbcu-heroes">HBCU Heroes</option>
                </select>
              </div>
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
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input id="startDate" label="Start Date" type="datetime-local" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <Input id="endDate" label="End Date" type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <Input id="location" label="Location" placeholder="Event venue or 'Virtual'" value={location} onChange={(e) => setLocation(e.target.value)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input id="capacity" label="Max Capacity" type="number" placeholder="100" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
              <Input id="price" label="Ticket Price ($)" type="number" step="0.01" placeholder="0.00 for free" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* AI Form Builder */}
        <Card hover={false}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-gold-500" />
              AI Registration Form Builder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground-muted">
              Describe what information you need from registrants and AI will generate a custom form.
            </p>
            <Textarea
              id="formPrompt"
              placeholder='e.g., "We need t-shirt size, dietary restrictions, instrument preference, and parent consent for a youth music camp for ages 8-16"'
              value={formPrompt}
              onChange={(e) => setFormPrompt(e.target.value)}
            />
            <Button variant="primary" onClick={handleGenerateForm} disabled={generatingForm || !formPrompt}>
              {generatingForm ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Sparkles className="h-4 w-4" /> Generate Form</>}
            </Button>

            {generatedFields.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-semibold text-foreground">Generated Fields:</h4>
                <div className="space-y-2">
                  {generatedFields.map((field, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background-elevated border border-border">
                      <div>
                        <span className="text-sm font-medium text-foreground">{field.label}</span>
                        <span className="text-xs text-foreground-subtle ml-2">({field.type})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {field.required && <span className="text-xs text-gold-500">Required</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={() => handleSave("draft")} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save as Draft
          </Button>
          <Button variant="primary" onClick={() => handleSave("published")} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Publish Event
          </Button>
        </div>
      </div>
    </div>
  );
}
