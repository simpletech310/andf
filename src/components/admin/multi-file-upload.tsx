"use client";

import { useState, useRef } from "react";
import { Plus, X, Loader2, AlertCircle, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MultiFileUploadProps {
  urls: string[];
  onUrlsChange: (urls: string[]) => void;
  folder: string;
  label: string;
}

export function MultiFileUpload({
  urls,
  onUrlsChange,
  folder,
  label,
}: MultiFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: FileList) => {
    setError(null);
    setUploading(true);
    const total = files.length;
    setUploadCount({ current: 0, total });

    const newUrls: string[] = [];

    for (let i = 0; i < total; i++) {
      setUploadCount({ current: i + 1, total });
      try {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("folder", folder);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        newUrls.push(data.url);
      } catch (err: any) {
        setError(`Failed to upload ${files[i].name}: ${err.message}`);
      }
    }

    if (newUrls.length > 0) {
      onUrlsChange([...urls, ...newUrls]);
    }

    setUploading(false);
    setUploadCount({ current: 0, total: 0 });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) uploadFiles(files);
    e.target.value = "";
  };

  const removeUrl = (index: number) => {
    onUrlsChange(urls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground-muted">{label}</label>

      {urls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {urls.map((url, i) => (
            <div
              key={i}
              className="relative group rounded-lg border border-border bg-background-elevated overflow-hidden"
            >
              <img
                src={url}
                alt={`Gallery ${i + 1}`}
                className="w-full h-24 object-cover"
              />
              <button
                type="button"
                onClick={() => removeUrl(i)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading {uploadCount.current}/{uploadCount.total}...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add Images
            </>
          )}
        </Button>
        {urls.length > 0 && (
          <span className="text-xs text-foreground-subtle">
            {urls.length} image{urls.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
