import { EntryStatus, MediaType } from "@/lib/types/media";

export const MEDIA_TABS: { key: MediaType | "all"; label: string }[] = [
  { key: "all", label: "Alle" },
  { key: "anime", label: "Anime" },
  { key: "manga", label: "Manga" },
  { key: "movie", label: "Filme" },
  { key: "tv", label: "Serien" },
  { key: "book", label: "Bücher" }
];

export const STATUS_META: Record<EntryStatus, { label: string; className: string }> = {
  completed: {
    label: "Abgeschlossen",
    className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
  },
  in_progress: {
    label: "Gerade dabei",
    className: "bg-sky-500/15 text-sky-300 border-sky-500/30"
  },
  planned: {
    label: "Geplant",
    className: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
  },
  dropped: {
    label: "Abgebrochen",
    className: "bg-rose-500/15 text-rose-300 border-rose-500/30"
  },
  on_hold: {
    label: "Auf Eis",
    className: "bg-amber-500/15 text-amber-300 border-amber-500/30"
  }
};

export const STATUS_LIST: EntryStatus[] = [
  "planned",
  "in_progress",
  "completed",
  "on_hold",
  "dropped"
];

export const MEDIA_LABEL: Record<MediaType, string> = {
  anime: "Anime",
  manga: "Manga",
  movie: "Film",
  tv: "Serie",
  book: "Buch"
};
