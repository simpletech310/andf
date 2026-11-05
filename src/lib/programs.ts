/**
 * ANDF's six programs, described from the official Programs page (anewdayfoundation.net).
 * Used whenever the database is unavailable. No outcome numbers are listed here on purpose:
 * add them only once ANDF confirms them.
 */
export interface ProgramSummary {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  long_description: string;
  icon: string;
  color: string;
  hero_image_url: string;
  logo_url?: string;
  features: string[];
  outcomes: { stat: string; label: string }[];
  gallery_urls: string[];
  video_title?: string;
  youtube_id?: string;
}

export const PROGRAMS: ProgramSummary[] = [
  {
    slug: "focused-n-fit",
    title: "Focused N F.I.T.",
    tagline: "Financially & Technology Informed, For A Different World",
    description:
      "Our annual signature conference for high school juniors and seniors, college freshmen and sophomores, and their parents: a full day of financial and technology literacy, motivation, and scholarships.",
    long_description:
      "Focused N Financially & Technology Informed (F.I.T.) For A Different World is A New Day Foundation's annual signature event, designed for high school juniors and seniors and college freshmen and sophomores, together with their parents.\n\nThis day-long conference offers tangible tools in financial and technology literacy, along with motivational speakers and scholarships for low- to moderate-income college and college-bound students and their families.",
    icon: "GraduationCap",
    color: "from-primary-500 to-primary-700",
    hero_image_url: "/images/experiences/fnf-2025.jpg",
    logo_url: "/images/programs/fnf-logo.jpg",
    features: ["Financial literacy", "Technology literacy", "Scholarships", "Sessions for parents", "Motivational speakers", "College and career prep"],
    outcomes: [],
    gallery_urls: ["/images/experiences/fnf-2025.jpg", "/images/experiences/fnf-2024.jpg", "/images/gallery/fnf-group-lineup.jpg", "/images/gallery/fnf-scholarship-2024.jpg", "/images/gallery/scholarship-recipient.jpg", "/images/gallery/opening-panel.jpg"],
    video_title: "Focused N F.I.T. 2026 Recap",
    youtube_id: "PVyvjWdcxMk",
  },
  {
    slug: "band-camp",
    title: "Band Camp",
    tagline: "Music that moves the soul",
    description:
      "An immersive music experience where students learn hands-on from professional artists, explore diverse styles, and close with a live showcase.",
    long_description:
      "A New Day Foundation Band Camp is an immersive music experience designed to inspire and empower young musicians. Students receive hands-on instruction from professional artists, explore diverse musical styles, and develop performance, teamwork, and leadership skills.\n\nThe camp culminates in a live showcase celebrating creativity, growth, and the power of music.",
    icon: "Music",
    color: "from-violet-500 to-purple-600",
    hero_image_url: "/images/experiences/band-camp-2025.jpg",
    logo_url: "/images/programs/band-camp-logo.jpg",
    features: ["Instruction from professional artists", "Diverse musical styles", "Performance and teamwork", "Live showcase"],
    outcomes: [],
    gallery_urls: ["/images/experiences/band-camp-2025.jpg", "/images/programs/engaged-students.jpg", "/images/gallery/knowledj-teaches.jpg", "/images/gallery/noel-massie-teaches.jpg", "/images/gallery/siedah-garrett-dawnn.jpg"],
    video_title: "Band Camp 2026",
    youtube_id: "J8qrp9nZEfU",
  },
  {
    slug: "topgolf",
    title: "TopGolf Experience",
    tagline: "Brotherhood across four cities",
    description:
      "A coast-to-coast activation that brings young men together for real conversations, mentorship, and brotherhood in Los Angeles, Chicago, Atlanta, and Washington, D.C.",
    long_description:
      "This Topgolf experience brings young men together in a dynamic, uplifting environment, creating space for real conversations, mentorship, and brotherhood across four major cities: Los Angeles, Chicago, Atlanta, and Washington, D.C.\n\nMore than a fun outing, this coast-to-coast activation fosters empowerment, unity, and personal growth, giving young men the support and community they need to thrive.",
    icon: "Target",
    color: "from-emerald-500 to-green-600",
    hero_image_url: "/images/experiences/topgolf-2024.jpg",
    logo_url: "/images/programs/topgolf-logo.jpg",
    features: ["Mentorship", "Real conversations", "Brotherhood", "Los Angeles, Chicago, Atlanta, D.C."],
    outcomes: [],
    gallery_urls: ["/images/experiences/topgolf-2024.jpg", "/images/experiences/topgolf-celebrity-classic-2026.jpg", "/images/gallery/leadership-group.jpg", "/images/gallery/raffle-winner.jpg"],
    video_title: "ANDF Topgolf 2026",
    youtube_id: "RSvrx87U1vg",
  },
  {
    slug: "mentors",
    title: "MenTORS",
    tagline: "Male-to-male mentorship for boys 13–19",
    description:
      "Outings for boys ages 13–19, in small groups of 8 to 20, that open cultural and career doors and build self-esteem through male-to-male mentorship.",
    long_description:
      "Several times a year, ANDF hosts outings for boys ages 13–19 in small groups of 8 to 20 teens. The outings introduce the boys to cultural and career opportunities they may not typically have access to, while fostering fellowship, self-confidence, and exposure to inspiring guest speakers and unique experiences.\n\nEach experience focuses on self-esteem, self-awareness, image-building, and male-to-male mentorship, in a safe, supportive space where teens can share and discuss difficult subjects.",
    icon: "MessageCircle",
    color: "from-red-500 to-rose-600",
    hero_image_url: "/images/experiences/sheriff-crime-lab-2025.jpg",
    logo_url: "/images/programs/mentors-logo.jpg",
    features: ["Small groups of 8–20", "Cultural and career outings", "Guest speakers", "Male-to-male mentorship"],
    outcomes: [],
    gallery_urls: ["/images/experiences/sheriff-crime-lab-2025.jpg", "/images/experiences/harbor-patrol-2025.jpg", "/images/experiences/ifly-2025.jpg", "/images/gallery/swat-experience.jpg", "/images/gallery/dawnn-steve-wesson.jpg"],
  },
  {
    slug: "sisters-hangout",
    title: "Sisters Hangout",
    tagline: "Woman-to-woman mentorship for girls 13–19",
    description:
      "Outings for girls ages 13–19, in small groups of 8 to 20, that open cultural and career doors and build self-esteem through woman-to-woman mentorship.",
    long_description:
      "Several times a year, ANDF hosts outings for girls ages 13–19 in small groups of 8 to 20 teens. The outings introduce the girls to cultural and career opportunities they may not typically have access to, while fostering fellowship, self-confidence, and exposure to inspiring guest speakers and unique experiences.\n\nEach experience focuses on self-esteem, self-awareness, image-building, and woman-to-woman mentorship, in a safe, supportive space where teens can share and discuss difficult subjects.",
    icon: "Heart",
    color: "from-pink-500 to-rose-600",
    hero_image_url: "/images/experiences/color-purple-2025.jpg",
    logo_url: "/images/programs/sisters-logo.jpg",
    features: ["Small groups of 8–20", "Cultural and career outings", "Guest speakers", "Woman-to-woman mentorship"],
    outcomes: [],
    gallery_urls: ["/images/experiences/color-purple-2025.jpg", "/images/experiences/origin-screening-2024.jpg", "/images/experiences/nmaahc-2025.jpg", "/images/gallery/dawnn-zeta-sorors.jpg"],
  },
  {
    slug: "hbcu-heroes",
    title: "HBCU Heroes",
    tagline: "Financial literacy and career prep for HBCU students",
    description:
      "In collaboration with HBCU Heroes, an ongoing webinar series on financial literacy and career preparation for students at historically Black colleges and universities.",
    long_description:
      "HBCU Heroes, in collaboration with A New Day Foundation, provides an ongoing webinar series focused on financial literacy and career preparation, engaging college students from historically Black colleges and universities. The first series ran from September 2024 to August 2025.",
    icon: "GraduationCap",
    color: "from-amber-500 to-orange-600",
    hero_image_url: "/images/experiences/lakers-experience.jpg",
    logo_url: "/images/programs/hbcu-heroes-logo.jpg",
    features: ["Webinar series", "Financial literacy", "Career preparation", "HBCU students"],
    outcomes: [],
    gallery_urls: ["/images/experiences/lakers-experience.jpg", "/images/gallery/omega-psi-phi.jpg", "/images/gallery/zeta-phi-beta.jpg"],
  },
];

export const PROGRAMS_BY_SLUG: Record<string, ProgramSummary> = Object.fromEntries(PROGRAMS.map((p) => [p.slug, p]));
