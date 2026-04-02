"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, Trash2, Plus, Clock, X, Loader2, Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Video {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  mux_playback_id: string | null;
  mux_asset_id: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  view_count: number;
  featured: boolean;
  published_at: string | null;
  created_at: string;
}

interface CuePoint {
  id: string;
  video_id: string;
  trigger_at_seconds: number;
  ad_submission_id: string;
  is_active: boolean;
  created_at: string;
  ad_submissions: {
    id: string;
    title: string;
    sponsor_id: string;
    status: string;
  } | null;
}

interface AdSubmission {
  id: string;
  title: string;
  status: string;
}

const CATEGORIES = [
  "general", "event-recap", "interview", "tutorial",
  "highlight", "documentary", "promo",
];

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AdminVideoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [video, setVideo] = useState<Video | null>(null);
  const [cuepoints, setCuepoints] = useState<CuePoint[]>([]);
  const [adSubmissions, setAdSubmissions] = useState<AdSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit form
  const [form, setForm] = useState({ title: "", description: "", category: "" });

  // Cue point form
  const [cpMinutes, setCpMinutes] = useState("");
  const [cpSeconds, setCpSeconds] = useState("");
  const [cpAdId, setCpAdId] = useState("");
  const [addingCp, setAddingCp] = useState(false);

  const fetchVideo = useCallback(async () => {
    try {
      const [videoRes, cpRes, adsRes] = await Promise.all([
        fetch(`/api/admin/videos/${id}`),
        fetch(`/api/admin/videos/${id}/cuepoints`),
        fetch(`/api/admin/ads?status=active`),
      ]);

      const videoData = await videoRes.json();
      const cpData = await cpRes.json();
      let adsData: { submissions?: AdSubmission[] } = { submissions: [] };
      try {
        adsData = await adsRes.json();
      } catch {
        // ads endpoint might not return expected format
      }

      setVideo(videoData.video);
      setForm({
        title: videoData.video.title || "",
        description: videoData.video.description || "",
        category: videoData.video.category || "general",
      });
      setCuepoints(cpData.cuepoints || []);
      setAdSubmissions(adsData.submissions || []);
    } catch (err) {
      console.error("Failed to load video:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`/api/admin/videos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this video permanently?")) return;
    try {
      await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
      router.push("/admin/videos");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  async function handleAddCuePoint(e: React.FormEvent) {
    e.preventDefault();
    if (!cpAdId) return;
    setAddingCp(true);

    const triggerAtSeconds =
      (parseInt(cpMinutes || "0") * 60) + parseInt(cpSeconds || "0");

    try {
      const res = await fetch(`/api/admin/videos/${id}/cuepoints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ triggerAtSeconds, adSubmissionId: cpAdId }),
      });
      const data = await res.json();
      if (data.cuepoint) {
        setCuepoints((prev) => [...prev, data.cuepoint].sort((a, b) => a.trigger_at_seconds - b.trigger_at_seconds));
        setCpMinutes("");
        setCpSeconds("");
        setCpAdId("");
      }
    } catch (err) {
      console.error("Add cuepoint failed:", err);
    } finally {
      setAddingCp(false);
    }
  }

  async function handleDeleteCuePoint(cuePointId: string) {
    try {
      await fetch(`/api/admin/videos/${id}/cuepoints`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cuePointId }),
      });
      setCuepoints((prev) => prev.filter((cp) => cp.id !== cuePointId));
    } catch (err) {
      console.error("Delete cuepoint failed:", err);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[300px] w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-16">
        <Film className="h-12 w-12 text-foreground-subtle mx-auto mb-3" />
        <p className="text-foreground-muted">Video not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back + header */}
      <div>
        <Link
          href="/admin/videos"
          className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Videos
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-foreground">
            {video.title}
          </h1>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Mux Player Preview */}
      {video.mux_playback_id ? (
        <div className="rounded-2xl overflow-hidden bg-black aspect-video">
          {/* @ts-expect-error mux-player web component */}
          <mux-player
            playback-id={video.mux_playback_id}
            style={{ width: "100%", height: "100%" }}
            stream-type="on-demand"
          />
        </div>
      ) : (
        <div className="rounded-2xl bg-background-elevated aspect-video flex items-center justify-center">
          <div className="text-center space-y-2">
            <Film className="h-12 w-12 text-foreground-subtle mx-auto" />
            <p className="text-foreground-muted text-sm">
              {video.status === "waiting"
                ? "Waiting for upload..."
                : video.status === "processing"
                ? "Video is processing..."
                : "No playback available"}
            </p>
            <Badge variant={video.status === "processing" ? "info" : "warning"}>
              {video.status}
            </Badge>
          </div>
        </div>
      )}

      {/* Edit Form */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="min-h-[80px]"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground-muted">Category</label>
            <select
              className="flex h-11 w-full rounded-lg bg-background-elevated border border-border px-4 text-foreground"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </span>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Ad Cue Points */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>Ad Cue Points</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing cue points */}
          {cuepoints.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-4 py-3">
                      Timestamp
                    </th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-4 py-3">
                      Ad
                    </th>
                    <th className="text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider px-4 py-3">
                      Status
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {cuepoints.map((cp) => (
                    <tr key={cp.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-sm font-mono text-foreground">
                          <Clock className="h-3.5 w-3.5 text-gold-500" />
                          {formatTimestamp(cp.trigger_at_seconds)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground-muted">
                        {cp.ad_submissions?.title || "Unknown Ad"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={cp.is_active ? "success" : "default"}>
                          {cp.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteCuePoint(cp.id)}
                          className="p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-foreground-muted py-4 text-center">
              No cue points yet. Add one below.
            </p>
          )}

          {/* Add cue point form */}
          <form
            onSubmit={handleAddCuePoint}
            className="flex flex-wrap items-end gap-3 pt-4 border-t border-border"
          >
            <div className="flex items-center gap-1">
              <Input
                label="Minutes"
                type="number"
                min="0"
                value={cpMinutes}
                onChange={(e) => setCpMinutes(e.target.value)}
                placeholder="0"
                className="w-20"
              />
              <span className="text-foreground-muted mt-6">:</span>
              <Input
                label="Seconds"
                type="number"
                min="0"
                max="59"
                value={cpSeconds}
                onChange={(e) => setCpSeconds(e.target.value)}
                placeholder="00"
                className="w-20"
              />
            </div>
            <div className="flex-1 min-w-[200px] space-y-1.5">
              <label className="text-sm font-medium text-foreground-muted">Ad Submission</label>
              <select
                className="flex h-11 w-full rounded-lg bg-background-elevated border border-border px-4 text-foreground text-sm"
                value={cpAdId}
                onChange={(e) => setCpAdId(e.target.value)}
                required
              >
                <option value="">Select an ad...</option>
                {adSubmissions.map((ad) => (
                  <option key={ad.id} value={ad.id}>
                    {ad.title}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" size="sm" disabled={addingCp || !cpAdId}>
              {addingCp ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
