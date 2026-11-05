/**
 * Built-in ANDF events.
 *
 * These ship with the site so the events calendar is never empty, even when the
 * database is unreachable. Rows from the `events` table are merged on top; if an
 * admin later creates the same event in the database (same title + day), the
 * database row wins and the built-in copy is dropped.
 *
 * Times are marked TBA until confirmed — set `start_date` with a real time and
 * remove `time_tba` when known.
 */

export interface BuiltInEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  short_description: string;
  event_type: "in_person" | "virtual" | "hybrid";
  status: "published" | "completed";
  program_id: string | null;
  start_date: string;
  end_date: string | null;
  location_name: string | null;
  location_address: string | null;
  max_capacity: number | null;
  current_registrations: number;
  ticket_price: number | null;
  cover_image_url: string | null;
  gallery_urls: string[] | null;
  video_url: string | null;
  is_featured: boolean;
  highlights: string[] | null;
  schedule: null;
  what_to_expect: string | null;
  programs: { title: string; slug: string; icon: string | null; color: string | null } | null;
  time_tba: true;
  built_in: true;
  /** External sign-up link (e.g. Google Form). Falls back to an email RSVP. */
  rsvp_url?: string;
}

const STATIC_ID_PREFIX = "andf-";

export function isBuiltInEventId(id: string) {
  return id.startsWith(STATIC_ID_PREFIX);
}

const TOPGOLF = { title: "Topgolf Family Experiences", slug: "topgolf", icon: null, color: null };
// Drone Experience is no longer a standing program; its events stay on the calendar without a program page.
const DRONE = { title: "Drone Experience", slug: "", icon: null, color: null };
const FNF = { title: "Focused N F.I.T.", slug: "focused-n-fit", icon: null, color: null };

// Noon Pacific keeps the calendar day stable in every US timezone.
const RAW: Omit<BuiltInEvent, "status" | "is_featured">[] = [
  {
    id: `${STATIC_ID_PREFIX}topgolf-family-engagement-2026`,
    slug: "topgolf-family-engagement-2026",
    title: "Top Golf Family Engagement",
    short_description:
      "Parents and teens learn golf together and practice the conversations that matter, at Topgolf Los Angeles.",
    description:
      "Mothers (or mother figures) with their daughters, and fathers (or father figures) with their teen sons, spend the afternoon at Topgolf Los Angeles learning the game together. Guided conversations help parents and teens listen, be heard, and build the kind of communication that carries over to home.",
    event_type: "in_person",
    program_id: null,
    start_date: "2026-03-02T12:00:00-08:00",
    end_date: null,
    location_name: "Topgolf, Los Angeles",
    location_address: "Los Angeles, CA",
    max_capacity: null,
    current_registrations: 0,
    ticket_price: 0,
    cover_image_url: "/images/experiences/topgolf-celebrity-classic-2026.jpg",
    gallery_urls: ["/images/experiences/topgolf-celebrity-classic-2026.jpg", "/images/experiences/topgolf-2024.jpg", "/images/gallery/leadership-group.jpg"],
    video_url: null,
    highlights: ["Golf instruction for all skill levels", "Family team games", "Mentor and family networking"],
    schedule: null,
    what_to_expect: null,
    programs: TOPGOLF,
    time_tba: true,
    built_in: true,
  },
  {
    id: `${STATIC_ID_PREFIX}drone-experience-indianapolis-2026`,
    slug: "drone-experience-indianapolis-2026",
    title: "Drone Experience — Indianapolis",
    short_description:
      "Our Drone Experience took flight in Indianapolis, bringing hands-on drone piloting and STEM career exploration to Indiana youth.",
    description:
      "The ANDF Drone Experience traveled to Indianapolis, where young people learned to pilot drones, capture aerial footage, and explore careers in aerospace, filmmaking, and technology alongside instructors and industry mentors.",
    event_type: "in_person",
    program_id: null,
    start_date: "2026-04-25T12:00:00-04:00",
    end_date: null,
    location_name: "Indianapolis, IN",
    location_address: "Indianapolis, IN",
    max_capacity: null,
    current_registrations: 0,
    ticket_price: 0,
    cover_image_url: "/images/gallery/nasa-team-teaches.jpg",
    gallery_urls: ["/images/gallery/nasa-team-teaches.jpg", "/images/programs/drone-teach.jpg", "/images/gallery/nasa-workshop-2.jpg"],
    video_url: null,
    highlights: ["Hands-on drone flight", "Aerial photography basics", "STEM career conversations"],
    schedule: null,
    what_to_expect: null,
    programs: DRONE,
    time_tba: true,
    built_in: true,
  },
  {
    id: `${STATIC_ID_PREFIX}focused-n-fit-conference-2026`,
    slug: "focused-n-fit-conference-2026",
    title: "Focused N F.I.T. For A Different World Conference",
    short_description:
      "Our signature youth conference — a day of inspiration, workshops, and mentorship for a different world.",
    description:
      "Focused N F.I.T. For A Different World brings young people together with leaders from entertainment, business, technology, and public service for a day of keynotes, breakout workshops, and mentorship designed to help them see — and build — a different world.",
    event_type: "in_person",
    program_id: null,
    start_date: "2026-05-02T12:00:00-07:00",
    end_date: null,
    location_name: "Los Angeles, CA",
    location_address: "Los Angeles, CA",
    max_capacity: null,
    current_registrations: 0,
    ticket_price: 0,
    cover_image_url: "/images/experiences/fnf-2025.jpg",
    gallery_urls: ["/images/experiences/fnf-2025.jpg", "/images/experiences/fnf-2024.jpg", "/images/gallery/fnf-group-lineup.jpg"],
    video_url: null,
    highlights: ["Keynotes and panels", "Breakout workshops", "Mentorship and networking"],
    schedule: null,
    what_to_expect: null,
    programs: FNF,
    time_tba: true,
    built_in: true,
  },
  {
    id: `${STATIC_ID_PREFIX}topgolf-experience-atlanta-2026`,
    slug: "topgolf-experience-atlanta-2026",
    title: "Topgolf Family Experience — Atlanta",
    short_description:
      "The Topgolf Family Experience came to Atlanta: parents and teens learning golf and communication together.",
    description:
      "Parents and teens in Atlanta spent the day learning the game of golf side by side, with guided conversations to help them talk, listen, and connect.",
    event_type: "in_person",
    program_id: null,
    start_date: "2026-06-27T12:00:00-04:00",
    end_date: null,
    location_name: "Topgolf, Atlanta",
    location_address: "Atlanta, GA",
    max_capacity: null,
    current_registrations: 0,
    ticket_price: 0,
    cover_image_url: "/images/experiences/topgolf-2024.jpg",
    gallery_urls: ["/images/experiences/topgolf-2024.jpg", "/images/experiences/topgolf-celebrity-classic-2026.jpg"],
    video_url: null,
    highlights: ["Golf instruction for parents and teens", "Guided family conversations", "Communication skills"],
    schedule: null,
    what_to_expect: null,
    programs: TOPGOLF,
    time_tba: true,
    built_in: true,
  },
  {
    id: `${STATIC_ID_PREFIX}topgolf-experience-chicago-2026`,
    slug: "topgolf-experience-chicago-2026",
    title: "Topgolf Family Experience — Chicago/Schaumburg",
    short_description:
      "The Topgolf Family Experience visited the Chicago area: parents and teens learning golf and communication together.",
    description:
      "Parents and teens in the Chicago area spent the day at Topgolf Schaumburg learning the game side by side, with guided conversations to help them talk, listen, and connect.",
    event_type: "in_person",
    program_id: null,
    start_date: "2026-07-25T12:00:00-05:00",
    end_date: null,
    location_name: "Topgolf, Schaumburg",
    location_address: "Schaumburg, IL",
    max_capacity: null,
    current_registrations: 0,
    ticket_price: 0,
    cover_image_url: "/images/experiences/topgolf-celebrity-classic-2026.jpg",
    gallery_urls: ["/images/experiences/topgolf-celebrity-classic-2026.jpg", "/images/experiences/topgolf-2024.jpg"],
    video_url: null,
    highlights: ["Golf instruction for parents and teens", "Guided family conversations", "Communication skills"],
    schedule: null,
    what_to_expect: null,
    programs: TOPGOLF,
    time_tba: true,
    built_in: true,
  },
  {
    id: `${STATIC_ID_PREFIX}drone-experience-lattc-2026`,
    slug: "drone-experience-lattc-2026",
    title: "Drone Experience at LATTC",
    short_description:
      "Hands-on drone piloting and STEM career exploration at Los Angeles Trade-Technical College.",
    description:
      "Young people take the controls at Los Angeles Trade-Technical College, learning to pilot drones, capture aerial footage, and explore career pathways in aerospace, filmmaking, and technology — guided by instructors and industry mentors.",
    event_type: "in_person",
    program_id: null,
    start_date: "2026-11-18T12:00:00-08:00",
    end_date: null,
    location_name: "Los Angeles Trade-Technical College (LATTC)",
    location_address: "400 W Washington Blvd, Los Angeles, CA 90015",
    max_capacity: null,
    current_registrations: 0,
    ticket_price: 0,
    cover_image_url: "/images/programs/drone-teach.jpg",
    gallery_urls: ["/images/experiences/drone-experience-flyer.jpg", "/images/programs/drone-teach.jpg", "/images/programs/nasa-workshop.jpg", "/images/gallery/nasa-team-teaches.jpg"],
    video_url: null,
    highlights: ["Hands-on drone flight", "Aerial photography basics", "STEM career conversations"],
    schedule: null,
    what_to_expect: null,
    programs: DRONE,
    time_tba: true,
    built_in: true,
    rsvp_url: "https://forms.gle/TV7nhusJrqnjGJK77",
  },
  {
    id: `${STATIC_ID_PREFIX}topgolf-teen-empowerment-2026`,
    slug: "topgolf-teen-empowerment-2026",
    title: "Top Golf Teen Empowerment Experience",
    short_description:
      "Teens connect with professionals over golf, leadership talks, and career conversations at Topgolf Los Angeles.",
    description:
      "Our Teen Empowerment Experience pairs the fun of Topgolf with real conversations about leadership, confidence, and the road ahead. Teens connect with professionals from across industries in a relaxed setting built for meaningful mentorship.",
    event_type: "in_person",
    program_id: null,
    start_date: "2026-12-11T12:00:00-08:00",
    end_date: null,
    location_name: "Topgolf, Los Angeles",
    location_address: "Los Angeles, CA",
    max_capacity: null,
    current_registrations: 0,
    ticket_price: 0,
    cover_image_url: "/images/experiences/topgolf-2024.jpg",
    gallery_urls: ["/images/experiences/topgolf-2024.jpg", "/images/experiences/topgolf-celebrity-classic-2026.jpg", "/images/gallery/opening-panel.jpg"],
    video_url: null,
    highlights: ["Golf instruction", "Leadership workshop", "Professional networking"],
    schedule: null,
    what_to_expect: null,
    programs: TOPGOLF,
    time_tba: true,
    built_in: true,
  },
];

/** Built-in events with status computed from today's date. The next upcoming one is featured. */
export function getBuiltInEvents(now: Date = new Date()): BuiltInEvent[] {
  const withStatus = RAW.map((e) => ({
    ...e,
    status: (new Date(e.start_date) < startOfDay(now) ? "completed" : "published") as BuiltInEvent["status"],
    is_featured: false,
  }));
  const next = withStatus
    .filter((e) => e.status === "published")
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())[0];
  if (next) next.is_featured = true;
  return withStatus;
}

export function getBuiltInEvent(id: string): BuiltInEvent | undefined {
  return getBuiltInEvents().find((e) => e.id === id || e.slug === id);
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dayKey(e: { title: string; start_date: string }) {
  return `${e.title.trim().toLowerCase()}|${new Date(e.start_date).toISOString().slice(0, 10)}`;
}

/**
 * Merge database rows with built-in events, sorted by start date.
 * A DB row with the same title and day replaces the built-in copy.
 * If any DB row is featured, built-in events give up their featured flag.
 */
export function mergeWithBuiltInEvents<T extends { title: string; start_date: string; is_featured: boolean }>(
  dbRows: T[] | null | undefined,
  builtIns: BuiltInEvent[] = getBuiltInEvents()
): (T | BuiltInEvent)[] {
  const rows = dbRows ?? [];
  const taken = new Set(rows.map(dayKey));
  const dbHasFeatured = rows.some((r) => r.is_featured);
  const extras = builtIns
    .filter((e) => !taken.has(dayKey(e)))
    .map((e) => (dbHasFeatured ? { ...e, is_featured: false } : e));
  return [...rows, ...extras].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
}
