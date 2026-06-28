import { Star } from "lucide-react";
import {
  Review,
  getInitials,
  getAvatarHue,
} from "@/src/lib/producttype/ReviewType";


export function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <>
      {/* Hidden SVG gradient for half-star fill — only rendered once per StarRow */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="halfFill" x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor="rgb(251,191,36)" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
      <span className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const diff = rating - i;
          // full if diff >= 1, half if diff >= 0.25, empty otherwise
          const fill = diff >= 1 ? "full" : diff >= 0.25 ? "half" : "empty";
          return (
            <Star
              key={i}
              size={size}
              className={fill !== "empty" ? "text-amber-400" : "text-border"}
              fill={
                fill === "full"
                  ? "currentColor"
                  : fill === "half"
                    ? "url(#halfFill)"
                    : "none"
              }
            />
          );
        })}
      </span>
    </>
  );
}

// AvatarBubble
export function AvatarBubble({
  review,
  size = 52,
}: {
  review: Review;
  size?: number;
}) {
  const hue = getAvatarHue(review.user.username);
  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        background: `hsl(${hue},60%,88%)`,
        color: `hsl(${hue},50%,35%)`,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.35,
        flexShrink: 0,
      }}
    >
      {getInitials(review.user.username)}
    </div>
  );
}