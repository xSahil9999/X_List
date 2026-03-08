import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MEDIA_LABEL } from "@/lib/constants";
import { NormalizedMedia } from "@/lib/types/media";

export function MediaCard({ item }: { item: NormalizedMedia }) {
  return (
    <Card className="overflow-hidden p-0">
      <Link href={`/media/${item.mediaType}/${item.externalId}?source=${item.source}`}>
        <div className="relative aspect-[2/3] bg-slate-800">
          {item.imageUrl ? (
            <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-textMuted">Kein Bild</div>
          )}
          <div className="absolute left-2 top-2">
            <Badge className="border-slate-50/20 bg-black/50 text-[11px] text-slate-50">{MEDIA_LABEL[item.mediaType]}</Badge>
          </div>
        </div>
        <div className="space-y-1 p-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-textMain">{item.title}</h3>
          <div className="flex items-center justify-between text-xs text-textMuted">
            <span>{item.releaseDate ? new Date(item.releaseDate).getFullYear() : "-"}</span>
            <span className="inline-flex items-center gap-1">
              <Star size={12} className="text-amber-300" /> {item.externalRating?.toFixed(1) ?? "-"}
            </span>
          </div>
        </div>
      </Link>
    </Card>
  );
}
