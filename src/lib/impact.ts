/**
 * One source of truth for the numbers and facts the site repeats.
 * Facts here come from anewdayfoundation.net (History, Programs, Events pages).
 * Numeric totals marked CONFIRM should be verified with ANDF before a donor push.
 */
export const FOUNDED_YEAR = 2017;
export const AGES = "13–19";

export const impact = {
  youthServed: { target: 9000, suffix: "+", label: "Youth served" },
  programs: { target: 7, suffix: "+", label: "Signature programs" },
  cities: { target: 6, suffix: "", label: "Cities reached" },
  since: { target: FOUNDED_YEAR, suffix: "", label: "Serving youth since" },
};

export const CITIES = ["Los Angeles", "New York", "Atlanta", "Chicago", "Washington, D.C.", "Indianapolis"];

/** Organizations ANDF collaborates with, per the official History page. */
export const COLLABORATORS = [
  "UNCF",
  "Junior Achievement",
  "LAUSD",
  "LA Lakers Youth Foundation",
  "Brotherhood Crusade",
  "AIDS Healthcare Foundation",
  "California Coalition on Economic Education",
  "Zeta Phi Beta Sorority, Inc.",
  "Omega Psi Phi Fraternity Youth Leadership Conference",
  "The K.I.S. Foundation for Sickle Cell Disease",
  "EMPOWHER Institute",
  "USC Black Alumni",
  "Educating Young Minds, Inc.",
  "IX Winds Ranch Foundation",
];

/** Dawnn Lewis credits, from the official board page and supported-causes page. */
export const DAWNN_CREDITS = [
  { role: "Grammy Award-winning singer", detail: "Recording artist and vocalist" },
  { role: "ASCAP & BMI Award-winning songwriter", detail: "Multiple-award recipient" },
  { role: "Women Songwriters Hall of Fame inductee", detail: "Inducted with its first class, 2021" },
  { role: "Trumpet Award honoree", detail: "Celebrating Black achievement" },
  { role: "SAG-AFTRA National Board of Directors", detail: "Former National & LA Chair, Singers Committee" },
  { role: "National Advisory Board", detail: "National Center for Civil and Human Rights" },
  { role: "Honorary Doctor of Humane Letters", detail: "Next Dimension University, 2019" },
  { role: "B.M. in Musical Theatre, magna cum laude", detail: "University of Miami" },
];
