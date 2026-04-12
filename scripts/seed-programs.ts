/**
 * Seed all 7 ANDF programs into the database with full data
 * matching the public frontend detail pages.
 *
 * Usage: npx tsx scripts/seed-programs.ts
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Parse .env.local manually to avoid dotenv dependency
const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
const envVars: Record<string, string> = {};
for (const line of envFile.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim();
}
Object.assign(process.env, envVars);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const programs = [
  {
    slug: "band-camp",
    title: "Band Camp",
    tagline: "Music that moves the soul",
    description: "An immersive musical experience where young people discover their rhythm, build confidence through performance, and connect with professional musicians. From instruments to vocals, our camp covers it all.",
    long_description: "Our Band Camp program is more than just music lessons — it's a transformative experience that builds confidence, teaches discipline, and creates lasting bonds. Under the guidance of professional musicians and educators, participants explore various instruments, develop ensemble skills, and perform in a closing night concert that showcases their growth.\n\nFrom beginners picking up an instrument for the first time to experienced musicians looking to refine their craft, Band Camp meets every participant where they are and helps them reach the next level.",
    icon: "Music",
    logo_url: "/images/partners/band-camp.jpg",
    color: "from-violet-500 to-purple-600",
    hero_image_url: "/images/programs/engaged-students.jpg",
    video_title: "Band Camp Highlights",
    features: ["Professional instrument instruction", "Ensemble and band workshops", "Music theory fundamentals", "Recording studio experience", "Closing night live concert", "Take-home practice resources"],
    outcomes: [
      { stat: "500+", label: "Students Trained" },
      { stat: "95%", label: "Return Rate" },
      { stat: "12", label: "Concerts Performed" },
      { stat: "50+", label: "Instruments Available" },
    ],
    gallery_urls: ["/images/programs/engaged-students.jpg", "/images/programs/band-camp-logo.jpg", "/images/gallery/knowledj-teaches.jpg", "/images/gallery/noel-massie-teaches.jpg", "/images/gallery/opening-panel.jpg", "/images/gallery/event-photo.jpg"],
    display_order: 0,
    is_active: true,
  },
  {
    slug: "drone-experience",
    title: "Drone Experience",
    tagline: "Sky's not the limit",
    description: "Hands-on drone piloting and aerial photography workshops that introduce youth to cutting-edge technology and career opportunities in STEM fields.",
    long_description: "The Drone Experience program puts cutting-edge technology directly into the hands of young people. Participants learn to pilot drones, capture stunning aerial photography, and explore the rapidly growing world of unmanned aerial systems.\n\nBeyond the thrill of flight, this program introduces career pathways in aerospace, filmmaking, agriculture, surveying, and more. Participants work toward understanding FAA regulations and responsible drone operation.",
    icon: "Cpu",
    color: "from-cyan-500 to-blue-600",
    hero_image_url: "/images/programs/drone-teach.jpg",
    video_title: "Drone Experience Highlights",
    features: ["Drone flight training", "Aerial photography & videography", "FAA regulation overview", "Career pathway exploration", "STEM fundamentals", "Equipment provided"],
    outcomes: [
      { stat: "200+", label: "Pilots Trained" },
      { stat: "100%", label: "Hands-on Learning" },
      { stat: "8", label: "Career Paths Explored" },
      { stat: "30+", label: "Drones Available" },
    ],
    gallery_urls: ["/images/programs/drone-teach.jpg", "/images/programs/nasa-workshop.jpg", "/images/gallery/nasa-team-teaches.jpg", "/images/gallery/nasa-workshop-2.jpg", "/images/gallery/swat-experience.jpg", "/images/gallery/leadership-group.jpg"],
    display_order: 1,
    is_active: true,
  },
  {
    slug: "topgolf",
    title: "TopGolf Experience",
    tagline: "Driving success forward",
    description: "A unique blend of sports, networking, and mentorship in an exciting environment that teaches teamwork, builds lasting connections, and develops leadership skills.",
    long_description: "Our TopGolf Experience combines the excitement of golf with meaningful mentorship and networking opportunities. In a relaxed, fun setting, young people connect with professionals, learn about leadership, and develop social skills that will serve them throughout their lives.\n\nThis program breaks down barriers between youth and successful professionals, creating organic connections in a welcoming environment where everyone can have fun while learning.",
    icon: "Target",
    logo_url: "/images/partners/top-golf.jpg",
    color: "from-emerald-500 to-green-600",
    hero_image_url: "/images/gallery/leadership-group.jpg",
    video_title: "TopGolf Experience Highlights",
    features: ["Golf instruction", "Professional networking", "Leadership workshops", "Team building activities", "Career conversations", "Refreshments included"],
    outcomes: [
      { stat: "300+", label: "Participants" },
      { stat: "50+", label: "Mentors Engaged" },
      { stat: "15", label: "Events Hosted" },
      { stat: "90%", label: "Satisfaction Rate" },
    ],
    gallery_urls: ["/images/gallery/leadership-group.jpg", "/images/gallery/raffle-winner.jpg", "/images/gallery/opening-panel.jpg", "/images/gallery/event-photo.jpg"],
    display_order: 2,
    is_active: true,
  },
  {
    slug: "mentors",
    title: "MenTORS",
    tagline: "Men Talking Of Relevant Situations",
    description: "A mentoring initiative where men come together to discuss real-life challenges, career development, and personal growth — creating a safe space for honest conversation and meaningful guidance.",
    long_description: "MenTORS — Men Talking Of Relevant Situations — is a mentoring initiative that creates a safe, honest space for men to discuss the challenges they face in life, career, and community. Through guided group discussions and one-on-one pairings, participants build the tools they need to navigate real-world situations with confidence and integrity.\n\nFrom financial literacy and career development to emotional wellness and fatherhood, MenTORS covers the topics that matter most. Our facilitators and mentors bring lived experience and professional expertise to every session.",
    icon: "MessageCircle",
    logo_url: "/images/partners/mentors.jpg",
    color: "from-red-500 to-rose-600",
    hero_image_url: "/images/gallery/dawnn-steve-wesson.jpg",
    video_title: "MenTORS Highlights",
    features: ["Facilitated group discussions", "One-on-one mentor pairing", "Financial literacy workshops", "Career development sessions", "Emotional wellness support", "Community networking"],
    outcomes: [
      { stat: "100+", label: "Men Mentored" },
      { stat: "24", label: "Sessions Per Year" },
      { stat: "90%", label: "Return Rate" },
      { stat: "40+", label: "Active Mentors" },
    ],
    gallery_urls: ["/images/gallery/dawnn-steve-wesson.jpg", "/images/gallery/volunteer-leader.jpg", "/images/gallery/opening-panel.jpg", "/images/gallery/leadership-group.jpg"],
    display_order: 3,
    is_active: true,
  },
  {
    slug: "sisters-hangout",
    title: "Sisters Hangout",
    tagline: "Empowering young women together",
    description: "A supportive space for young women to connect, share experiences, and build confidence through workshops, peer mentoring, and community activities that celebrate sisterhood and strength.",
    long_description: "Sisters Hangout is a program designed to uplift, empower, and connect young women through meaningful experiences and honest conversations. In a supportive and judgment-free environment, participants explore topics like self-confidence, leadership, wellness, and career exploration.\n\nThrough peer mentoring, creative workshops, and community service projects, Sisters Hangout builds a sisterhood that extends far beyond program hours. Our goal is for every young woman to leave knowing her voice matters and her potential is limitless.",
    icon: "Heart",
    logo_url: "/images/partners/sisters.jpg",
    color: "from-rose-700 to-red-900",
    hero_image_url: "/images/gallery/dawnn-zeta-sorors.jpg",
    video_title: "Sisters Hangout Highlights",
    features: ["Peer mentoring circles", "Leadership development", "Creative expression workshops", "Wellness and self-care", "Community service projects", "College & career prep"],
    outcomes: [
      { stat: "120+", label: "Young Women Served" },
      { stat: "18", label: "Workshops Per Year" },
      { stat: "95%", label: "Confidence Growth" },
      { stat: "30+", label: "Volunteer Mentors" },
    ],
    gallery_urls: ["/images/gallery/dawnn-zeta-sorors.jpg", "/images/gallery/siedah-garrett-dawnn.jpg", "/images/gallery/zeta-phi-beta.jpg", "/images/gallery/scholarship-recipient.jpg", "/images/gallery/raffle-winner.jpg"],
    display_order: 4,
    is_active: true,
  },
  {
    slug: "mentorship",
    title: "Mentorship Program",
    tagline: "Guidance that transforms",
    description: "One-on-one and group mentoring with successful professionals who provide guidance, support, and real-world insight to shape future leaders in every field.",
    long_description: "The Mentorship Program is the heart of A New Day Foundation. We carefully match young people with experienced professionals who share their interests and career aspirations. Through regular meetings, goal-setting sessions, and real-world exposure, mentees develop the skills and confidence they need to succeed.\n\nOur mentors come from diverse backgrounds — entertainment, technology, business, education, and more — ensuring every participant can find guidance tailored to their dreams.",
    icon: "Users",
    color: "from-amber-500 to-orange-600",
    hero_image_url: "/images/programs/mentorship-session.jpg",
    video_title: "Mentorship Program Highlights",
    features: ["1-on-1 mentor matching", "Monthly group sessions", "Goal setting & tracking", "Professional shadowing", "Resume & interview prep", "Ongoing support network"],
    outcomes: [
      { stat: "150+", label: "Active Mentees" },
      { stat: "80+", label: "Volunteer Mentors" },
      { stat: "3yr", label: "Avg. Relationship" },
      { stat: "85%", label: "Goal Achievement" },
    ],
    gallery_urls: ["/images/programs/mentorship-session.jpg", "/images/gallery/dawnn-on-the-move.jpg", "/images/gallery/volunteer-leader.jpg", "/images/gallery/scholarship-recipient.jpg"],
    display_order: 5,
    is_active: true,
  },
  {
    slug: "hbcu-heroes",
    title: "HBCU Heroes",
    tagline: "Celebrating excellence",
    description: "Spotlighting the achievements and impact of Historically Black Colleges and Universities, inspiring the next generation of scholars, leaders, and change-makers.",
    long_description: "HBCU Heroes shines a spotlight on the incredible impact and legacy of Historically Black Colleges and Universities. Through speaker series, campus connections, and scholarship information sessions, we inspire young people to consider the unique opportunities HBCUs offer.\n\nThis program features alumni who have gone on to remarkable careers, providing living proof of the HBCU impact. From virtual summits to in-person campus visits, HBCU Heroes opens doors to higher education excellence.",
    icon: "GraduationCap",
    logo_url: "/images/partners/hbcu-heroes.jpg",
    color: "from-primary-500 to-primary-700",
    hero_image_url: "/images/gallery/omega-psi-phi.jpg",
    video_title: "HBCU Heroes Highlights",
    features: ["Alumni speaker series", "Virtual campus tours", "Scholarship guidance", "Application workshops", "Alumni networking", "Cultural celebrations"],
    outcomes: [
      { stat: "20+", label: "HBCUs Featured" },
      { stat: "400+", label: "Students Reached" },
      { stat: "$50K+", label: "Scholarships Connected" },
      { stat: "10", label: "Campus Visits" },
    ],
    gallery_urls: ["/images/gallery/omega-psi-phi.jpg", "/images/gallery/zeta-phi-beta.jpg", "/images/gallery/dawnn-zeta-sorors.jpg", "/images/gallery/fnf-scholarship-2024.jpg", "/images/gallery/scholarship-recipient.jpg", "/images/gallery/fnf-group-lineup.jpg"],
    display_order: 6,
    is_active: true,
  },
];

async function seed() {
  console.log("Seeding programs...");

  for (const program of programs) {
    // Upsert by slug to be idempotent
    const { data, error } = await supabase
      .from("programs")
      .upsert(program, { onConflict: "slug" })
      .select()
      .single();

    if (error) {
      console.error(`  ✗ ${program.title}: ${error.message}`);
    } else {
      console.log(`  ✓ ${program.title} (${data.id})`);
    }
  }

  console.log("\nDone! All 7 programs seeded.");
}

seed().catch(console.error);
