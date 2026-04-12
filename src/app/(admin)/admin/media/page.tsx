"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, Upload, Grid, List, Star, Trash2, X, Copy,
  Image as ImageIcon, Film, Loader2, Check
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { format } from "date-fns";

interface MediaAsset {
  id: string;
  file_name: string;
  file_path: string;
  url: string;
  mime_type: string;
  file_size: number;
  alt_text: string;
  category: string;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
}

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "24" });
      if (search) params.set("search", search);
      if (typeFilter !== "all") params.set("type", typeFilter);
      const res = await fetch(`/api/admin/media?${params}`);
      const data = await res.json();
      setAssets(data.assets || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, page]);

  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "general");
      try {
        await fetch("/api/admin/media", { method: "POST", body: formData });
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
    setUploading(false);
    fetchAssets();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await fetch(`/api/admin/media/${deleteId}`, { method: "DELETE" });
    setAssets((prev) => prev.filter((a) => a.id !== deleteId));
    if (selectedAsset?.id === deleteId) setSelectedAsset(null);
    setDeleteId(null);
  };

  const handleToggleFavorite = async (asset: MediaAsset) => {
    const res = await fetch(`/api/admin/media/${asset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_favorite: !asset.is_favorite }),
    });
    if (res.ok) {
      const data = await res.json();
      setAssets((prev) => prev.map((a) => (a.id === asset.id ? data.asset : a)));
      if (selectedAsset?.id === asset.id) setSelectedAsset(data.asset);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateAlt = async (id: string, alt_text: string) => {
    await fetch(`/api/admin/media/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt_text }),
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (mime: string) => mime?.startsWith("image/");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        description="Upload, browse, and manage all images and videos used across your website."
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search files..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background-card text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-border bg-background-card text-sm text-foreground"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-primary-50 text-primary-600" : "text-foreground-muted hover:text-foreground"}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-primary-50 text-primary-600" : "text-foreground-muted hover:text-foreground"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Grid / List */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-background-card animate-pulse" />
              ))}
            </div>
          ) : assets.length === 0 ? (
            <div className="text-center py-20 rounded-xl border border-dashed border-border">
              <ImageIcon className="h-12 w-12 text-foreground-subtle mx-auto mb-4" />
              <p className="text-foreground-muted mb-2">No media files yet</p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4" /> Upload Files
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedAsset?.id === asset.id ? "border-primary-500 ring-2 ring-primary-200" : "border-border hover:border-primary-200"
                  }`}
                >
                  {isImage(asset.mime_type) ? (
                    <img src={asset.url} alt={asset.alt_text} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-background-elevated flex items-center justify-center">
                      <Film className="h-10 w-10 text-foreground-muted" />
                    </div>
                  )}
                  {asset.is_favorite && (
                    <div className="absolute top-2 right-2">
                      <Star className="h-4 w-4 text-gold-500 fill-gold-500" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white truncate">{asset.file_name}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`w-full flex items-center gap-4 p-3 rounded-lg border transition-all ${
                    selectedAsset?.id === asset.id ? "border-primary-500 bg-primary-50" : "border-border hover:border-primary-200"
                  }`}
                >
                  <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-background-elevated">
                    {isImage(asset.mime_type) ? (
                      <img src={asset.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="h-5 w-5 text-foreground-muted" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-foreground truncate">{asset.file_name}</p>
                    <p className="text-xs text-foreground-subtle">{formatSize(asset.file_size)} &middot; {asset.mime_type}</p>
                  </div>
                  <span className="text-xs text-foreground-subtle">{format(new Date(asset.created_at), "MMM d, yyyy")}</span>
                </button>
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > 24 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <span className="text-sm text-foreground-muted py-2">Page {page} of {Math.ceil(total / 24)}</span>
              <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 24)} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedAsset && (
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-6 rounded-xl border border-border bg-background-card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Details</h3>
                <button onClick={() => setSelectedAsset(null)} className="text-foreground-muted hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="aspect-video rounded-lg overflow-hidden bg-background-elevated">
                {isImage(selectedAsset.mime_type) ? (
                  <img src={selectedAsset.url} alt={selectedAsset.alt_text} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="h-12 w-12 text-foreground-muted" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-foreground-subtle">File Name</label>
                  <p className="text-sm text-foreground truncate">{selectedAsset.file_name}</p>
                </div>
                <div>
                  <label className="text-xs text-foreground-subtle">Size</label>
                  <p className="text-sm text-foreground">{formatSize(selectedAsset.file_size)}</p>
                </div>
                <div>
                  <label className="text-xs text-foreground-subtle">Type</label>
                  <p className="text-sm text-foreground">{selectedAsset.mime_type}</p>
                </div>
                <div>
                  <label className="text-xs text-foreground-subtle">Uploaded</label>
                  <p className="text-sm text-foreground">{format(new Date(selectedAsset.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
                </div>

                <div>
                  <label className="text-xs text-foreground-subtle block mb-1">Alt Text</label>
                  <input
                    type="text"
                    defaultValue={selectedAsset.alt_text}
                    onBlur={(e) => handleUpdateAlt(selectedAsset.id, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleCopyUrl(selectedAsset.url)}
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied!" : "Copy URL"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleFavorite(selectedAsset)}
                  >
                    <Star className={`h-3.5 w-3.5 ${selectedAsset.is_favorite ? "fill-gold-500 text-gold-500" : ""}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-500"
                    onClick={() => setDeleteId(selectedAsset.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Media"
        message="This will permanently delete this file from storage. This cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
