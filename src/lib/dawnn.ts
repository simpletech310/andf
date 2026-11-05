/**
 * Dawnn Lewis career + community content.
 *
 * Roles verified against public filmography (Wikipedia, Nov 2026).
 * POSTERS: official posters/key art belong to the studios (NBC, ABC, Paramount, TNT, MGM).
 * Once ANDF has permission (e.g. from Dawnn's press kit), drop the file in
 * /public/images/dawnn/roles/ and set `image: "/images/dawnn/roles/<file>.jpg"` (2:3 works best).
 * The poster then shows on the card front and the trailer still plays on click.
 */

export interface Role {
  title: string;
  role: string;
  where: string;
  years: string;
  note?: string;
  image?: string;
  /** CSS object-position for the poster when it isn't 2:3 (e.g. "30% 50%"). */
  imagePosition?: string;
  /**
   * Official video embedded from the rights holder's own YouTube channel. Its thumbnail
   * becomes the card art and it plays on click. Only use official/verified channels.
   */
  video?: { id: string; label: string; source: string };
  /** Title-card color when there is no image or video. */
  tone: "midnight" | "sunrise" | "blue" | "plum" | "ink";
}

export const ROLES: Role[] = [
  {
    title: "A Different World",
    image: "/images/dawnn/roles/a-different-world.jpg",
    role: "Jaleesa Vinson-Taylor",
    where: "NBC",
    years: "1987–1992",
    note: "She also co-wrote the show’s theme song.",
    tone: "sunrise",
  },
  {
    title: "Hangin’ with Mr. Cooper",
    image: "/images/dawnn/roles/hangin-with-mr-cooper.jpg",
    role: "Robin Dumars",
    where: "ABC",
    years: "1992–1993",
    note: "And sang the first-season theme with Holly Robinson and En Vogue.",
    tone: "blue",
  },
  {
    title: "Star Trek: Lower Decks",
    image: "/images/dawnn/roles/star-trek-lower-decks.jpg",
    role: "Captain Carol Freeman (voice)",
    where: "Paramount+",
    years: "2020–2024",
    note: "Commanding officer of the U.S.S. Cerritos.",
    video: { id: "V3RkBKedKWw", label: "Season 1 official trailer", source: "Paramount+" },
    tone: "midnight",
  },
  {
    title: "Tina: The Tina Turner Musical",
    image: "/images/dawnn/roles/tina-the-tina-turner-musical.jpg",
    imagePosition: "40% 50%",
    role: "Zelma Bullock",
    where: "Broadway",
    years: "2019–2022",
    note: "Tina Turner’s mother.",
    video: { id: "gg2KX1scLDQ", label: "Tina on Broadway", source: "A New Day Foundation" },
    tone: "plum",
  },
  {
    title: "Major Crimes",
    image: "/images/dawnn/roles/major-crimes.jpg",
    role: "Patrice",
    where: "TNT",
    years: "2014–2018",
    video: { id: "ZtZ9PhCw5CE", label: "Official promo", source: "TNT" },
    tone: "ink",
  },
  {
    title: "I’m Gonna Git You Sucka",
    role: "Cheryl Spade",
    where: "Feature film",
    years: "1988",
    image: "/images/dawnn/roles/im-gonna-git-you-sucka.jpg",
    video: { id: "BddDCZwWkw0", label: "Official trailer", source: "Rotten Tomatoes Classic Trailers" },
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
