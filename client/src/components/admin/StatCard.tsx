import { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = "accent",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "accent" | "violet" | "success" | "warning";
}) {
  const accentClasses: Record<string, string> = {
    accent: "bg-accent-muted text-accent",
    violet: "bg-violet-muted text-violet",
    success: "bg-success-bg text-success",
    warning: "bg-warning-bg text-warning",
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        <span className={`flex size-9 items-center justify-center rounded-lg ${accentClasses[accent]}`}>
          <Icon className="size-4.5" />
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-text-primary">
        {value}
      </p>
    </div>
  );
}
