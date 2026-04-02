"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Plus, Search, Film, Clock, Eye, Trash2, Upload, X,
  CheckCircle2, AlertCircle, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Video {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  mux_playback_id: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  view_count: number;
  featured: boolean;
  published_at: string | null;
  created_at: string;
}

const CATEGORIES = [
  "general",
  "event-recap",
  "interview",
  "tutorial",
  "highlight",
  "documentary",
  "promo",
];

const STATUS_BADGES: Record<string, { variant: "success" | "warning" | "info" | "default"; label: string }> = {
  ready: { variant: "success", label: "Ready" },
  waiting: { variant: "warning", label: "Waiting" },
  processing: { variant: "info", label: "Processing" },
  errored: { variant: "default", label: "Error" },
};

function formatDuration(seconds: number | null): string {
  if (!seconds) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Upload state
  const [uploadForm, setUploadForm] = useState({ title: "", description: "", category: "general" });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    try {
      const res = await fetch("/api/admin/videos");
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadFile || !uploadForm.title) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Create video entry and get Mux upload URL
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadForm),
      });

      if (!res.ok) throw new Error("Failed to create video");
      const { uploadUrl } = await res.json();

      // Step 2: Upload file directly to Mux
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("Upload failed")));
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(uploadFile);
      });

      setUploadSuccess(true);
      setTimeout(() => {
        setShowUpload(false);
        setUploadForm({ title: "", description: "", category: "general" });
        setUploadFile(null);
        setUploadSuccess(false);
        fetchVideos();
      }, 2000);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(videoId: string) {
    if (!confirm("Are you sure you want to delete this video? This cannot be undone.")) return;
    setDeleting(videoId);
    try {
      await fetch(`/api/admin/videos/${videoId}`, { method: "DELETE" });
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(null);
    }
  }

  async function togglePublish(video: Video) {
    const isPublished = !!video.published_at;
    try {
      await fetch(`/api/admin/videos/${video.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          published_at: isPublished ? null : new Date().toISOString(),
        }),
      });
      setVideos((prev) =>
        prev.map((v) =>
          v.id === video.id
            ? { ...v, published_at: isPublished ? null : new Date().toISOString() }
            : v
        )
      );
    } catch (err) {
      console.error("Toggle publish failed:", err);
    }
  }

  const filtered = videos.filter((v) => {
    if (categoryFilter !== "all" && v.category !== categoryFilter) return false;
    if (statusFilter !== "all" && v.status !== statusFilter) return false;
    if (search && !v.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-11 w-36" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Video Library</h1>
          <p className="text-foreground-muted mt-1">Manage and upload video content</p>
        </div>
        <Button variant="primary" onClick={() => setShowUpload(true)}>
          <Plus className="h-4 w-4" /> Upload Video
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
          <Input
            placeholder="Search videos..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="h-11 rounded-lg bg-background-elevated border border-border px-4 text-sm text-foreground-muted"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </option>
          ))}
        </select>
        <select
          className="h-11 rounded-lg bg-background-elevated border border-border px-4 text-sm text-foreground-muted"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="ready">Ready</option>
          <option value="processing">Processing</option>
          <option value="waiting">Waiting</option>
        </select>
      </div>

      {/* Video Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Film className="h-12 w-12 text-foreground-subtle mx-auto mb-3" />
          <p className="text-foreground-muted">No videos found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((video) => {
            const statusBadge = STATUS_BADGES[video.status] || STATUS_BADGES.waiting;
            return (
              <Card key={video.id} hover={true}>
                {/* Thumbnail */}
                <div className="relative aspect-video bg-background-elevated rounded-t-2xl overflow-hidden">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="h-10 w-10 text-foreground-subtle" />
                    </div>
                  )}
                  {video.duration_seconds && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-medium">
                      {formatDuration(video.duration_seconds)}
                    </span>
                  )}
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <Link
                      href={`/admin/videos/${video.id}`}
                      className="text-sm font-semibold text-foreground hover:text-gold-500 transition-colors line-clamp-1"
                    >
                      {video.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      <span className="text-xs text-foreground-subtle capitalize">
                        {video.category.replace("-", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-foreground-muted">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {video.view_count || 0} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(video.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-border">
                    <button
                      onClick={() => togglePublish(video)}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        video.published_at
                          ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                          : "bg-background-elevated text-foreground-muted hover:text-foreground"
                      }`}
                    >
                      {video.published_at ? "Published" : "Unpublished"}
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      disabled={deleting === video.id}
                      className="p-1.5 rounded-lg text-foreground-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-background-card border border-border shadow-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Upload Video</h2>
              <button
                onClick={() => {
                  setShowUpload(false);
                  setUploadFile(null);
                  setUploadSuccess(false);
                }}
                className="p-2 rounded-lg hover:bg-background-elevated transition-colors"
              >
                <X className="h-5 w-5 text-foreground-muted" />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
                <p className="text-lg font-semibold text-foreground">Upload Complete!</p>
                <p className="text-sm text-foreground-muted">
                  Your video is now processing. It will appear in the library once ready.
                </p>
              </div>
            ) : (
              <form onSubmit={handleUpload} className="space-y-4">
                <Input
                  label="Title"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="Video title"
                  required
                />
                <Textarea
                  label="Description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="Optional description..."
                  className="min-h-[80px]"
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground-muted">Category</label>
                  <select
                    className="flex h-11 w-full rounded-lg bg-background-elevated border border-border px-4 text-foreground"
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground-muted">Video File</label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-border hover:border-gold-500 cursor-pointer transition-colors"
                  >
                    <Upload className="h-8 w-8 text-foreground-subtle" />
                    {uploadFile ? (
                      <p className="text-sm font-medium text-foreground">{uploadFile.name}</p>
                    ) : (
                      <p className="text-sm text-foreground-muted">Click to select a video file</p>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  />
                </div>

                {/* Upload progress */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground-muted">Uploading...</span>
                      <span className="font-medium text-foreground">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-background-elevated overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gold-500 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={uploading || !uploadFile || !uploadForm.title}
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Video
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
