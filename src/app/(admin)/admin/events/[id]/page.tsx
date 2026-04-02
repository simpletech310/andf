"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, Loader2, Users, Calendar, DollarSign,
  CheckCircle2, BarChart3, ClipboardList, Settings,
  Plus, Trash2, ImageIcon, Clock, MapPin, CalendarDays,
  Star, FileText, Video, ListChecks, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/admin/file-upload";
import { MultiFileUpload } from "@/components/admin/multi-file-upload";

type Tab = "details" | "registrations" | "stats";

interface Program {
  id: string;
  title: string;
  slug: string;
}

interface ScheduleItem {
  time: string;
  title: string;
  description: string;
}

interface Registration {
  id: string;
  registrant_name: string;
  registrant_email: string;
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

  // Programs dropdown
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  // Section 1: Basic Info
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [programId, setProgramId] = useState("");
  const [eventType, setEventType] = useState("in_person");
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState("draft");

  // Section 2: Date & Location
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");

  // Section 3: Capacity & Pricing
  const [maxCapacity, setMaxCapacity] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");

  // Section 4: Media
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  // Section 5: What to Expect
  const [whatToExpect, setWhatToExpect] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);

  // Section 6: Schedule
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  // AI Form Builder
  const [formPrompt, setFormPrompt] = useState("");
  const [generatingForm, setGeneratingForm] = useState(false);
  const [generatedFields, setGeneratedFields] = useState<
    Array<{ name: string; label: string; type: string; required: boolean }>
  >([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch("/api/admin/content/programs");
        const data = await res.json();
        setPrograms(data.programs || []);
      } catch (err) {
        console.error("Failed to fetch programs:", err);
      } finally {
        setLoadingPrograms(false);
      }
    };
    fetchPrograms();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/events/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const ev = data.event;
        setEvent(ev);
        setRegistrations(data.registrations || []);

        // Populate all form fields
        setTitle(ev.title || "");
        setShortDescription(ev.short_description || "");
        setDescription(ev.description || "");
        setProgramId(ev.program_id || "");
        setEventType(ev.event_type || "in_person");
        setIsFeatured(ev.is_featured || false);
        setStatus(ev.status || "draft");

        setStartDate(ev.start_date ? ev.start_date.slice(0, 16) : "");
        setEndDate(ev.end_date ? ev.end_date.slice(0, 16) : "");
        setRegistrationDeadline(
          ev.registration_deadline
            ? ev.registration_deadline.slice(0, 16)
            : ""
        );
        setLocationName(ev.location_name || "");
        setLocationAddress(ev.location_address || "");

        setMaxCapacity(ev.max_capacity ? String(ev.max_capacity) : "");
        setTicketPrice(ev.ticket_price ? String(ev.ticket_price) : "");

        setCoverImageUrl(ev.cover_image_url || "");
        setVideoUrl(ev.video_url || "");
        setGalleryUrls(ev.gallery_urls || []);

        setWhatToExpect(ev.what_to_expect || "");
        setHighlights(ev.highlights || []);
        setSchedule(ev.schedule || []);

        if (ev.registration_form_schema?.fields) {
          setGeneratedFields(ev.registration_form_schema.fields);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // Dynamic list helpers
  const addHighlight = () => setHighlights([...highlights, ""]);
  const updateHighlight = (index: number, value: string) => {
    const updated = [...highlights];
    updated[index] = value;
    setHighlights(updated);
  };
  const removeHighlight = (index: number) =>
    setHighlights(highlights.filter((_, i) => i !== index));

  const addScheduleItem = () =>
    setSchedule([...schedule, { time: "", title: "", description: "" }]);
  const updateScheduleItem = (
    index: number,
    field: keyof ScheduleItem,
    value: string
  ) => {
    const updated = [...schedule];
    updated[index] = { ...updated[index], [field]: value };
    setSchedule(updated);
  };
  const removeScheduleItem = (index: number) =>
    setSchedule(schedule.filter((_, i) => i !== index));

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

  const handleSave = async () => {
    if (!title || !startDate) {
      alert("Title and Start Date are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          short_description: shortDescription || null,
          description: description || null,
          program_id: programId || null,
          event_type: eventType,
          is_featured: isFeatured,
          status,
          start_date: startDate ? new Date(startDate).toISOString() : null,
          end_date: endDate ? new Date(endDate).toISOString() : null,
          registration_deadline: registrationDeadline
            ? new Date(registrationDeadline).toISOString()
            : null,
          location_name: locationName || null,
          location_address: locationAddress || null,
          max_capacity: maxCapacity ? parseInt(maxCapacity) : null,
          ticket_price: ticketPrice ? parseFloat(ticketPrice) : 0,
          cover_image_url: coverImageUrl || null,
          video_url: videoUrl || null,
          gallery_urls:
            galleryUrls.filter((u) => u.trim()).length > 0
              ? galleryUrls.filter((u) => u.trim())
              : null,
          what_to_expect: whatToExpect || null,
          highlights:
            highlights.filter((h) => h.trim()).length > 0
              ? highlights.filter((h) => h.trim())
              : null,
          schedule:
            schedule.filter((s) => s.time || s.title).length > 0
              ? schedule.filter((s) => s.time || s.title)
              : null,
          registration_form_schema:
            generatedFields.length > 0 ? { fields: generatedFields } : null,
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
        <Link
          href="/admin/events"
          className="text-gold-500 mt-4 inline-block"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  const checkedInCount = registrations.filter((r) => r.checked_in).length;
  const paidCount = registrations.filter(
    (r) => r.payment_status === "paid"
  ).length;
  const capacityPct = event.max_capacity
    ? Math.round((registrations.length / event.max_capacity) * 100)
    : null;
  const totalRevenue =
    registrations.filter((r) => r.payment_status === "paid").length *
    (event.ticket_price || 0);

  const tabs = [
    { key: "details" as Tab, label: "Details", icon: Settings },
    { key: "registrations" as Tab, label: "Registrations", icon: ClipboardList },
    { key: "stats" as Tab, label: "Stats", icon: BarChart3 },
  ];

  const selectClasses =
    "flex h-11 w-full rounded-lg bg-background-elevated border border-border px-4 text-foreground";

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-gold-500 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-bold text-foreground">
            {event.title}
          </h1>
          <Badge
            variant={
              event.status === "published"
                ? "success"
                : event.status === "draft"
                  ? "warning"
                  : event.status === "cancelled"
                    ? "danger"
                    : "default"
            }
          >
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
        <div className="space-y-6">
          {/* Section 1: Basic Info */}
          <Card hover={false}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gold-500" />
                Basic Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                id="editTitle"
                label="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground-muted">
                  Short Description{" "}
                  <span className="text-foreground-subtle">
                    ({shortDescription.length}/200)
                  </span>
                </label>
                <Textarea
                  id="editShortDesc"
                  placeholder="Brief description for event listings..."
                  value={shortDescription}
                  onChange={(e) =>
                    setShortDescription(e.target.value.slice(0, 200))
                  }
                />
              </div>
              <Textarea
                id="editDesc"
                label="Full Description"
                placeholder="Detailed description for the event detail page..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground-muted">
                    Program
                  </label>
                  <select
                    className={selectClasses}
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                  >
                    <option value="">
                      {loadingPrograms ? "Loading..." : "Select program"}
                    </option>
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground-muted">
                    Event Type
                  </label>
                  <select
                    className={selectClasses}
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                  >
                    <option value="in_person">In Person</option>
                    <option value="virtual">Virtual</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground-muted">
                    Status
                  </label>
                  <select
                    className={selectClasses}
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
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    isFeatured
                      ? "bg-gold-500"
                      : "bg-background-elevated border border-border"
                  }`}
                  onClick={() => setIsFeatured(!isFeatured)}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      isFeatured ? "translate-x-5" : ""
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-foreground-muted flex items-center gap-1.5">
                  <Star className="h-4 w-4" />
                  Featured Event
                </span>
              </label>
            </CardContent>
          </Card>

          {/* Section 2: Date & Location */}
          <Card hover={false}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-gold-500" />
                Date & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="editStart"
                  label="Start Date"
                  type="datetime-local"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  id="editEnd"
                  label="End Date"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <Input
                id="editRegDeadline"
                label="Registration Deadline"
                type="datetime-local"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
              />
              {eventType === "virtual" && (
                <p className="text-sm text-foreground-subtle italic">
                  Location fields are optional for virtual events.
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="editLocationName"
                  label="Location Name"
                  placeholder='e.g. "TopGolf Atlanta"'
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                />
                <Input
                  id="editLocationAddress"
                  label="Location Address"
                  placeholder='e.g. "1234 Main St, Atlanta, GA"'
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Capacity & Pricing */}
          <Card hover={false}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-gold-500" />
                Capacity & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="editCapacity"
                  label="Max Capacity"
                  type="number"
                  placeholder="100"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                />
                <Input
                  id="editPrice"
                  label="Ticket Price ($)"
                  type="number"
                  step="0.01"
                  placeholder="0.00 for free events"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Event Media */}
          <Card hover={false}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-gold-500" />
                Event Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload
                label="Cover Image"
                accept="image/jpeg,image/png,image/gif,image/webp"
                folder="events/covers"
                currentUrl={coverImageUrl}
                onUpload={(url) => setCoverImageUrl(url)}
              />
              <FileUpload
                label="Video (optional)"
                accept="video/mp4,video/quicktime,video/webm"
                folder="events/videos"
                currentUrl={videoUrl}
                onUpload={(url) => setVideoUrl(url)}
              />
              <MultiFileUpload
                label="Gallery Images"
                folder="events/gallery"
                urls={galleryUrls}
                onUrlsChange={setGalleryUrls}
              />
            </CardContent>
          </Card>

          {/* Section 5: What to Expect */}
          <Card hover={false}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-gold-500" />
                What to Expect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="editWhatToExpect"
                label="What to Expect"
                placeholder="Describe what attendees should expect at this event..."
                value={whatToExpect}
                onChange={(e) => setWhatToExpect(e.target.value)}
              />
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground-muted">
                  Highlights
                </label>
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      id={`edit-highlight-${i}`}
                      placeholder='e.g. "Professional instrument training"'
                      value={h}
                      onChange={(e) => updateHighlight(i, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeHighlight(i)}
                      className="text-red-400 hover:text-red-300 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={addHighlight}
                >
                  <Plus className="h-4 w-4" />
                  Add Highlight
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Section 6: Event Schedule */}
          <Card hover={false}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gold-500" />
                Event Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {schedule.map((item, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-background-elevated border border-border space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground-muted">
                      Item {i + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeScheduleItem(i)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      id={`edit-sched-time-${i}`}
                      placeholder='e.g. "9:00 AM"'
                      label="Time"
                      value={item.time}
                      onChange={(e) =>
                        updateScheduleItem(i, "time", e.target.value)
                      }
                    />
                    <Input
                      id={`edit-sched-title-${i}`}
                      placeholder='e.g. "Registration & Welcome"'
                      label="Title"
                      value={item.title}
                      onChange={(e) =>
                        updateScheduleItem(i, "title", e.target.value)
                      }
                    />
                    <Input
                      id={`edit-sched-desc-${i}`}
                      placeholder='e.g. "Check in, get your name badge"'
                      label="Description"
                      value={item.description}
                      onChange={(e) =>
                        updateScheduleItem(i, "description", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="secondary"
                size="sm"
                onClick={addScheduleItem}
              >
                <Plus className="h-4 w-4" />
                Add Schedule Item
              </Button>
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
                Describe what information you need from registrants and AI will
                generate a custom form.
              </p>
              <Textarea
                id="editFormPrompt"
                placeholder='e.g., "We need t-shirt size, dietary restrictions, instrument preference, and parent consent for a youth music camp for ages 8-16"'
                value={formPrompt}
                onChange={(e) => setFormPrompt(e.target.value)}
              />
              <Button
                variant="primary"
                onClick={handleGenerateForm}
                disabled={generatingForm || !formPrompt}
              >
                {generatingForm ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Generate Form
                  </>
                )}
              </Button>

              {generatedFields.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">
                    Generated Fields:
                  </h4>
                  <div className="space-y-2">
                    {generatedFields.map((field, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg bg-background-elevated border border-border"
                      >
                        <div>
                          <span className="text-sm font-medium text-foreground">
                            {field.label}
                          </span>
                          <span className="text-xs text-foreground-subtle ml-2">
                            ({field.type})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {field.required && (
                            <span className="text-xs text-gold-500">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
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
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-3">
                      Name
                    </th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-3">
                      Email
                    </th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-3">
                      Phone
                    </th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-3">
                      Payment
                    </th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-6 py-3">
                      Checked In
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr
                      key={reg.id}
                      className="border-b border-border last:border-0 hover:bg-background-elevated/50 transition-colors"
                    >
                      <td className="px-6 py-3 text-sm text-foreground">
                        {reg.registrant_name}
                      </td>
                      <td className="px-6 py-3 text-sm text-foreground-muted">
                        {reg.registrant_email}
                      </td>
                      <td className="px-6 py-3 text-sm text-foreground-muted">
                        {reg.phone || "-"}
                      </td>
                      <td className="px-6 py-3">
                        <Badge
                          variant={
                            reg.status === "confirmed" ? "success" : "default"
                          }
                        >
                          {reg.status || "registered"}
                        </Badge>
                      </td>
                      <td className="px-6 py-3">
                        <Badge
                          variant={
                            reg.payment_status === "paid"
                              ? "success"
                              : "warning"
                          }
                        >
                          {reg.payment_status || "n/a"}
                        </Badge>
                      </td>
                      <td className="px-6 py-3">
                        {reg.checked_in ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <span className="text-foreground-subtle text-sm">
                            No
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {registrations.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-foreground-muted"
                      >
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
                    <div
                      className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center`}
                    >
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-foreground-muted">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {capacityPct !== null && (
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-4 rounded-full bg-background-elevated overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gold-500 transition-all"
                      style={{ width: `${Math.min(capacityPct, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-foreground-muted">
                    {registrations.length} / {event.max_capacity}
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
