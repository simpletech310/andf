/**
 * ANDF's programs, described from the official Programs page (anewdayfoundation.net).
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
      "Our annual signature conference: classes in finance and technology for college freshmen and sophomores, college-prep sessions for high school students and their parents, and 6 to 12 scholarships awarded each year.",
    long_description:
      "Focused N Financially & Technology Informed (F.I.T.) For A Different World is A New Day Foundation's annual signature conference, built around two groups with one goal: making sure young people are ready for what comes next.\n\nCollege freshmen and sophomores take classes on money and technology, from budgeting, credit, and financial planning to the digital skills that today's careers ask for, along with other practical sessions that help them make the most of their college years.\n\nHigh school students come with a parent. Together they get guidance on getting into college, from applications and financial aid to choosing the right school, and parents have classes of their own so the whole family is ready for the journey.\n\nFocused N F.I.T. is also a scholarship opportunity. Each year ANDF awards 6 to 12 scholarships to high school students, giving low- to moderate-income families real support on the road to college.",
    icon: "GraduationCap",
    color: "from-primary-500 to-primary-700",
    hero_image_url: "/images/experiences/fnf-2025.jpg",
    logo_url: "/images/programs/fnf-logo.jpg",
    features: ["Finance and technology classes for college freshmen and sophomores", "College admissions prep for high school students", "Classes for parents", "6 to 12 scholarships awarded each year", "Motivational speakers", "Career readiness"],
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
    title: "Topgolf Family Experiences",
    tagline: "Parents and teens, learning the game and each other",
    description:
      "Mothers (or mother figures) with their daughters, and fathers (or father figures) with their teen sons, spend time together learning the game of golf and how to really talk to each other.",
    long_description:
      "Topgolf Family Experiences are built around one of the most important relationships in a young person's life: the one with their parent. Daughters come with their mothers or mother figures, and teen boys come with their fathers or father figures.\n\nTogether they learn the game of golf, and alongside it, how to communicate. Guided conversations give parents and teens space to listen, be heard, and talk about the things that are hard to bring up at home, in a setting that feels like a day out, not a lecture.\n\nFamilies leave with new skills on the range and stronger connection off it, a foundation that supports young people long after the day ends. Experiences have taken place in Los Angeles, Atlanta, Chicago, and Washington, D.C.",
    icon: "Target",
    color: "from-emerald-500 to-green-600",
    hero_image_url: "/images/experiences/topgolf-2024.jpg",
    logo_url: "/images/programs/topgolf-logo.jpg",
    features: ["Mothers and daughters", "Fathers and teen sons", "Golf instruction together", "Parent and teen communication", "Guided conversations", "Los Angeles, Atlanta, Chicago, D.C."],
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
    tagline: "Money, tech, and career prep for HBCU students",
    description:
      "In collaboration with HBCU Heroes, an ongoing webinar series for students at historically Black colleges and universities on financial literacy, AI and technology, careers, and community.",
    long_description:
      "HBCU Heroes, in collaboration with A New Day Foundation, provides an ongoing webinar series focused on financial literacy and career preparation, engaging college students from historically Black colleges and universities. The first series ran from September 2024 to August 2026.\n\nThe conversations went well beyond the basics. Students explored artificial intelligence and the technology reshaping the workplace, how to manage money, build credit, and plan for the future, and how to prepare for and grow in their careers.\n\nSessions also made room for community: what it means to lead, give back, and lift others up, and the real experiences young people are navigating today, from campus life to their first jobs.",
    icon: "GraduationCap",
    color: "from-amber-500 to-orange-600",
    hero_image_url: "/images/experiences/lakers-experience.jpg",
    logo_url: "/images/programs/hbcu-heroes-logo.jpg",
    features: ["Webinar series, Sept 2024 to Aug 2026", "Financial literacy", "AI and technology", "Career preparation", "Community and leadership", "HBCU students"],
    outcomes: [],
    gallery_urls: ["/images/experiences/lakers-experience.jpg", "/images/gallery/omega-psi-phi.jpg", "/images/gallery/zeta-phi-beta.jpg"],
  },
];

export const PROGRAMS_BY_SLUG: Record<string, ProgramSummary> = Object.fromEntries(PROGRAMS.map((p) => [p.slug, p]));
