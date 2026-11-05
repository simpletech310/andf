/**
 * Dawnn Lewis career + community content.
 *
 * Roles verified against public filmography (Wikipedia, Nov 2026).
 * IMAGES: studio stills (NBC, ABC, Paramount, etc.) are copyrighted. Only add an
 * `image` once ANDF has a licensed or press-kit photo. Drop the file in
 * /public/images/dawnn/roles/ and set `image: "/images/dawnn/roles/<file>.jpg"`.
 * Cards without an image render as a title card, so nothing breaks meanwhile.
 */

export interface Role {
  title: string;
  role: string;
  where: string;
  years: string;
  note?: string;
  image?: string;
  /** Title-card color when there is no image. */
  tone: "midnight" | "sunrise" | "blue" | "plum" | "ink";
}

export const ROLES: Role[] = [
  {
    title: "A Different World",
    role: "Jaleesa Vinson-Taylor",
    where: "NBC",
    years: "1987–1992",
    note: "She also co-wrote the show’s theme song.",
    tone: "sunrise",
  },
  {
    title: "Hangin’ with Mr. Cooper",
    role: "Robin Dumars",
    where: "ABC",
    years: "1992–1993",
    note: "And sang the first-season theme with Holly Robinson and En Vogue.",
    tone: "blue",
  },
  {
    title: "Star Trek: Lower Decks",
    role: "Captain Carol Freeman (voice)",
    where: "Paramount+",
    years: "2020–2024",
    note: "Commanding officer of the U.S.S. Cerritos.",
    tone: "midnight",
  },
  {
    title: "Tina: The Tina Turner Musical",
    role: "Zelma Bullock",
    where: "Broadway",
    years: "2019–2022",
    note: "Tina Turner’s mother.",
    tone: "plum",
  },
  {
    title: "Major Crimes",
    role: "Patrice",
    where: "TNT",
    years: "2014–2018",
    tone: "ink",
  },
  {
    title: "I’m Gonna Git You Sucka",
    role: "Cheryl Spade",
    where: "Feature film",
    years: "1988",
    tone: "sunrise",
  },
];

export const ALSO_HEARD_IN = [
  "Futurama (LaBarbara Conrad)",
  "Doc McStuffins (Grandma McStuffins)",
  "The Simpsons (Bernice Hibbert)",
  "Carmen Sandiego (The Chief)",
];

export interface Credit {
  text: string;
  href: string;
}

/** Openly licensed press photos from Wikimedia Commons. CC BY-SA requires the credit to stay visible. */
export const PRESS_PHOTOS = {
  dragonCon: {
    src: "/images/dawnn/press/dragon-con-2026.jpg",
    alt: "Dawnn Lewis smiling on a panel at Dragon Con, September 2026",
    caption: "At Dragon Con, Atlanta, September 2026",
    credit: { text: "Photo: John Manard, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Dawnn_Lewis_Dragon_Con_September_4_2026_2541.JPG" },
  },
  doctorate: {
    src: "/images/dawnn/press/honorary-doctorate-2019.jpg",
    alt: "Dawnn Lewis in academic regalia holding her honorary doctorate",
    caption: "Receiving an honorary Doctor of Humane Letters, Next Dimension University, 2019",
    credit: { text: "Photo: X4n6, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Dawnn_Lewis_receiving_an_honorary_Doctor_of_Humane_Letters_degree_in_2019_(cropped).jpg" },
  },
};

/** Photos published on anewdayfoundation.net (Supported Causes). Captions follow that page. */
export const COMMUNITY_PHOTOS: { src: string; caption: string; credit?: Credit }[] = [
  { src: PRESS_PHOTOS.doctorate.src, caption: PRESS_PHOTOS.doctorate.caption, credit: PRESS_PHOTOS.doctorate.credit },
  { src: "/images/dawnn/community/concert-gw-bailey.jpg", caption: "With G.W. Bailey at A New Day: Concert for a Cause" },
  { src: "/images/dawnn/community/concert-maxine-waters.jpg", caption: "Congresswoman Maxine Waters at Concert for a Cause" },
  { src: "/images/dawnn/community/concert-patrice-rushen.jpg", caption: "Patrice Rushen, musical director, Concert for a Cause" },
  { src: "/images/dawnn/community/major-crimes-cast.jpg", caption: "With the cast of Major Crimes" },
  { src: "/images/dawnn/community/black-heritage-honors.jpg", caption: "Black Heritage Honors, City of Los Angeles" },
  { src: "/images/dawnn/community/ncchr-ct-vivian.jpg", caption: "With Freedom Rider C.T. Vivian, National Center for Civil and Human Rights" },
  { src: "/images/dawnn/community/uncf-los-angeles.jpg", caption: "Supporting UNCF in Los Angeles" },
  { src: "/images/dawnn/community/lakers-youth-foundation.jpg", caption: "LA Lakers Youth Foundation" },
  { src: "/images/dawnn/community/habitat-for-humanity.jpg", caption: "Habitat for Humanity Greater Los Angeles" },
  { src: "/images/dawnn/community/guyana-mission.jpg", caption: "With students in Guyana on a Maranatha mission build" },
  { src: "/images/dawnn/community/artists-activists-caucus.jpg", caption: "Artists & Activists Caucus, organized by Congresswoman Maxine Waters" },
  { src: "/images/dawnn/community/aarp-service-members.jpg", caption: "AARP spokesperson events with U.S. service members" },
];
