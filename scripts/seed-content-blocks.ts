/**
 * Seed Content Blocks
 *
 * Run with: npx tsx scripts/seed-content-blocks.ts
 *
 * This seeds the content_blocks and page_layouts tables with the
 * existing hardcoded content from the homepage components so the
 * CMS launches pre-populated.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  console.error("Run with: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/seed-content-blocks.ts");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const HOME_BLOCKS = [
  {
    page_key: "home",
    section_key: "hero",
    block_type: "hero",
    display_order: 0,
    content: {
      label: "Empowering Youth Since Day One",
      title_line1: "Building",
      title_line2: "Tomorrow's",
      title_line3: "Leaders",
      subtitle: "A New Day Foundation creates transformative experiences for young people through music, technology, mentorship, and community — shaping the future, one life at a time.",
      background_image: "/images/hero/community-group.jpg",
      cta1_text: "Explore Programs",
      cta1_link: "/programs",
      cta2_text: "Make a Donation",
      cta2_link: "/donate",
    },
  },
  {
    page_key: "home",
    section_key: "mission",
    block_type: "values_grid",
    display_order: 3,
    content: {
      label: "Our Mission",
      title: "A Foundation Built on Purpose",
      description: "We believe every young person deserves the chance to discover their potential. Through innovative programs and dedicated mentorship, we're creating pathways to success.",
      values: [
        { icon: "Sparkles", title: "Innovation", description: "Creating cutting-edge experiences that inspire and engage young minds through technology and creativity." },
        { icon: "Users", title: "Community", description: "Building strong bonds between youth, mentors, and families to create lasting support networks." },
        { icon: "GraduationCap", title: "Education", description: "Providing hands-on learning opportunities that go beyond the classroom and into real-world application." },
        { icon: "Heart", title: "Empowerment", description: "Giving young people the tools, confidence, and vision to become leaders in their communities." },
      ],
    },
  },
  {
    page_key: "home",
    section_key: "impact_stats",
    block_type: "stats_grid",
    display_order: 4,
    content: {
      stats: [
        { target: 2500, suffix: "+", label: "Youth Served", description: "Young lives impacted" },
        { target: 12, suffix: "", label: "Programs", description: "Active initiatives" },
        { target: 85, suffix: "+", label: "Events Hosted", description: "Transformative experiences" },
        { target: 150, prefix: "$", suffix: "K+", label: "Funds Raised", description: "Community support" },
      ],
    },
  },
  {
    page_key: "home",
    section_key: "donation_cta",
    block_type: "cta_banner",
    display_order: 7,
    content: {
      label: "Make an Impact",
      title: "Every Donation Creates\nA New Day",
      description: "Your generosity directly funds programs that change young lives. From instruments for Band Camp to drones for STEM workshops — every dollar makes a difference.",
      amounts: [
        { value: 25, label: "Supplies" },
        { value: 50, label: "Mentoring" },
        { value: 100, label: "Full Day" },
      ],
      cta_text: "Donate Now",
      cta_link: "/donate",
      cta2_text: "See Our Impact",
      cta2_link: "/programs",
    },
  },
];

const HOME_LAYOUT = {
  page_key: "home",
  section_order: ["hero", "andf_now", "events_carousel", "impact_stats", "programs_preview", "partners", "testimonials", "donation_cta"],
};

async function seed() {
  console.log("Seeding content blocks...");

  // Upsert blocks
  for (const block of HOME_BLOCKS) {
    const { error } = await supabase
      .from("content_blocks")
      .upsert(block, { onConflict: "page_key,section_key" });

    if (error) {
      console.error(`  Error seeding ${block.section_key}:`, error.message);
    } else {
      console.log(`  ✓ ${block.page_key}/${block.section_key}`);
    }
  }

  // Upsert layout
  const { error: layoutError } = await supabase
    .from("page_layouts")
    .upsert(HOME_LAYOUT, { onConflict: "page_key" });

  if (layoutError) {
    console.error("  Error seeding home layout:", layoutError.message);
  } else {
    console.log("  ✓ home layout");
  }

  console.log("\nDone! Content blocks have been seeded.");
}

seed().catch(console.error);
