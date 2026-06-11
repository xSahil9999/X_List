import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "X_List Blog - Anime, Manga & Media News",
  description: "Artikel über Anime, Manga, Filme, Serien und Media-Trends.",
};

const blogPosts = [
  {
    id: 1,
    title: "Top 10 Anime des Jahres 2024",
    excerpt: "Entdecke die besten Anime-Serien, die 2024 die Fans begeistert haben.",
    author: "X_List Team",
    date: "15. Juni 2024",
    category: "Anime",
  },
  {
    id: 2,
    title: "Manga vs. Anime: Unterschiede",
    excerpt: "Erfahre die wichtigsten Unterschiede zwischen Manga und Anime.",
    author: "X_List Team",
    date: "10. Juni 2024",
    category: "Guide",
  },
  {
    id: 3,
    title: "Die besten Film-Adaptationen",
    excerpt: "Erfolgreiche Adaptationen von Serien in Spielfilme.",
    author: "X_List Team",
    date: "5. Juni 2024",
    category: "Filme",
  },
  {
    id: 4,
    title: "Fantasy-Bücher 2024",
    excerpt: "Die besten Fantasy-Romane dieses Jahres.",
    author: "X_List Team",
    date: "28. Mai 2024",
    category: "Bücher",
  },
];

export default function BlogPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Link href="/">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft size={18} /> Zurück
          </Button>
        </Link>
        <h1 className="text-4xl font-bold">X_List Blog</h1>
        <p className="text-lg text-textMuted">
          Artikel über Anime, Manga, Filme, Serien und mehr
        </p>
      </div>

      <div className="rounded-lg border border-accent/30 bg-gradient-to-br from-accent/10 to-accent/5 p-8 space-y-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-accent text-white">
          Beliebtester Artikel
        </span>
        <h2 className="text-2xl font-bold">{blogPosts[0].title}</h2>
        <p className="text-textMuted">{blogPosts[0].excerpt}</p>
        <div className="flex flex-wrap gap-4 text-sm text-textMuted">
          <div className="flex items-center gap-1">
            <User size={16} /> {blogPosts[0].author}
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} /> {blogPosts[0].date}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {blogPosts.slice(1).map((post) => (
          <article
            key={post.id}
            className="rounded-lg border border-borderSoft bg-panel p-6 hover:border-accent/50 transition-colors space-y-4"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold flex-1">{post.title}</h3>
              <span className="inline-block px-2 py-1 text-xs font-semibold bg-accent/20 text-accent rounded">
                {post.category}
              </span>
            </div>
            <p className="text-textMuted text-sm">{post.excerpt}</p>
            <div className="flex flex-wrap gap-4 text-xs text-textMuted">
              <div className="flex items-center gap-1">
                <User size={14} /> {post.author}
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} /> {post.date}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
