import { Badge } from "@/components/ui/badge";

type BadgeVariant = "default" | "gold" | "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "outline";

type StatusType =
  | "lead"
  | "donation"
  | "application"
  | "event"
  | "registration"
  | "ad";

const statusMap: Record<StatusType, Record<string, { variant: BadgeVariant; label: string }>> = {
  lead: {
    new: { variant: "gold", label: "New" },
    contacted: { variant: "info", label: "Contacted" },
    engaged: { variant: "success", label: "Engaged" },
    donor: { variant: "gold", label: "Donor" },
    volunteer: { variant: "success", label: "Volunteer" },
    inactive: { variant: "default", label: "Inactive" },
  },
  donation: {
    pending: { variant: "warning", label: "Pending" },
    succeeded: { variant: "success", label: "Succeeded" },
    failed: { variant: "danger", label: "Failed" },
    refunded: { variant: "warning", label: "Refunded" },
    cancelled: { variant: "default", label: "Cancelled" },
  },
  application: {
    submitted: { variant: "info", label: "Submitted" },
    under_review: { variant: "warning", label: "Under Review" },
    accepted: { variant: "success", label: "Accepted" },
    rejected: { variant: "danger", label: "Rejected" },
    waitlisted: { variant: "default", label: "Waitlisted" },
  },
  event: {
    draft: { variant: "default", label: "Draft" },
    published: { variant: "success", label: "Published" },
    cancelled: { variant: "danger", label: "Cancelled" },
    completed: { variant: "info", label: "Completed" },
  },
  registration: {
    confirmed: { variant: "success", label: "Confirmed" },
    waitlisted: { variant: "warning", label: "Waitlisted" },
    cancelled: { variant: "danger", label: "Cancelled" },
  },
  ad: {
    pending_review: { variant: "warning", label: "Pending Review" },
    approved: { variant: "info", label: "Approved" },
    rejected: { variant: "danger", label: "Rejected" },
    active: { variant: "success", label: "Active" },
    expired: { variant: "default", label: "Expired" },
    paused: { variant: "warning", label: "Paused" },
  },
};

interface StatusBadgeProps {
  type: StatusType;
  status: string;
  className?: string;
}

export function StatusBadge({ type, status, className }: StatusBadgeProps) {
  const config = statusMap[type]?.[status];

  if (!config) {
    return (
      <Badge variant="default" className={className}>
        {status}
      </Badge>
    );
  }

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
