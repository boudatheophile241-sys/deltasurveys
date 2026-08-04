import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type RatingProps = {
  value: number;
  reviews?: number;
  className?: string;
};

export function Rating({ value, reviews, className }: RatingProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(value);
          return (
            <Star
              key={i}
              className={cn(
                "h-3.5 w-3.5",
                filled ? "fill-amber-400 text-amber-400" : "fill-navy-100 text-navy-100",
              )}
            />
          );
        })}
      </div>
      {reviews !== undefined && (
        <span className="text-xs text-navy-400">({reviews} avis)</span>
      )}
    </div>
  );
}
