/** Videos from the official channel, newest first. https://www.youtube.com/@ANewDayFoundation */
export const YOUTUBE_CHANNEL = "https://www.youtube.com/@ANewDayFoundation";

export interface ChannelVideo {
  id: string;
  title: string;
  tag: string;
}

export const VIDEOS: ChannelVideo[] = [
  { id: "PVyvjWdcxMk", title: "Focused N F.I.T. 2026 Recap", tag: "Focused N F.I.T." },
  { id: "RSvrx87U1vg", title: "ANDF Topgolf 2026", tag: "TopGolf" },
  { id: "J8qrp9nZEfU", title: "Band Camp 2026", tag: "Band Camp" },
  { id: "5Sgrth2OD-0", title: "STEM at Woodlawn Elementary", tag: "STEM" },
  { id: "Dzu8TpL0OM0", title: "A New Day at Topgolf", tag: "TopGolf" },
  { id: "hUDS6gJNcPY", title: "Focused N F.I.T. 2025 Recap", tag: "Focused N F.I.T." },
  { id: "RvS3-RFv3UM", title: "Band Camp 2025", tag: "Band Camp" },
  { id: "CZT4O0zu9uU", title: "iFLY Highlight Reel", tag: "Experiences" },
  { id: "Weu6QzjajCw", title: "The Color Purple Highlight Reel", tag: "Experiences" },
  { id: "pbWuHM3arCU", title: "Focused N F.I.T. 2024", tag: "Focused N F.I.T." },
  { id: "G9u6anUkVnI", title: "Focused N F.I.T. 2023", tag: "Focused N F.I.T." },
  { id: "Hb_GyHfUPgI", title: "The ANDF Story", tag: "Our story" },
];

/** Dawnn on Broadway, from the channel. Used on the About page career section. */
export const TINA_VIDEO: ChannelVideo = { id: "gg2KX1scLDQ", title: "Tina on Broadway", tag: "Broadway" };
