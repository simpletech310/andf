"use client";

import { useState, useEffect } from "react";
import { Plus, Radio, Copy, Check, Eye, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Stream {
  id: string;
  title: string;
  status: string;
  mux_playback_id: string | null;
  mux_stream_key: string | null;
  event_title: string;
  created_at: string;
}

export default function AdminStreamsPage() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchStreams = async () => {
    try {
      const res = await fetch("/api/admin/streams");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStreams(data.streams);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStreams(); }, []);

  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewStream = async () => {
    const title = window.prompt("Enter stream title:");
    if (!title) return;
    setCreating(true);
    try {
      const res = await fetch("/api/streams/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to create stream");
      await fetchStreams();
    } catch (err: any) {
      alert(err.message || "Failed to create stream.");
    }
    setCreating(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold-500" /></div>;
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Live Streams</h1>
          <p className="text-foreground-muted mt-1">Manage Mux live streams</p>
        </div>
        <Button variant="primary" onClick={handleNewStream} disabled={creating}>
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          New Stream
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {streams.map((stream) => (
          <Card key={stream.id} hover={false}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-gold-500" />
                  {stream.title}
                </CardTitle>
                <Badge variant={stream.status === "active" ? "danger" : "default"}>
                  {stream.status === "active" ? "LIVE" : "Offline"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-foreground-muted">
                <span className="text-foreground-subtle">Event:</span> {stream.event_title}
              </div>

              {stream.mux_stream_key && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">Stream Key (for OBS)</label>
                  <div className="flex gap-2">
                    <Input value={stream.mux_stream_key} readOnly className="font-mono text-xs" />
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => copyKey(stream.id, stream.mux_stream_key!)}
                    >
                      {copiedId === stream.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  <Eye className="h-4 w-4" /> Preview
                </Button>
                <Button variant="primary" size="sm" className="flex-1">
                  <Radio className="h-4 w-4" /> Go Live
                </Button>
              </div>

              <div className="text-xs text-foreground-subtle">Created {formatDate(stream.created_at)}</div>
            </CardContent>
          </Card>
        ))}
        {streams.length === 0 && (
          <div className="col-span-2 text-center py-12 text-foreground-muted">
            No streams yet. Click &quot;New Stream&quot; to create one.
          </div>
        )}
      </div>

      {/* Instructions */}
      <Card hover={false}>
        <CardHeader><CardTitle>How to Stream</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-foreground-muted">
          <p>1. Create a new stream above and copy the Stream Key</p>
          <p>2. Open OBS Studio (or your preferred streaming software)</p>
          <p>3. Go to Settings &rarr; Stream &rarr; Service: Custom</p>
          <p>4. Server: <code className="bg-background-elevated px-2 py-0.5 rounded text-gold-500">rtmps://global-live.mux.com:443/app</code></p>
          <p>5. Stream Key: Paste the key from above</p>
          <p>6. Click &quot;Start Streaming&quot; in OBS &mdash; the stream will automatically appear on your website&apos;s Live page</p>
        </CardContent>
      </Card>
    </div>
  );
}
