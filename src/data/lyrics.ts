export interface LyricLine {
  id: number;
  time: number; // in seconds
  endTime?: number;
  text: string;
  subText?: string;
}

export const SONG_METADATA = {
  title: "Drop Dead",
  artist: "Olivia Rodrigo",
  album: "Unreleased Demo",
  year: "2024",
  defaultStartTime: 0.0,
  audioSrc: "/audio/drop-dead.m4a",
};

export const DROP_DEAD_LYRICS: LyricLine[] = [
  // 0s - 4s: Judul "Drop Dead"
  {
    id: 1,
    time: 0.0,
    endTime: 4.0,
    text: "Drop Dead",
    subText: "Olivia Rodrigo",
  },
  // 4s onwards: Lirik per kata / potongan pendek
  {
    id: 2,
    time: 4.0,
    endTime: 4.9,
    text: "One",
  },
  {
    id: 3,
    time: 4.9,
    endTime: 5.5,
    text: "night",
  },
  {
    id: 4,
    time: 5.5,
    endTime: 6.2,
    text: "I was",
  },
  {
    id: 5,
    time: 6.2,
    endTime: 7.0,
    text: "bored",
  },
  {
    id: 6,
    time: 7.0,
    endTime: 7.7,
    text: "in bed",
  },
  {
    id: 7,
    time: 7.7,
    endTime: 8.2,
    text: "and",
  },
  {
    id: 8,
    time: 8.2,
    endTime: 9.0,
    text: "stalked you",
  },
  {
    id: 9,
    time: 9.0,
    endTime: 10.0,
    text: "on the",
  },
  {
    id: 10,
    time: 10.0,
    endTime: 11.5,
    text: "internet",
  },
  {
    id: 11,
    time: 11.5,
    endTime: 11.8,
    text: "It's",
  },
  {
    id: 12,
    time: 11.8,
    endTime: 13.2,
    text: "feminine",
  },
  {
    id: 13,
    time: 13.2,
    endTime: 14.9,
    text: "intuition",
  },
  {
    id: 14,
    time: 14.9,
    endTime: 15.5,
    text: "'Cuz I",
  },
  {
    id: 15,
    time: 15.5,
    endTime: 16.0,
    text: "always",
  },
  {
    id: 16,
    time: 16.0,
    endTime: 16.7,
    text: "had a",
  },
  {
    id: 17,
    time: 16.7,
    endTime: 17.2,
    text: "vision",
  },
  {
    id: 18,
    time: 17.2,
    endTime: 17.5,
    text: "of us",
  },
  {
    id: 19,
    time: 17.5,
    endTime: 18.0,
    text: "standing",
  },
  {
    id: 20,
    time: 18.0,
    endTime: 18.8,
    text: "like this",
  },
  {
    id: 21,
    time: 18.8,
    endTime: 19.8,
    text: "All pressed",
  },
  {
    id: 22,
    time: 19.8,
    endTime: 20.5,
    text: "up in",
  },
  {
    id: 23,
    time: 20.5,
    endTime: 21.7,
    text: "the bathroom",
  },
  {
    id: 24,
    time: 21.7,
    endTime: 22.5,
    text: "line",
  },
  {
    id: 25,
    time: 22.5,
    endTime: 23.0,
    text: "You're",
  },
  {
    id: 26,
    time: 23.0,
    endTime: 23.4,
    text: "looking",
  },
  {
    id: 27,
    time: 23.4,
    endTime: 23.9,
    text: "like an",
  },
  {
    id: 28,
    time: 23.9,
    endTime: 24.4,
    text: "angel",
  },
  {
    id: 29,
    time: 24.4,
    endTime: 25.0,
    text: "on the",
  },
  {
    id: 30,
    time: 25.0,
    endTime: 25.5,
    text: "walls of",
  },
  {
    id: 31,
    time: 25.5,
    endTime: 26.4,
    text: "Versailles",
  },
  {
    id: 32,
    time: 26.4,
    endTime: 27.2,
    text: "The most",
  },
  {
    id: 33,
    time: 27.2,
    endTime: 28.0,
    text: "alive",
  },
  {
    id: 34,
    time: 28.0,
    endTime: 28.6,
    text: "I've ever",
  },
  {
    id: 35,
    time: 28.6,
    endTime: 29.6,
    text: "been",
  },
  {
    id: 36,
    time: 29.6,
    endTime: 30.5,
    text: "But kiss",
  },
  {
    id: 37,
    time: 30.5,
    endTime: 31.5,
    text: "me",
  },
  {
    id: 38,
    time: 31.5,
    endTime: 32.0,
    text: "and I",
  },
  {
    id: 39,
    time: 32.0,
    endTime: 34.0,
    text: "might...",
  },
  {
    id: 40,
    time: 34.0,
    endTime: 34.5,
    text: "kiss",
  },
  {
    id: 41,
    time: 34.5,
    endTime: 35.2,
    text: "me",
  },
  {
    id: 42,
    time: 35.2,
    endTime: 35.5,
    text: "and",
  },
  {
    id: 43,
    time: 35.5,
    endTime: 37.5,
    text: "I might ...",
  },
  {
    id: 44,
    time: 37.5,
    endTime: 38.0,
    text: "kiss",
  },
  {
    id: 45,
    time: 38.0,
    endTime: 38.5,
    text: "me",
  },
  {
    id: 46,
    time: 38.5,
    endTime: 38.8,
    text: "and",
  },
  {
    id: 47,
    time: 38.8,
    endTime: 40.0,
    text: "I might",
  },
];
