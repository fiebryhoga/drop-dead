export interface LyricLine {
  id: number;
  time: number; // in seconds
  endTime?: number;
  text: string;
  asciiBanner?: string;
}

export const SONG_METADATA = {
  title: "Drop Dead",
  artist: "Olivia Rodrigo",
  album: "Unreleased Demo",
  year: "2024",
  defaultStartTime: 109, // 01:49 as requested
  audioSrc: "/audio/drop-dead.mp3",
};

export const DROP_DEAD_LYRICS: LyricLine[] = [
  {
    id: 1,
    time: 0,
    endTime: 15,
    text: "[ Instrumental Intro ]",
    asciiBanner: "DROP DEAD",
  },
  {
    id: 2,
    time: 15,
    endTime: 30,
    text: "Drop dead, look what you've done",
    asciiBanner: "DROP DEAD",
  },
  {
    id: 3,
    time: 30,
    endTime: 45,
    text: "Standing in the shadows of the morning sun",
    asciiBanner: "SHADOWS",
  },
  {
    id: 4,
    time: 45,
    endTime: 65,
    text: "Can't help the way I feel inside",
    asciiBanner: "FEELINGS",
  },
  {
    id: 5,
    time: 65,
    endTime: 85,
    text: "Running out of places where I can hide",
    asciiBanner: "RUNNING",
  },
  {
    id: 6,
    time: 85,
    endTime: 108.9,
    text: "[ Bridge Build-up ]",
    asciiBanner: "GET READY",
  },
  // Key Highlight Segment starting at 01:49 (109.0s)
  {
    id: 7,
    time: 109.0,
    endTime: 114.5,
    text: "One night I was bored in bed",
    asciiBanner: "BORED IN BED",
  },
  {
    id: 8,
    time: 114.5,
    endTime: 119.8,
    text: "And stalked you on the internet",
    asciiBanner: "INTERNET",
  },
  {
    id: 9,
    time: 119.8,
    endTime: 124.5,
    text: "It's feminine intuition",
    asciiBanner: "INTUITION",
  },
  {
    id: 10,
    time: 124.5,
    endTime: 131.0,
    text: "'Cuz I always had a vision of us standing like this",
    asciiBanner: "HAD A VISION",
  },
  {
    id: 11,
    time: 131.0,
    endTime: 136.5,
    text: "All pressed up in the bathroom line",
    asciiBanner: "BATHROOM LINE",
  },
  {
    id: 12,
    time: 136.5,
    endTime: 142.5,
    text: "You're looking like an angel on the walls of Versailles",
    asciiBanner: "VERSAILLES",
  },
  {
    id: 13,
    time: 142.5,
    endTime: 147.5,
    text: "The most alive I've ever been",
    asciiBanner: "MOST ALIVE",
  },
  {
    id: 14,
    time: 147.5,
    endTime: 155.0,
    text: "But kiss me and I might...",
    asciiBanner: "KISS ME",
  },
  {
    id: 15,
    time: 155.0,
    endTime: 170.0,
    text: "Drop dead...",
    asciiBanner: "DROP DEAD",
  },
  {
    id: 16,
    time: 170.0,
    endTime: 210.0,
    text: "[ Outro / Instrumental Fade ]",
    asciiBanner: "OLIVIA RODRIGO",
  },
];
