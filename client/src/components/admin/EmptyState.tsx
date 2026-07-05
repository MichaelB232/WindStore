import { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface py-16 text-center">
      <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-surface-alt">
        <Icon className="size-5 text-text-muted" />
      </span>
      <p className="font-medium text-text-primary">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
    </div>
  );
}
