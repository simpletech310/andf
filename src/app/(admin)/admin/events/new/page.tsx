"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Sparkles, Loader2, Plus, Trash2,
  ImageIcon, Clock, MapPin, CalendarDays, DollarSign,
  Users, Star, FileText, Video, ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/admin/file-upload";
import { MultiFileUpload } from "@/components/admin/multi-file-upload";

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

export default function NewEventPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

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

  // Section 7: AI Form Builder
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
          short_description: shortDescription || null,
          description: description || null,
          program_id: programId || null,
          event_type: eventType,
          is_featured: isFeatured,
          start_date: new Date(startDate).toISOString(),
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
          status,
          registration_form_schema:
            generatedFields.length > 0 ? { fields: generatedFields } : null,
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

  const selectClasses =
    "flex h-11 w-full rounded-lg bg-background-elevated border border-border px-4 text-foreground";

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-gold-500 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Create New Event
        </h1>
      </div>

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
              id="eventTitle"
              label="Event Title"
              placeholder="Summer Band Camp 2026"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground-muted">
                Short Description{" "}
                <span className="text-foreground-subtle">
                  ({shortDescription.length}/200)
                </span>
              </label>
              <Textarea
                id="shortDesc"
                placeholder="Brief description for event listings..."
                value={shortDescription}
                onChange={(e) =>
                  setShortDescription(e.target.value.slice(0, 200))
                }
              />
            </div>
            <Textarea
              id="fullDesc"
              label="Full Description"
              placeholder="Detailed description for the event detail page..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  isFeatured ? "bg-gold-500" : "bg-background-elevated border border-border"
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
                id="startDate"
                label="Start Date"
                type="datetime-local"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                id="endDate"
                label="End Date"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Input
              id="regDeadline"
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
                id="locationName"
                label="Location Name"
                placeholder='e.g. "TopGolf Atlanta"'
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />
              <Input
                id="locationAddress"
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
                id="maxCapacity"
                label="Max Capacity"
                type="number"
                placeholder="100"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
              />
              <Input
                id="ticketPrice"
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
              id="whatToExpect"
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
                    id={`highlight-${i}`}
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
                    id={`sched-time-${i}`}
                    placeholder='e.g. "9:00 AM"'
                    label="Time"
                    value={item.time}
                    onChange={(e) =>
                      updateScheduleItem(i, "time", e.target.value)
                    }
                  />
                  <Input
                    id={`sched-title-${i}`}
                    placeholder='e.g. "Registration & Welcome"'
                    label="Title"
                    value={item.title}
                    onChange={(e) =>
                      updateScheduleItem(i, "title", e.target.value)
                    }
                  />
                  <Input
                    id={`sched-desc-${i}`}
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
            <Button variant="secondary" size="sm" onClick={addScheduleItem}>
              <Plus className="h-4 w-4" />
              Add Schedule Item
            </Button>
          </CardContent>
        </Card>

        {/* Section 7: AI Form Builder */}
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
              id="formPrompt"
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

        {/* Save Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={() => handleSave("draft")}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save as Draft
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSave("published")}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Publish Event
          </Button>
        </div>
      </div>
    </div>
  );
}
