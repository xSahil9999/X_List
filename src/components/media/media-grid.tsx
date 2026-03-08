import { MediaCard } from "@/components/media/media-card";
import { NormalizedMedia } from "@/lib/types/media";

export function MediaGrid({ items }: { items: NormalizedMedia[] }) {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-borderSoft p-8 text-center text-sm text-textMuted">
        Keine Einträge verfügbar.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((item) => (
        <MediaCard key={`${item.source}-${item.externalId}-${item.mediaType}`} item={item} />
      ))}
    </div>
  );
}
