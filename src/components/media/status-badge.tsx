import { Badge } from "@/components/ui/badge";
import { STATUS_META } from "@/lib/constants";
import { EntryStatus } from "@/lib/types/media";

export function StatusBadge({ status }: { status: EntryStatus }) {
  const meta = STATUS_META[status];
  return <Badge className={meta.className}>{meta.label}</Badge>;
}
