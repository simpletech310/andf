"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Save,
  Loader2,
  Mail,
  Phone,
  User,
  Calendar,
  Shield,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

/* ─────────────────────────────────────────────── */
/*  Types                                          */
/* ─────────────────────────────────────────────── */

interface Application {
  id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string | null;
  applicant_age: number | null;
  guardian_name: string | null;
  guardian_email: string | null;
  guardian_phone: string | null;
  status: string;
  form_data: Record<string, string> | null;
  reviewer_notes: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  programs: { id: string; title: string; slug: string } | null;
}

/* ─────────────────────────────────────────────── */
/*  Status helpers                                 */
/* ─────────────────────────────────────────────── */

const statusColors: Record<
  string,
  "info" | "warning" | "success" | "danger" | "outline"
> = {
  submitted: "info",
  under_review: "warning",
  accepted: "success",
  rejected: "danger",
  waitlisted: "outline",
};

const statusLabels: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  accepted: "Accepted",
  rejected: "Rejected",
  waitlisted: "Waitlisted",
};

const formFieldLabels: Record<string, string> = {
  interest: "Why are you interested in this program?",
  goals: "What do you hope to gain?",
  experience: "Any relevant experience?",
  referralSource: "How did you hear about us?",
};

const referralLabels: Record<string, string> = {
  website: "Website",
  social_media: "Social Media",
  friend: "Friend or Family",
  school: "School",
  community_event: "Community Event",
  other: "Other",
};

/* ─────────────────────────────────────────────── */
/*  Page                                           */
/* ─────────────────────────────────────────────── */

export default function AdminApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");

  const fetchApplication = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/applications/${id}`);
      const data = await res.json();
      if (data.application) {
        setApplication(data.application);
        setNotes(data.application.reviewer_notes || "");
      }
    } catch {
      console.error("Failed to fetch application");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.application) {
        setApplication(data.application);
      }
    } catch {
      console.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const saveNotes = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewer_notes: notes }),
      });
      const data = await res.json();
      if (data.application) {
        setApplication(data.application);
      }
    } catch {
      console.error("Failed to save notes");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-foreground-muted" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/applications"
          className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-primary-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Applications
        </Link>
        <div className="text-center py-16">
          <FileText className="h-10 w-10 mx-auto text-foreground-subtle mb-3" />
          <p className="text-foreground-muted">Application not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-primary-500 transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Applications
          </Link>
          <h1 className="text-3xl font-display font-bold text-foreground">
            {application.applicant_name}
          </h1>
          <p className="text-foreground-muted mt-1">
            Application for{" "}
            <span className="font-medium text-foreground">
              {application.programs?.title || "Unknown Program"}
            </span>
          </p>
        </div>
        <Badge variant={statusColors[application.status] || "default"}>
          {statusLabels[application.status] || application.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Workflow */}
          <Card hover={false}>
            <CardContent>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Application Status
              </h2>
              <div className="flex flex-wrap gap-3">
                {application.status === "submitted" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => updateStatus("under_review")}
                    disabled={updating}
                  >
                    {updating ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}{" "}
                    Start Review
                  </Button>
                )}
                {application.status === "under_review" && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => updateStatus("accepted")}
                      disabled={updating}
                    >
                      {updating ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-3 w-3" />
                      )}{" "}
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => updateStatus("rejected")}
                      disabled={updating}
                    >
                      {updating ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}{" "}
                      Reject
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => updateStatus("waitlisted")}
                      disabled={updating}
                    >
                      <Clock className="h-3 w-3" /> Waitlist
                    </Button>
                  </>
                )}
                {(application.status === "accepted" ||
                  application.status === "rejected" ||
                  application.status === "waitlisted") && (
                  <>
                    <span className="text-sm text-foreground-muted self-center mr-2">
                      Change status:
                    </span>
                    {application.status !== "accepted" && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => updateStatus("accepted")}
                        disabled={updating}
                      >
                        <CheckCircle2 className="h-3 w-3" /> Accept
                      </Button>
                    )}
                    {application.status !== "rejected" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateStatus("rejected")}
                        disabled={updating}
                      >
                        <XCircle className="h-3 w-3" /> Reject
                      </Button>
                    )}
                    {application.status !== "waitlisted" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => updateStatus("waitlisted")}
                        disabled={updating}
                      >
                        <Clock className="h-3 w-3" /> Waitlist
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => updateStatus("under_review")}
                      disabled={updating}
                    >
                      <Eye className="h-3 w-3" /> Re-open Review
                    </Button>
                  </>
                )}
              </div>
              {application.reviewed_at && (
                <p className="text-xs text-foreground-subtle mt-3">
                  Last reviewed: {formatDate(application.reviewed_at)}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Application Responses */}
          <Card hover={false}>
            <CardContent>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Application Responses
              </h2>
              <div className="space-y-5">
                {application.form_data &&
                  Object.entries(application.form_data).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm font-medium text-foreground-muted mb-1">
                        {formFieldLabels[key] || key}
                      </p>
                      <p className="text-foreground bg-background-elevated rounded-lg p-3 text-sm leading-relaxed">
                        {key === "referralSource"
                          ? referralLabels[value] || value
                          : value || "No response"}
                      </p>
                    </div>
                  ))}
                {(!application.form_data ||
                  Object.keys(application.form_data).length === 0) && (
                  <p className="text-foreground-subtle text-sm">
                    No form responses recorded.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reviewer Notes */}
          <Card hover={false}>
            <CardContent>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Reviewer Notes
              </h2>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add internal notes about this application..."
                className="min-h-[100px]"
              />
              <div className="mt-3 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={saveNotes}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Save className="h-3 w-3" />
                  )}{" "}
                  Save Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card hover={false}>
            <CardContent>
              <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-4">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-foreground-subtle" />
                  <span className="text-sm text-foreground">
                    {application.applicant_name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-foreground-subtle" />
                  <a
                    href={`mailto:${application.applicant_email}`}
                    className="text-sm text-primary-500 hover:underline"
                  >
                    {application.applicant_email}
                  </a>
                </div>
                {application.applicant_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-foreground-subtle" />
                    <span className="text-sm text-foreground">
                      {application.applicant_phone}
                    </span>
                  </div>
                )}
                {application.applicant_age && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-foreground-subtle" />
                    <span className="text-sm text-foreground">
                      Age {application.applicant_age}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Guardian Info */}
          {application.guardian_name && (
            <Card hover={false}>
              <CardContent>
                <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-4">
                  <Shield className="h-4 w-4 inline mr-1.5 -mt-0.5" />
                  Guardian Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-foreground-subtle" />
                    <span className="text-sm text-foreground">
                      {application.guardian_name}
                    </span>
                  </div>
                  {application.guardian_email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-foreground-subtle" />
                      <a
                        href={`mailto:${application.guardian_email}`}
                        className="text-sm text-primary-500 hover:underline"
                      >
                        {application.guardian_email}
                      </a>
                    </div>
                  )}
                  {application.guardian_phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-foreground-subtle" />
                      <span className="text-sm text-foreground">
                        {application.guardian_phone}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submission Details */}
          <Card hover={false}>
            <CardContent>
              <h3 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-4">
                Submission Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground-subtle">Program</span>
                  <span className="text-foreground font-medium">
                    {application.programs?.title || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-subtle">Submitted</span>
                  <span className="text-foreground">
                    {formatDate(application.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-subtle">Status</span>
                  <Badge
                    variant={statusColors[application.status] || "default"}
                  >
                    {statusLabels[application.status] || application.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
