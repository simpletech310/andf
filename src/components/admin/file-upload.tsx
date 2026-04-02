"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Film, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept: string;
  folder: string;
  label: string;
  currentUrl?: string;
}

export function FileUpload({
  onUpload,
  accept,
  folder,
  label,
  currentUrl,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isVideo = accept.includes("video");
  const previewUrl = currentUrl || null;

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);
      setProgress(0);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        // Use XMLHttpRequest for progress tracking
        const url = await new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 100));
            }
          });

          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const data = JSON.parse(xhr.responseText);
              resolve(data.url);
            } else {
              try {
                const data = JSON.parse(xhr.responseText);
                reject(new Error(data.error || "Upload failed"));
              } catch {
                reject(new Error("Upload failed"));
              }
            }
          });

          xhr.addEventListener("error", () => reject(new Error("Network error")));
          xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

          xhr.open("POST", "/api/admin/upload");
          xhr.send(formData);
        });

        onUpload(url);
      } catch (err: any) {
        setError(err.message || "Upload failed");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [folder, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset so the same file can be selected again
    e.target.value = "";
  };

  const handleRemove = () => {
    onUpload("");
    setError(null);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground-muted">{label}</label>

      {previewUrl ? (
        <div className="relative rounded-lg border border-border bg-background-elevated p-3">
          <div className="flex items-center gap-3">
            {isVideo ? (
              <div className="h-20 w-28 rounded bg-background flex items-center justify-center shrink-0">
                <Film className="h-8 w-8 text-foreground-muted" />
              </div>
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-20 w-28 rounded object-cover shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{previewUrl}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="text-red-400 hover:text-red-300 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            dragOver
              ? "border-gold-500 bg-gold-500/5"
              : "border-border bg-background-elevated hover:border-foreground-subtle"
          }`}
        >
          {uploading ? (
            <div className="space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-gold-500 mx-auto" />
              <p className="text-sm text-foreground-muted">
                Uploading... {progress}%
              </p>
              <div className="w-full max-w-xs mx-auto h-2 rounded-full bg-background overflow-hidden">
                <div
                  className="h-full rounded-full bg-gold-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mx-auto h-10 w-10 rounded-lg bg-background flex items-center justify-center">
                {isVideo ? (
                  <Film className="h-5 w-5 text-foreground-muted" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-foreground-muted" />
                )}
              </div>
              <div>
                <p className="text-sm text-foreground-muted">
                  Drag and drop or{" "}
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="text-gold-500 hover:text-gold-400 font-medium"
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-foreground-subtle mt-1">
                  {isVideo
                    ? "MP4, MOV, or WebM up to 50MB"
                    : "JPG, PNG, GIF, or WebP up to 10MB"}
                </p>
              </div>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
