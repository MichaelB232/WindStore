export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { username: string };
}

export type Phase = "entering" | "active" | "exiting";

export interface Slot {
  review: Review;
  phase: Phase;
  key: number;
}

export function getInitials(username: string) {
  return username
    .split(/[\s_.-]+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function getAvatarHue(username: string) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

export function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}